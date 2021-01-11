import { NextPageContext } from 'next'

import { InitialProps, PageData, InstanceData } from '@/data-types'
import {
  parseLanguageSubfolder,
  getInstanceDataByLang,
  getLandingData,
} from '@/helper/feature-i18n'
import { frontendOrigin } from '@/helper/frontent-origin'

export const fetcherAdditionalData = {
  instance: '',
}

export async function getInitialProps(
  props: NextPageContext
): Promise<InitialProps> {
  const slug =
    props.query.slug === undefined
      ? []
      : typeof props.query.slug === 'string'
      ? [props.query.slug]
      : props.query.slug
  const joinedSlug = slug.join('/')
  const url = '/' + joinedSlug

  const { instance: instance_path, alias } = parseLanguageSubfolder(url)
  const instance =
    fetcherAdditionalData.instance && typeof window !== 'undefined'
      ? fetcherAdditionalData.instance
      : instance_path

  let instanceData: InstanceData | undefined = undefined

  if (typeof window === 'undefined') {
    // only load instanceData serverside
    instanceData = getInstanceDataByLang(instance)
  }

  const rawAlias = alias.substring(1).replace('user/public', 'user/me')

  if (
    rawAlias === 'search' ||
    rawAlias === 'user/notifications' ||
    rawAlias === 'user/me' //fallback for legacy routes /user/me and /user/public
  ) {
    return {
      pageData: {
        kind: rawAlias,
      },
      instanceData,
    }
  }

  if (alias === '/spenden' && instance == 'de') {
    return {
      instanceData,
      pageData: {
        kind: 'donation',
      },
    }
  }

  if (typeof window === 'undefined') {
    if (alias === '/') {
      return {
        instanceData,
        pageData: {
          kind: 'landing',
          landingData: getLandingData(instance),
        },
      }
    }

    //server
    const res = await fetch(
      `${frontendOrigin}/api/frontend/${encodeURIComponent(joinedSlug)}`
    )

    const fetchedData = (await res.json()) as PageData
    // compat course to first page
    /*if (fetchedData.redirect) {
      props.res?.writeHead(301, {
        Location: fetchedData.redirect,
        // Add the content-type for SEO considerations
        'Content-Type': 'text/html; charset=utf-8',
      })
      props.res?.end()
      // We redirect here so the component won't be actually rendered
      return {
        origin: '',
        pageData: { kind: 'error', errorData: { code: 200 } },
      }
    }*/

    if (fetchedData.kind === 'error') {
      props.res!.statusCode = fetchedData.errorData.code
    } else {
      props.res!.setHeader(
        'Cache-Control',
        's-maxage=1, stale-while-revalidate'
      )
    }

    return {
      instanceData,
      pageData: fetchedData,
    }
  } else {
    //client

    try {
      const fromCache = sessionStorage.getItem(`/${instance}${alias}`)
      if (fromCache) {
        return {
          pageData: JSON.parse(fromCache) as PageData,
        }
      }
    } catch (e) {
      //
    }

    const res = await fetch(
      `${frontendOrigin}/api/frontend/${
        fetcherAdditionalData.instance
      }${alias.replace(/\/$/, '')}`
    )
    const fetchedData = (await res.json()) as PageData
    // compat: redirect of courses
    /*if (fetchedData.redirect) {
      const res = await fetch(
        `${fetcherAdditionalData.origin}/api/frontend${fetchedData.redirect}`
      )
      const fetchedData2 = (await res.json()) as FetchedData
      return {
        origin: fetcherAdditionalData.origin,
        pageData: fetchedData2.pageData!,
      }
    }*/
    return {
      pageData: fetchedData,
    }
  }
}

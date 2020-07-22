import { NextPageContext } from 'next'
import absoluteUrl from 'next-absolute-url'

import { InitialProps, PageData, FetchedData } from '@/data-types'
import { deInstanceData } from '@/data/de'

export const fetcherAdditionalData = {
  origin: '',
  instance: 'de',
}

export async function getInitialProps(
  props: NextPageContext
): Promise<InitialProps> {
  const slug =
    props.query.slug === undefined ? [] : (props.query.slug as string[])
  const joinedSlug = slug.join('/')
  const url = '/' + joinedSlug
  const { origin } = absoluteUrl(props.req)

  if (typeof window !== 'undefined') {
    getGa()('set', 'page', url)
    getGa()('send', 'pageview')
  }

  if (
    joinedSlug === '' ||
    joinedSlug === 'search' ||
    joinedSlug === 'spenden'
  ) {
    // TODO: also check what values we might actually need to feed slug-head
    return {
      pageData: {
        kind:
          joinedSlug === ''
            ? 'landing'
            : joinedSlug === 'spenden'
            ? 'donation'
            : joinedSlug,
      },
      instanceData: deInstanceData,
      origin,
    }
  }

  if (typeof window === 'undefined') {
    //server
    const res = await fetch(
      `${origin}/api/frontend/${encodeURIComponent(joinedSlug)}?redirect`
    )

    const fetchedData = (await res.json()) as FetchedData
    // compat course to first page
    if (fetchedData.redirect) {
      props.res?.writeHead(301, {
        Location: fetchedData.redirect,
        // Add the content-type for SEO considerations
        'Content-Type': 'text/html; charset=utf-8',
      })
      props.res?.end()
      // We redirect here so the component won't be actually rendered
      return { origin: '', pageData: { kind: 'error' } }
    }

    if (fetchedData.error) {
      props.res!.statusCode = 404

      return {
        instanceData: deInstanceData,
        pageData: { kind: 'error' },
        origin,
      }
    }

    props.res!.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

    return buildInitialProps(fetchedData, origin)
  } else {
    //client

    try {
      const fromCache = sessionStorage.getItem(url)
      if (fromCache) {
        return {
          origin: fetcherAdditionalData.origin,
          pageData: JSON.parse(fromCache) as PageData,
        }
      }
    } catch (e) {
      //
    }
    const res = await fetch(
      `${fetcherAdditionalData.origin}/api/frontend${url}`
    )
    const fetchedData = (await res.json()) as FetchedData
    // compat: redirect of courses
    if (fetchedData.redirect) {
      const res = await fetch(
        `${fetcherAdditionalData.origin}/api/frontend${fetchedData.redirect}`
      )
      const fetchedData2 = (await res.json()) as FetchedData
      return {
        origin: fetcherAdditionalData.origin,
        pageData: fetchedData2.pageData,
      }
    }
    return {
      origin: fetcherAdditionalData.origin,
      pageData: fetchedData.pageData,
    }
  }
}

function buildInitialProps(
  fetchedData: { pageData: PageData },
  origin: string
): InitialProps {
  return {
    origin,
    instanceData: deInstanceData,
    pageData: fetchedData.pageData,
  }
}

/* eslint-disable */
// Safe access to Google Analytics globals
function getGa(): (...args: any[]) => void {
  const w = (window as unknown) as any
  const ga = w[w['GoogleAnalyticsObject'] || 'ga']
  return ga || (() => {})
}
/* eslint-enable */

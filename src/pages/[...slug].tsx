import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

import { EntityProps } from '@/components/content/entity'
import { TopicProps } from '@/components/content/topic'
import { EntityBaseProps } from '@/components/entity-base'
import { FrontendClientBase } from '@/components/frontend-client-base'
import { LoadingSpinner } from '@/components/loading/loading-spinner'
import { InitialProps, ErrorData, PageData } from '@/data-types'
import { fetchPageData } from '@/fetcher/fetch-page-data'

const EntityBase = dynamic<EntityBaseProps>(() =>
  import('@/components/entity-base').then((mod) => mod.EntityBase)
)
const ErrorPage = dynamic<ErrorData>(() =>
  import('@/components/pages/error-page').then((mod) => mod.ErrorPage)
)
const Topic = dynamic<TopicProps>(() =>
  import('@/components/content/topic').then((mod) => mod.Topic)
)
const Entity = dynamic<EntityProps>(() =>
  import('@/components/content/entity').then((mod) => mod.Entity)
)

const PageView: NextPage<InitialProps> = (initialProps) => {
  const pageData = initialProps.pageData

  if (pageData === undefined) return <ErrorPage code={404} />

  //fallback, should be handled by CFWorker
  if (pageData.kind === 'redirect') {
    if (typeof window !== 'undefined') {
      window.location.href = pageData.target!
    }
    return (
      <FrontendClientBase>
        <LoadingSpinner noText />
      </FrontendClientBase>
    )
  }

  if (pageData.kind === 'single-entity' || pageData.kind === 'taxonomy') {
    const page =
      pageData.kind === 'single-entity' ? (
        <Entity data={pageData.entityData} />
      ) : (
        <Topic data={pageData.taxonomyData} />
      )

    return (
      <FrontendClientBase noContainers>
        <EntityBase page={pageData}>{page}</EntityBase>
      </FrontendClientBase>
    )
  }

  return (
    <FrontendClientBase>
      <ErrorPage
        code={pageData.kind === 'error' ? pageData.errorData.code : 400}
        message={
          pageData.kind === 'error'
            ? pageData.errorData.message
            : 'unsupported type'
        }
      />
    </FrontendClientBase>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async (context) => {
  const alias = (context.params?.slug as string[]).join('/')
  const pageData = await fetchPageData('/' + context.locale! + '/' + alias)
  return {
    props: {
      pageData: JSON.parse(JSON.stringify(pageData)) as PageData, // remove undefined values
    },
    revalidate: 1,
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default PageView

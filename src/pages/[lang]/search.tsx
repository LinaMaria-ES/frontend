import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'

import { HeaderFooter } from '@/components/header-footer'
import { Search } from '@/components/pages/search'
import { SearchPage } from '@/data-types'

const Page: NextPage<{ pageData: SearchPage }> = ({ pageData }) => {
  return (
    <HeaderFooter page={pageData}>
      <Search />
    </HeaderFooter>
  )
}

export default Page

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async (context) => {
  const lang = context.params?.lang as string
  return {
    props: {
      pageData: {
        kind: 'search',
      },
      lang,
    },
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { lang: 'de' } },
      { params: { lang: 'en' } },
      { params: { lang: 'ta' } },
      { params: { lang: 'hi' } },
      { params: { lang: 'fr' } },
      { params: { lang: 'es' } },
    ],
    fallback: 'blocking',
  }
}

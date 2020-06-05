import { faCubes, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GetServerSideProps } from 'next'
import absoluteUrl from 'next-absolute-url'
import dynamic from 'next/dynamic'
import React from 'react'
import styled, { css } from 'styled-components'

import { ArticlePage } from '@/components/content/article-page'
import { CookieBar } from '@/components/content/cookie-bar'
import { HSpace } from '@/components/content/h-space'
import { Horizon } from '@/components/content/horizon'
import { LicenseNotice } from '@/components/content/license-notice'
import type { TopicProps } from '@/components/content/topic'
import type { BreadcrumbsProps } from '@/components/navigation/breadcrumbs'
import { Footer } from '@/components/navigation/footer'
import { Header } from '@/components/navigation/header'
import type { MetaMenuProps } from '@/components/navigation/meta-menu'
import { PrettyLinksProvider } from '@/components/pretty-links-context'
import { SlugHead } from '@/components/slug-head'
import { StyledA } from '@/components/tags/styled-a'
import { StyledH1 } from '@/components/tags/styled-h1'
import { StyledP } from '@/components/tags/styled-p'
import { horizonData } from '@/data/horizon'
import { renderArticle } from '@/schema/article-renderer'

const MetaMenu = dynamic<MetaMenuProps>(() =>
  import('@/components/navigation/meta-menu').then((mod) => mod.MetaMenu)
)
const Breadcrumbs = dynamic<BreadcrumbsProps>(() =>
  import('@/components/navigation/breadcrumbs').then((mod) => mod.Breadcrumbs)
)
const Topic = dynamic<TopicProps>(() =>
  import('@/components/content/topic').then((mod) => mod.Topic)
)

const NewsletterPopup = dynamic<{}>(
  () =>
    import('@/components/scripts/newsletter-popup').then(
      (mod) => mod.NewsletterPopup
    ),
  {
    ssr: false,
  }
)

// TODO: needs type declaration
type PageViewProps = any

function PageView(props: PageViewProps) {
  const { data } = props
  const {
    contentId,
    alias,
    horizonIndices,
    breadcrumbs,
    contentType,
    title,
    navigation,
    license,
    prettyLinks,
  } = data

  const showNav =
    navigation &&
    !(contentType === 'TaxonomyTerm' && data.data?.type === 'topicFolder')
  return (
    <>
      <SlugHead
        title={title}
        data={data}
        contentType={contentType}
        origin={props.origin}
      />
      <Header />
      {showNav && (
        <MetaMenu pagealias={`/${data.data.id}`} navigation={navigation} />
      )}
      <RelatveContainer>
        <MaxWidthDiv showNav={showNav}>
          <PrettyLinksProvider value={prettyLinks}>
            {data.error ? (
              <>
                <HSpace amount={100} />
                <StyledH1>404</StyledH1>
                <StyledP>Diese Seite konnte nicht geladen werden.</StyledP>
                {process.env.NODE_ENV !== 'production' && (
                  <StyledP>
                    Details:{' '}
                    <StyledA href={`/api/frontend${alias}`}>
                      /api/frontend{alias}
                    </StyledA>
                  </StyledP>
                )}
              </>
            ) : null}
            {breadcrumbs && !(contentType === 'Page' && navigation) && (
              <Breadcrumbs entries={breadcrumbs} />
            )}
            <main>
              {data &&
                data.data &&
                (contentType === 'Article' ||
                  contentType === 'Page' ||
                  contentType === 'CoursePage') && (
                  <ArticlePage
                    data={data.data}
                    contentId={contentId}
                    contentType={contentType}
                  />
                )}
              {contentType === 'TaxonomyTerm' && data.data && (
                <Topic data={data.data} contentId={contentId} />
              )}
              {(contentType === 'Video' || contentType === 'Applet') && (
                <>
                  <StyledH1 extraMarginTop>
                    {data.data.title}
                    <span title={contentType}>
                      {' '}
                      <StyledIcon
                        icon={contentType === 'Video' ? faPlayCircle : faCubes}
                      />
                    </span>
                  </StyledH1>
                  {renderArticle(data.data.value.children)}
                </>
              )}
              {(contentType === 'Exercise' ||
                contentType === 'ExerciseGroup') && (
                <>{renderArticle(data.data.value.children)}</>
              )}
              {license && <LicenseNotice data={license} />}
            </main>
            <HSpace amount={40} />
            {horizonIndices && (
              <Horizon
                // TODO: needs type declaration
                entries={horizonIndices.map((index: any) => horizonData[index])}
              />
            )}
          </PrettyLinksProvider>
        </MaxWidthDiv>
      </RelatveContainer>
      <Footer />
      {contentType === 'Page' && data.data && <NewsletterPopup />}
      <CookieBar />
    </>
  )
}

const RelatveContainer = styled.div`
  position: relative;
`

const MaxWidthDiv = styled.div<{ showNav?: boolean }>`
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: ${(props) =>
      props.theme.breakpoints.sm}) AND (max-width: ${(props) =>
      props.theme.breakpoints.md}) {
    margin: 0 0 0 51px;
  }

  ${(props) =>
    props.showNav &&
    css`
      @media (min-width: ${(props) =>
          props.theme.breakpoints.md}) AND (max-width: ${(props) =>
          props.theme.breakpoints.lg}) {
        margin: 0 0 0 200px;
      }
    `}
`

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.lighterblue};
  font-size: 1.73rem;
`

// PageView.getInitialProps = async ({ req, res }) => {
//   const { origin } = absoluteUrl(req)
//   //const resp = await fetch(`${origin}/api/users`)
//   //const users = await resp.json()
//   console.log(origin)
// }

// -> You can not use getInitialProps with getServerSideProps. Please remove getInitialProps. /[...slug]

// TODO: needs type declaration
export const getServerSideProps: GetServerSideProps<any, any> = async (
  props
) => {
  const { origin } = absoluteUrl(props.req)
  const res = await fetch(
    `${origin}/api/frontend/${encodeURIComponent(
      props.params.slug.join('/')
    )}?redirect`
  )
  const data = await res.json()
  // compat course to first page
  if (data.redirect) {
    props.res.writeHead(301, {
      Location: encodeURI(data.redirect),
      // Add the content-type for SEO considerations
      'Content-Type': 'text/html; charset=utf-8',
    })
    props.res.end()
    // compat: return empty props
    return { props: {} }
  }

  if (data.error) {
    props.res.statusCode = 404
  }

  return { props: { data, origin } }
}

export default PageView
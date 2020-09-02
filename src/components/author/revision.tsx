import { faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import ReactDiffViewer from 'react-diff-viewer'
import styled, { css } from 'styled-components'

import { Link } from '../content/link'
import { HSpace } from '@/components/content/h-space'
import { StyledH1 } from '@/components/tags/styled-h1'
import { StyledP } from '@/components/tags/styled-p'
import { useInstanceData } from '@/contexts/instance-context'
import { RevisionData } from '@/data-types'
import { makePadding, makeDefaultButton, inputFontReset } from '@/helper/css'
import { categoryIconMapping } from '@/helper/header-by-content-type'
import { renderArticle } from '@/schema/article-renderer'

// TODO: add timeago

export interface RevisionProps {
  data: RevisionData
}

//current is currently accepted revision
type DisplayMode = 'this' | 'current' | 'compare'

export function Revision({ data }: RevisionProps) {
  const { lang, strings } = useInstanceData()
  const isCurrentRevision = data.thisRevision.id === data.currentRevision.id
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>(
    isCurrentRevision ? 'current' : 'this'
  )

  const dataSet =
    displayMode === 'current' ? data.thisRevision : data.currentRevision

  const hasData = displayMode !== 'compare'

  return (
    <>
      <MetaBar>
        <BackButton
          as="a"
          href={`/entity/repository/history/${data.repositoryId}`}
        >
          <FontAwesomeIcon icon={faList} /> {strings.revisions.toOverview}
        </BackButton>
        <div>{renderButtons()}</div>
      </MetaBar>
      <HSpace amount={5} />
      <StyledH1>
        {strings.revisions.revision} {renderCategoryIcon()}
      </StyledH1>
      {isCurrentRevision && (
        <StyledP>
          <i>{strings.revisions.thisIsCurrentVersion}</i>
        </StyledP>
      )}

      <StyledP>
        {data.changes !== undefined && (
          <>
            <b>{strings.revisions.changes}:</b> {data.changes}
            <br />
            <br />
          </>
        )}
        {new Date(data.date).toLocaleString(lang)} by{' '}
        <Link href={`/user/profile/${data.user.id}`}>{data.user.username}</Link>
      </StyledP>

      {renderBoxheader(strings.revisions.title)}
      <Box>
        {hasData && <StyledH1>{dataSet.title}</StyledH1>}
        {renderDiffViewer('title')}
      </Box>
      {renderBoxheader(strings.revisions.content)}
      <Box>
        {hasData && renderArticle(dataSet.content || [])}
        {renderDiffViewer('content')}
      </Box>
      {dataSet.metaTitle !== undefined && (
        <>
          {renderBoxheader(strings.revisions.metaTitle)}
          <Box withPadding={hasData}>
            {hasData && dataSet.metaTitle} {renderDiffViewer('metaTitle')}
          </Box>
        </>
      )}
      {dataSet.metaDescription !== undefined && (
        <>
          {renderBoxheader(strings.revisions.metaDescription)}
          <Box withPadding={hasData}>
            {hasData && dataSet.metaDescription}{' '}
            {renderDiffViewer('metaDescription')}
          </Box>
        </>
      )}
      <HSpace amount={20} />
    </>
  )

  function renderBoxheader(title: string) {
    return (
      <BoxHeader>
        <b>{title}:</b>
      </BoxHeader>
    )
  }

  function renderButtons() {
    return (
      <span>
        {!isCurrentRevision &&
          renderButton('compare', strings.revisions.compare)}
        {renderButton('current', strings.revisions.currentVersion)}
        {!isCurrentRevision &&
          renderButton('this', strings.revisions.thisVersion)}
      </span>
    )
  }

  function renderButton(mode: DisplayMode, title: string) {
    //blur-hack, use https://caniuse.com/#feat=css-focus-visible when supported
    return (
      <Button
        onPointerUp={(e) => e.currentTarget.blur()}
        onClick={() => setDisplayMode(mode)}
        current={displayMode === mode}
      >
        {title}
      </Button>
    )
  }

  function renderCategoryIcon() {
    if (!data.type) return null
    return (
      <span title={strings.categories[data.type]}>
        {' '}
        <StyledIcon icon={categoryIconMapping[data.type]} />{' '}
      </span>
    )
  }

  type DiffViewerOptions = 'content' | 'title' | 'metaTitle' | 'metaDescription'

  function renderDiffViewer(type: DiffViewerOptions) {
    if (hasData) return null

    if (type === 'content') {
      return (
        <ReactDiffViewer
          oldValue={JSON.stringify(data.thisRevision.content, null, 2)}
          newValue={JSON.stringify(data.currentRevision.content, null, 2)}
          splitView
          hideLineNumbers
        />
      )
    }
    return (
      <DiffViewerWrapper>
        <ReactDiffViewer
          oldValue={data.thisRevision[type]}
          newValue={data.currentRevision[type]}
          splitView={false}
          hideLineNumbers
          showDiffOnly={false}
        />
      </DiffViewerWrapper>
    )
  }
}

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.lighterblue};
  font-size: 1.73rem;
`
const Box = styled.div<{ withPadding?: boolean }>`
  ${(props) => props.withPadding && makePadding}
  font-size: 1.125rem;
  padding-top: 30px;
  padding-bottom: 30px;
  border: 1px solid ${(props) => props.theme.colors.lighterblue};
  border-radius: 15px;

  > h1 {
    margin-top: 0;
    margin-bottom: 0;
  }
`

const BoxHeader = styled(StyledP)`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 5px;
`

const Button = styled.button<{ current?: boolean }>`
  ${makeDefaultButton}
  ${inputFontReset}
  margin-left: 5px;
  font-size: 1.125rem;
  font-weight: bold;
  &:hover {
    background-color: ${(props) => props.theme.colors.lighterblue};
  }
  ${(props) =>
    props.current &&
    css`
      background-color: ${(props) => props.theme.colors.brand};
      color: #fff;
      &:hover {
        background-color: ${(props) => props.theme.colors.brand};
      }
    `}
`

const BackButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.bluewhite};
  &:hover {
    background-color: ${(props) => props.theme.colors.brand};
  }
  color: ${(props) => props.theme.colors.brand};

  > svg {
    font-size: 1rem;
    margin-right: 2px;
    padding-top: 1px;
  }
`

const MetaBar = styled.div`
  ${makePadding}
  display: flex;
  justify-content: space-between;

  position: sticky;
  z-index: 50;
  padding-top: 25px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  top: 0;
  background-color: #fff;
`

const DiffViewerWrapper = styled.div`
  pre {
    ${inputFontReset}
    font-size: 1.125rem !important;
  }
`

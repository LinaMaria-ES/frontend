import { faFile, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { useState, Fragment } from 'react'
import styled from 'styled-components'

import { makeMargin } from '../../helper/css'
import { renderArticle } from '../../schema/article-renderer'
import { ShareModalProps } from '../user-tools/share-modal'
import { UserTools } from '../user-tools/user-tools'
import { LicenseNotice } from './license-notice'
import { Link } from './link'
import { useAuthentication } from '@/auth/use-authentication'
import { useInstanceData } from '@/contexts/instance-context'
import { useLoggedInData } from '@/contexts/logged-in-data-context'
import {
  TaxonomyData,
  TaxonomySubTerm,
  TaxonomyLink,
  CategoryTypes,
} from '@/data-types'
import { categoryIconMapping } from '@/helper/icon-by-entity-type'

export interface TopicProps {
  data: TaxonomyData
}

const ShareModal = dynamic<ShareModalProps>(() =>
  import('@/components/user-tools/share-modal').then((mod) => mod.ShareModal)
)

export function Topic({ data }: TopicProps) {
  const [open, setOpen] = useState(false)
  const { strings } = useInstanceData()

  const isFolder =
    data.taxonomyType === 'topicFolder' ||
    data.taxonomyType === 'curriculumTopicFolder'

  const isTopic =
    data.taxonomyType === 'topic' || data.taxonomyType === 'curriculumTopic'

  const hasExercises = data.exercisesContent.length > 0
  const defaultLicense = hasExercises ? getDefaultLicense() : undefined

  return (
    <>
      <Headline>
        {data.title}
        {isFolder && (
          <span title={strings.entities.topicFolder}>
            {' '}
            <StyledIcon icon={faFile} />{' '}
          </span>
        )}
      </Headline>
      {renderUserTools({ aboveContent: true })}
      <div className="min-h-1/2">
        <ImageSizer>
          {data.description &&
            renderArticle(data.description, `taxdesc${data.id}`)}
        </ImageSizer>
        {data.subterms &&
          data.subterms.map((child) => (
            <Fragment key={child.title}>
              <SubTopic data={child} subid={child.id} id={data.id} />
            </Fragment>
          ))}
        {data.exercisesContent &&
          data.exercisesContent.map((exercise, i) => {
            return (
              <Fragment key={i}>
                {renderArticle(
                  [exercise],
                  `tax${data.id}`,
                  `ex${exercise.context.id}`
                )}
              </Fragment>
            )
          })}
        {isTopic && (
          <LinkList>
            <CategoryLinks full category="articles" links={data.articles} />
            <CategoryLinks full category="exercises" links={data.exercises} />
            <CategoryLinks full category="videos" links={data.videos} />
            <CategoryLinks full category="applets" links={data.applets} />
            <CategoryLinks full category="courses" links={data.courses} />
            <CategoryLinks full category="events" links={data.events} />
          </LinkList>
        )}
        {isFolder && data.events && (
          <LinkList>
            <CategoryLinks full category="events" links={data.events} />
          </LinkList>
        )}
      </div>

      {defaultLicense && (
        <LicenseNotice data={defaultLicense} path={['license']} />
      )}

      {renderUserTools()}
      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        contentId={data.id}
      />
    </>
  )

  function renderUserTools(setting?: { aboveContent?: boolean }) {
    return (
      <UserTools
        onShare={() => setOpen(true)}
        hideEdit
        data={{
          type: 'Taxonomy',
          id: data.id,
          taxonomyFolder: isFolder,
          taxonomyTopic: isTopic,
        }}
        id={data.id}
        aboveContent={setting?.aboveContent}
      />
    )
  }

  function getDefaultLicense() {
    for (let i = 0; i < data.exercisesContent.length; i++) {
      const content = data.exercisesContent[i]

      if (content.type === 'exercise-group') {
        if (content.license?.default) return content.license
      } else {
        if (content.task?.license?.default) return content.task.license
        if (content.solution?.license?.default) return content.solution.license
      }
    }
    //no part of collection has default license so don't show default notice.
    return undefined
  }
}

function SubTopic({
  data,
  subid,
  id,
}: {
  data: TaxonomySubTerm
  subid: number
  id: number
}) {
  return (
    <>
      <h2 className="my-3">
        <StyledLink href={data.url} path={[subid, 'title']}>
          {data.title}
        </StyledLink>
      </h2>

      <Wrapper>
        <Overview>
          {' '}
          <ImageSizer>
            {data.description &&
              renderArticle(data.description, `tax${id}`, `subtopic${subid}`)}
          </ImageSizer>
        </Overview>

        <LinkList>
          <CategoryLinks category="articles" links={data.articles} id={subid} />
          <CategoryLinks
            category="exercises"
            links={data.exercises}
            id={subid}
          />
          <CategoryLinks category="videos" links={data.videos} id={subid} />
          <CategoryLinks category="applets" links={data.applets} id={subid} />
          <CategoryLinks category="courses" links={data.courses} id={subid} />
          <CategoryLinks category="folders" links={data.folders} id={subid} />
          <CategoryLinks category="events" links={data.events} id={subid} />
        </LinkList>
      </Wrapper>
    </>
  )
}

interface CategoryLinksProps {
  links: TaxonomyLink[]
  full?: boolean
  category: CategoryTypes
  id?: number
}

function CategoryLinks({ links, full, category, id }: CategoryLinksProps) {
  const { strings } = useInstanceData()
  const loggedInData = useLoggedInData()
  const auth = useAuthentication()

  if (links.length === 0) return null
  return (
    <LinkSection full={full} key={category}>
      <div>
        <LinkSectionHeadline>
          {strings.categories[category]}{' '}
          <FontAwesomeIcon icon={categoryIconMapping[category]} />
        </LinkSectionHeadline>

        {links.map((link, i) => {
          if (!auth.current && link.unrevised) return null
          return (
            <StyledLink2
              className={link.unrevised ? 'opacity-60' : undefined}
              href={link.url}
              key={link.url + '_' + link.title}
              path={full ? [category, i] : [id!, category, i]}
            >
              {link.title}
              {link.unrevised && (
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  title={loggedInData?.strings.revisions.unrevisedTaxNote}
                  className="ml-1"
                />
              )}
            </StyledLink2>
          )
        })}
      </div>
    </LinkSection>
  )
}

const Wrapper = styled.div`
  margin-bottom: 20px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${(props) => props.theme.colors.lightgray};
  &:last-child {
    border-bottom: 0;
  }
  @media (max-width: ${(props) => props.theme.breakpointsMax.mobile}) {
    flex-direction: column;
  }
`

const Overview = styled.div`
  flex: 1 1 40%;
`

const ImageSizer = styled.div`
  img {
    margin-top: 22px;
    @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
      margin-bottom: 20px;
    }
  }
`

const Headline = styled.h1`
  font-size: 2rem;
  ${makeMargin}
  margin-top: 32px;
  margin-bottom: 40px;
  line-height: normal;
  font-weight: bold;
`

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.brand};
  display: block;
  font-size: 1.65rem;
  text-decoration: none;
  ${makeMargin}
  hyphens: auto;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`

const LinkList = styled.div`
  display: flex;
  flex: 1 1 55%;
  flex-direction: column;
  ${makeMargin}
  margin-top: 6px;
`

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.lighterblue};
  font-size: 1.43rem;
  vertical-align: initial;
`

const LinkSection = styled.div<{ full?: boolean }>`
  align-items: flex-start;
  display: flex;

  margin-bottom: ${(props) => props.full && '1.5rem'};

  margin-top: ${(props) => !props.full && '20px'};
  @media (min-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-top: ${(props) => (!props.full ? '20px' : '8px')};
  }

  &:first-child {
    margin-top: 0;
  }

  @media (max-width: ${(props) => props.theme.breakpointsMax.mobile}) {
    flex-direction: column;
  }
`

const LinkSectionHeadline = styled.h4`
  color: ${(props) => props.theme.colors.dark1};
  font-size: 1.125rem;
  margin: 0 0 13px;
  font-weight: 600;
`

const StyledLink2 = styled(Link)`
  color: ${(props) => props.theme.colors.brand};
  cursor: pointer;
  font-size: 1.2rem;
  margin-bottom: 12px;
  display: block;
  text-decoration: none;
  line-height: normal;

  &:hover {
    text-decoration: underline;
  }
`

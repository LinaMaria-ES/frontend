import { faCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { gql } from 'graphql-request'
import { NextPage } from 'next'
import React from 'react'
import styled from 'styled-components'

import { StyledTable } from '../tags/styled-table'
import { StyledTd } from '../tags/styled-td'
import { StyledTh } from '../tags/styled-th'
import { StyledTr } from '../tags/styled-tr'
import { useGraphqlSwrWithAuth } from '@/api/use-graphql-swr'
import { Link } from '@/components/content/link'
import { MaxWidthDiv } from '@/components/navigation/max-width-div'
import { RelativeContainer } from '@/components/navigation/relative-container'
import { StyledH1 } from '@/components/tags/styled-h1'
import { StyledP } from '@/components/tags/styled-p'
import { useInstanceData } from '@/contexts/instance-context'
import { useLoggedInData } from '@/contexts/logged-in-data-context'
import { getRawTitle } from '@/fetcher/create-title'
import { QueryResponse } from '@/fetcher/query'
import { makeLightButton } from '@/helper/css'
import { shouldUseNewAuth } from '@/helper/feature-auth'
import { entityIconMapping } from '@/helper/icon-by-entity-type'

/* TO DO: 

- i18n
- sort out error / loading handling
- cleanup
- 

*/

export function ManageSubscriptions() {
  const [mounted, setMounted] = React.useState(!shouldUseNewAuth())

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const loggedInData = useLoggedInData()
  const { strings } = useInstanceData()

  const { data, error } = useGraphqlSwrWithAuth<{
    subscriptions: {
      nodes: QueryResponse[]
    }
  }>({
    query: gql`
      query {
        subscriptions {
          nodes {
            __typename
            id
            alias
            ... on User {
              username
            }
            ... on TaxonomyTerm {
              type
              name
            }
            ... on Exercise {
              taxonomyTerms {
                nodes {
                  navigation {
                    path {
                      nodes {
                        label
                      }
                    }
                  }
                }
              }
            }
            ... on ExerciseGroup {
              taxonomyTerms {
                nodes {
                  navigation {
                    path {
                      nodes {
                        label
                      }
                    }
                  }
                }
              }
            }
            ... on Page {
              currentRevision {
                title
              }
            }
            ... on Article {
              currentRevision {
                title
              }
            }
            ... on Video {
              currentRevision {
                title
              }
            }
            ... on Applet {
              currentRevision {
                title
              }
            }
            ... on CoursePage {
              currentRevision {
                title
              }
            }
            ... on Course {
              currentRevision {
                title
              }
            }
            ... on Event {
              currentRevision {
                title
              }
            }
          }
        }
      }
    `,
    config: {
      refreshInterval: 60 * 60 * 1000, //60min -> only update on cache mutation
    },
  })

  if (!mounted) return null

  if (!loggedInData) return renderUnauthorized()

  const loggedInStrings = loggedInData.strings.subscriptions
  if (loggedInStrings === undefined) return null

  if (error) return renderUnknownError()
  if (!data) return renderLoading()

  return wrapInContainer(
    <StyledTable>
      <thead>
        <StyledTr>
          <StyledTh>Object</StyledTh>
          <StyledTh>E-Mails</StyledTh>
          <StyledTh>Abonnement</StyledTh>
        </StyledTr>
      </thead>
      <tbody>
        {data?.subscriptions.nodes.map((entry) => {
          const typenameCamelCase = (entry.__typename.charAt(0).toLowerCase() +
            entry.__typename.slice(1)) as keyof typeof strings.entities

          const title =
            getRawTitle(entry, 'de') ?? strings.entities[typenameCamelCase]

          return (
            <StyledTr key={entry.id}>
              <StyledTd>
                <span title={strings.entities[typenameCamelCase]}>
                  {' '}
                  <StyledIcon
                    icon={
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      typenameCamelCase === 'topicFolder'
                        ? faCircle
                        : entityIconMapping[typenameCamelCase] ?? faCircle
                    }
                  />{' '}
                </span>
                <Link href={entry.alias ?? ''}>{title}</Link>
              </StyledTd>
              <StyledTd>
                <Button
                  href={`https://de.serlo.org/subscription/update/${entry.id}/0`}
                >
                  {loggedInStrings.noMails}
                </Button>
              </StyledTd>
              <StyledTd>
                <Button
                  href={`https://de.serlo.org/subscription/update/${entry.id}/1`}
                >
                  {loggedInStrings.noNotifications}
                </Button>
              </StyledTd>
            </StyledTr>
          )
        })}
      </tbody>
    </StyledTable>
  )

  function wrapInContainer(children: JSX.Element) {
    return (
      <RelativeContainer>
        <MaxWidthDiv showNav>
          <main>
            <StyledH1 extraMarginTop>
              {strings.subscriptions.subscriptions}
            </StyledH1>
            <Wrapper>{children}</Wrapper>
          </main>
        </MaxWidthDiv>
      </RelativeContainer>
    )
  }

  // Turn into component
  function renderUnauthorized() {
    return wrapInContainer(
      <>
        <StyledP>
          <Link href="/api/auth/login">
            {strings.subscriptions.pleaseLogInLink}
          </Link>{' '}
          {strings.subscriptions.pleaseLogInText}
        </StyledP>
      </>
    )
  }

  // Turn into component
  function renderUnknownError() {
    console.log(error)
    return wrapInContainer(
      <>
        <StyledP>{loggedInStrings.unknownProblem}</StyledP>
      </>
    )
  }

  // TODO: turn into component
  function renderLoading() {
    return wrapInContainer(
      <StyledP style={{ marginTop: '50px' }}>
        <ColoredIcon>
          <FontAwesomeIcon icon={faSpinner} spin size="1x" />
        </ColoredIcon>{' '}
        {loggedInStrings.loading}
      </StyledP>
    )
  }
}

const ColoredIcon = styled.span`
  color: ${(props) => props.theme.colors.brand};
`

const Wrapper = styled.div`
  margin-bottom: 80px;
`

const Button = styled.a`
  ${makeLightButton}
  font-size: 1rem;
`

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.brand};
`

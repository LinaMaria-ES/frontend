import { faTimes, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { StyledTd } from '../tags/styled-td'
import { StyledTh } from '../tags/styled-th'
import { StyledTr } from '../tags/styled-tr'
import { UserLink } from '../user/user-link'
import { Link } from '@/components/content/link'
import { TimeAgo } from '@/components/time-ago'
import { useInstanceData } from '@/contexts/instance-context'
import type { HistoryRevisionsData } from '@/data-types'
import { makeLightButton, makeMargin } from '@/helper/css'

export interface RevisionHistoryProps {
  data?: HistoryRevisionsData
}

export function RevisionHistory({ data }: RevisionHistoryProps) {
  const { strings } = useInstanceData()
  if (!data) return null

  return (
    <Table>
      <thead>
        <StyledTr>
          <StyledTh>{strings.revisionHistory.changes}</StyledTh>
          <StyledTh style={{ minWidth: '90px' }}>
            {strings.revisionHistory.author}
          </StyledTh>
          <StyledTh>{strings.revisionHistory.date}</StyledTh>
          <StyledTh>&nbsp;</StyledTh>
          <StyledTh>&nbsp;</StyledTh>
        </StyledTr>
      </thead>
      <tbody>
        {data.revisions?.nodes.map((entry) => {
          const isCurrent = entry.id === data.currentRevision.id
          return (
            <StyledTr key={entry.id}>
              <StyledTd>
                {isCurrent && (
                  <span title={strings.revisions.currentNotice}>✅ </span>
                )}
                {/* TODO: Remove isCurrent check once this is solved: https://github.com/serlo/serlo.org-database-layer/issues/102 */}
                {entry.trashed && !isCurrent && (
                  <span title={strings.revisions.rejectedNotice}>
                    <FontAwesomeIcon icon={faTimes} />{' '}
                  </span>
                )}
                <b>{entry.changes}</b>
              </StyledTd>
              <StyledTd>
                <UserLink user={entry.author} />
              </StyledTd>
              <StyledTd>
                <TimeAgo datetime={new Date(entry.date)} dateAsTitle />
              </StyledTd>
              <StyledTd>
                <Button
                  href={`/entity/repository/compare/${data.id}/${entry.id}`}
                >
                  <FontAwesomeIcon icon={faEye} size="1x" />
                </Button>
              </StyledTd>
              <StyledTd>
                <Button
                  title={strings.revisionHistory.createNew}
                  href={`/entity/repository/add-revision/${data.id}/${entry.id}`}
                >
                  <FontAwesomeIcon icon={faPencilAlt} size="1x" />
                </Button>
              </StyledTd>
            </StyledTr>
          )
        })}
      </tbody>
    </Table>
  )
}

const Button = styled(Link)`
  ${makeLightButton}
  margin: 0 auto;
  font-size: 1rem;
`

export const Table = styled.table`
  ${makeMargin}
  border-collapse: collapse;
  width: 100%;
`

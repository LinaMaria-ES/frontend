import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { gql } from 'graphql-request'
import styled from 'styled-components'

import { useGraphqlSwrWithAuth } from '@/api/use-graphql-swr'

export interface UnreadNotificationsCountProps {
  icon?: FontAwesomeIconProps['icon']
  onlyNumber?: boolean
}

export function UnreadNotificationsCount({
  icon,
  onlyNumber,
}: UnreadNotificationsCountProps) {
  const { data } = useGraphqlSwrWithAuth<{
    notifications: {
      totalCount: number
    }
  }>({
    query: gql`
      {
        notifications(unread: true) {
          totalCount
        }
      }
    `,
    config: {
      refreshInterval: 60 * 1000, // seconds
    },
  })

  const count = data === undefined ? 0 : data.notifications.totalCount
  const displayCount = count > 9 ? '+' : count

  if (onlyNumber) return <>{data === undefined ? '…' : count}</>

  return (
    <StyledFaLayer active={count > 0} className="fa-layers fa-fw">
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          style={{ height: '1.45rem', width: '1.25rem', paddingTop: '0' }}
        />
      )}
      {/* TODO: Think about better css styling here? */}
      <NotificationsNumber className="group-hover:text-brand group-active:text-brand transition-all">
        {displayCount}
      </NotificationsNumber>
    </StyledFaLayer>
  )
}

const StyledFaLayer = styled.span<{ active: boolean }>`
  color: ${(props) => (props.active ? props.theme.colors.brand : 'inherit')};
`

const NotificationsNumber = styled.span`
  display: block;
  font-size: 0.9rem;
  position: absolute;
  margin-top: -1px;
  color: #fff;
  z-index: 200;
  text-align: center;
  width: 20px;
`

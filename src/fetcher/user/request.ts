import { AuthorizationPayload, Scope } from '@serlo/authorization'
import { request } from 'graphql-request'

import { convertState } from '../convert-state'
import { User } from '../query-types'
import { userQuery } from './query'
import { endpoint } from '@/api/endpoint'
import { UserPage } from '@/data-types'

export async function requestUser(
  path: string,
  instance: string
): Promise<UserPage> {
  const { uuid, authorization } = await request<{
    uuid: User
    authorization: AuthorizationPayload
  }>(endpoint, userQuery, {
    path,
    instance,
  })

  if (uuid.__typename === 'User') {
    // wip: Need to be implemented in the API
    const chatName = uuid.username === 'Kulla' ? 'kulla' : uuid.username

    return {
      kind: 'user/profile',
      newsletterPopup: false,
      userData: {
        ...uuid,
        // wip: actually request this from API
        motivation:
          uuid.username === 'Kulla'
            ? 'Mein Ziel bei Serlo: Jedes Kind / jeder Jugendliche soll unabhängig der finanziellen Möglichkeiten seiner Familie optimal auf seinem Bildungsweg unterstützt werden.'
            : undefined,
        chatUrl: `https://community.serlo.org/direct/${chatName}`,
        imageUrl: `https://community.serlo.org/avatar/${chatName}`,
        description: getDescription(uuid),
        roles: uuid.roles.nodes.map((role) => {
          return {
            role: role.role,
            instance:
              role.scope == null || role.scope === Scope.Serlo
                ? null
                : role.scope.substring('serlo.org:'.length),
          }
        }),
      },
      authorization,
    }
  } else {
    throw new Error('User not found')
  }
}

function getDescription(uuid: User) {
  if (uuid.description == null) return undefined

  const description =
    uuid.description === 'NULL'
      ? JSON.stringify({
          plugin: 'text',
          state: [
            {
              type: 'p',
              children: {
                text: 'This is where we display the description on a the production server.',
              },
            },
          ],
        })
      : uuid.description

  return convertState(description)
}

import { ThreadAware } from '@serlo/api'
import { gql } from 'graphql-request'

import { useGraphqlSwrWithoutAuth } from '@/api/use-graphql-swr'

const query = gql`
  query getComments($id: Int!) {
    uuid(id: $id) {
      ... on ThreadAware {
        threads {
          nodes {
            archived
            trashed
            comments {
              nodes {
                id
                trashed
                content
                archived
                createdAt
                author {
                  username
                  alias
                  id
                  activeAuthor
                  activeDonor
                  activeReviewer
                }
              }
            }
          }
        }
      }
    }
  }
`
export function useCommentData(id: number) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data, error } = useGraphqlSwrWithoutAuth<{ uuid: ThreadAware }>({
    query,
    variables: { id },
    config: {
      refreshInterval: 60 * 60 * 1000, //60min -> update on cache mutation
    },
  })

  const untrashedThreads = data?.uuid.threads.nodes.filter(
    (node) => !node.trashed
  )
  const activeThreads = untrashedThreads?.filter((thread) => !thread.archived)
  const archivedThreads = untrashedThreads?.filter((thread) => thread.archived)

  const commentData = { active: activeThreads, archived: archivedThreads }
  const commentCount = untrashedThreads?.reduce((acc, thread) => {
    return acc + thread.comments.nodes.length
  }, 0)

  return { commentData, commentCount, error }
}

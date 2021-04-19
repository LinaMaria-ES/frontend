import { faComments, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Comment as CommentType, Thread as ThreadType } from '@serlo/api'
// import { Thread as AuthThread } from '@serlo/authorization'
import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { Lazy } from '../content/lazy'
import { Guard } from '../guard'
import { PleaseLogIn } from '../user/please-log-in'
import { CommentArchive } from './comment-archive'
import { CommentForm } from './comment-form'
import { Thread } from './thread'
import { useAuthentication } from '@/auth/use-authentication'
// import { useCanDo } from '@/auth/use-can-do'
import { StyledH2 } from '@/components/tags/styled-h2'
import { useInstanceData } from '@/contexts/instance-context'
import { isClient } from '@/helper/client-detection'
import {
  useCreateThreadMutation,
  useCreateCommentMutation,
} from '@/helper/mutations'
import { scrollToPrevious } from '@/helper/scroll'
import { useCommentData } from '@/helper/use-comment-data'

export interface CommentAreaProps {
  id: number
  noForms?: boolean
}

export type CommentsData = CommentType[]
export type ThreadsData = ThreadType[]

export function CommentArea({ id: entityId, noForms }: CommentAreaProps) {
  const [highlightedCommentId, setHighlightedCommentId] = useState<
    number | undefined
  >(undefined)
  const container = useRef<HTMLDivElement>(null)
  const { strings } = useInstanceData()
  const auth = useAuthentication()
  const [showThreadChildren, setShowThreadChildren] = useState<string[]>([])
  const createThread = useCreateThreadMutation()
  const createComment = useCreateCommentMutation()
  const { commentData, commentCount, error } = useCommentData(entityId)

  // EXAMPLE
  // const canDo = useCanDo()
  // console.log(canDo(AuthThread.createThread))

  const showAll = isClient && window.location.hash.startsWith('#comment-')

  useEffect(() => {
    if (showAll && highlightedCommentId === undefined) {
      if (container.current) scrollToPrevious(container.current)
      const id = parseInt(window.location.hash.replace('#comment-', ''))
      if (!isNaN(id)) setHighlightedCommentId(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll, container, entityId])

  return (
    <div ref={container} className="comment-area-container">
      <Guard data={commentData} error={error}>
        <>
          {renderStartThreadForm()}
          {renderContent()}
        </>
      </Guard>
    </div>
  )

  function renderContent() {
    if (commentCount === undefined || (!auth.current && commentCount == 0))
      return null

    return (
      <>
        {commentCount > 0 && (
          <>
            <CustomH2>
              {/* i18n Note: Pluralisation hack */}
              <StyledIcon icon={faComments} /> {commentCount}{' '}
              {commentCount === 1
                ? strings.comments.commentsOne
                : strings.comments.commentsMany}
            </CustomH2>

            <Lazy>
              {renderThreads()}
              {renderArchive()}
            </Lazy>
          </>
        )}
      </>
    )
  }

  function renderStartThreadForm() {
    if (noForms) return null
    return (
      <>
        <CustomH2 id="comments">
          <StyledIcon icon={faQuestionCircle} /> {strings.comments.question}
        </CustomH2>
        {auth.current === null ? (
          <PleaseLogIn />
        ) : (
          <CommentForm
            placeholder={strings.comments.placeholder}
            onSend={onSend}
          />
        )}
      </>
    )
  }

  function renderThreads() {
    return commentData.active?.map((thread) => (
      <Thread
        key={thread.id}
        thread={thread}
        showChildren={showAll ? true : showThreadChildren.includes(thread.id)}
        highlightedCommentId={highlightedCommentId}
        renderReplyForm={renderReplyForm}
        highlight={setHighlightedCommentId}
        onShowChildren={onShowThreadChildren}
      />
    ))
  }

  function renderReplyForm(threadId: string) {
    if (!auth.current || noForms) return null
    return (
      <CommentForm
        placeholder={strings.comments.placeholderReply}
        threadId={threadId}
        reply
        onSend={onSend}
      />
    )
  }

  function renderArchive() {
    return (
      <CommentArchive
        show={showAll}
        data={commentData.archived}
        highlightedCommentId={highlightedCommentId}
        highlight={setHighlightedCommentId}
      />
    )
  }

  function onShowThreadChildren(threadId: string) {
    setShowThreadChildren([...showThreadChildren, threadId])
  }

  async function onSend(content: string, reply?: boolean, threadId?: string) {
    if (auth.current === null) return false

    if (reply) {
      if (threadId === undefined) return false
      setShowThreadChildren([...showThreadChildren, threadId])
      return createComment({
        content,
        threadId,
        subscribe: true,
        sendEmail: false,
      })
    } else {
      return createThread({
        title: '',
        content,
        objectId: entityId,
        subscribe: true,
        sendEmail: false,
      })
    }
  }
}

const CustomH2 = styled(StyledH2)`
  margin-top: 40px;
  border-bottom: 0;
`

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.lighterblue};
  font-size: 1.73rem;
`

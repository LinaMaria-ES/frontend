import Tippy, { TippyProps } from '@tippyjs/react'
import cookie from 'cookie'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { Fragment } from 'react'

import { SubButtonStyle, SubLink } from '../navigation/menu'
import { AuthorToolsData, HoverSubList, Li } from './author-tools-hover-menu'
import { useAuthentication } from '@/auth/use-authentication'
import { useInstanceData } from '@/contexts/instance-context'
import { useLoggedInData } from '@/contexts/logged-in-data-context'
import { UserRoles } from '@/data-types'
import { csrReload } from '@/helper/csr-reload'
import { useSetUuidStateMutation } from '@/helper/mutations'
import { showToastNotice } from '@/helper/show-toast-notice'
import { useIsSubscribed } from '@/helper/use-is-subscribed'

export enum Tool {
  Abo = 'abo',
  AddCoursePage = 'addCoursePage',
  AddGroupedTextExercise = 'addGroupedTextExercise',
  ChangeLicense = 'changeLicense',
  CopyItems = 'copyItems',
  Curriculum = 'curriculum',
  Edit = 'edit',
  History = 'history',
  Log = 'log',
  MoveCoursePage = 'moveCoursePage',
  MoveItems = 'moveItems',
  MoveToExercise = 'moveToExercise',
  NewEntitySubmenu = 'newEntitySubmenu',
  Organize = 'organize',
  PageConvert = 'pageConvert',
  PageHistory = 'pageHistory',
  PageSetting = 'pageSetting',
  Sort = 'sort',
  SortEntities = 'sortEntities',
  Trash = 'trash',
}

interface ToolConfig {
  url?: string
  title?: string
  forRoles?: UserRoles[]
  entityId?: number
  renderer?: (entityId?: number) => JSX.Element
}

type ToolsConfig = Record<Tool, ToolConfig>

export interface AuthorToolsProps {
  tools: Tool[]
  entityId: number
  data: AuthorToolsData
}

const tippyDefaultProps: Partial<TippyProps> = {
  delay: [0, 270],
  interactiveBorder: 40,
  interactive: true,
  placement: 'left-end',
}

export function AuthorTools({ tools, entityId, data }: AuthorToolsProps) {
  const loggedInData = useLoggedInData()
  const instanceData = useInstanceData()
  const { isSubscribed, updateIsSubscribed } = useIsSubscribed(data.id)
  const auth = useAuthentication()

  const setUuidState = useSetUuidStateMutation()

  const router = useRouter()
  if (!loggedInData) return null
  const loggedInStrings = loggedInData.strings
  const entities = instanceData.strings.entities
  const lang = instanceData.lang

  const RoleEverybody = [UserRoles.Guest, UserRoles.Login]

  const toolsConfig = {
    abo: {
      renderer: abo,
    },
    convert: {
      url: `/page/revision/create/${entityId}/${data.revisionId || ''}`,
      forRoles: [],
    },
    pageConvert: {
      url: `/page/revision/create/${entityId}/${data.revisionId || ''}`,
      title: loggedInStrings.authorMenu.convert,
      forRoles: [UserRoles.PageBuilder],
    },
    log: {
      url: `/event/history/${entityId}`,
      forRoles: RoleEverybody,
    },
    history: {
      url: `/entity/repository/history/${entityId}`,
      forRoles: RoleEverybody,
    },
    sort: {
      url: `/entity/link/order/${entityId}/link`,
      forRoles: [UserRoles.Reviewer, UserRoles.TaxonomyManager],
    },
    edit: {
      url: `/entity/repository/add-revision/${entityId}`,
    },
    curriculum: {
      url: `/entity/taxonomy/update/${entityId}`,
      title: loggedInStrings.authorMenu.editAssignments,
    },
    trash: {
      renderer: trash,
      forRoles: [UserRoles.Admin],
    },
    newEntitySubmenu: {
      renderer: renderNewEntity,
    },
    pageHistory: {
      url: `/page/revision/revisions/${data.id}`,
      title: loggedInStrings.authorMenu.history,
    },
    pageSetting: {
      url: `/page/update/${data.id}`,
      title: loggedInStrings.authorMenu.settings,
      forRoles: [UserRoles.PageBuilder],
    },
    moveCoursePage: {
      url: `/entity/link/move/link/${data.id}/${data.courseId!}`,
      forRoles: [UserRoles.TaxonomyManager, UserRoles.Reviewer],
    },
    organize: {
      url: `/taxonomy/term/organize/${data.id}`,
      forRoles: [UserRoles.TaxonomyManager],
    },
    sortEntities: {
      url: `/taxonomy/term/sort/entities/${data.id}`,
    },
    copyItems: {
      url: `/taxonomy/term/copy/batch/${data.id}`,
      forRoles: [UserRoles.TaxonomyManager],
    },
    addGroupedTextExercise: {
      url: `/entity/create/grouped-text-exercise?link%5Btype%5D=link&link%5Bchild%5D=${data.id}`,
    },
    changeLicense: {
      url: `/entity/license/update/${data.id}`,
      forRoles: [UserRoles.Admin],
    },
    moveItems: {
      url: `/taxonomy/term/move/batch/${data.id}`,
      forRoles: [UserRoles.TaxonomyManager, UserRoles.Reviewer],
    },
    moveToExercise: {
      url: `/entity/link/move/link/${data.id}/${data.parentId!}`,
      title: data.grouped
        ? loggedInStrings.authorMenu.moveToGroupedTextExercise
        : loggedInStrings.authorMenu.moveToTextExercise,
      forRoles: [UserRoles.TaxonomyManager, UserRoles.Reviewer],
    },
    addCoursePage: {
      url: `/entity/create/course-page?link%5Btype%5D=link&link%5Bchild%5D=${data.courseId!}`,
    },
  } as ToolsConfig

  return (
    <>
      {tools.map((toolName) => {
        const {
          forRoles = [UserRoles.Login],
          renderer,
          url,
          title,
        } = toolsConfig[toolName]
        const roles = auth.current?.roles || [UserRoles.Guest]
        const hasPower =
          forRoles.filter((role) => {
            return roles.indexOf(role) > -1
          }).length > 0

        if (hasPower) {
          if (renderer) {
            return (
              <Fragment key={`${title ?? renderer.name}`}>
                {renderer(entityId)}
              </Fragment>
            )
          }
          if (url) return renderLi(url, title || getTranslatedString(toolName))
        }
      })}
    </>
  )

  function getTranslatedString(toolName: Tool) {
    return toolName in loggedInStrings.authorMenu
      ? loggedInStrings.authorMenu[
          toolName as keyof typeof loggedInStrings.authorMenu
        ]
      : ''
  }

  function abo() {
    if (isSubscribed) {
      return renderFetchLi(
        `/unsubscribe/${entityId}`,
        loggedInStrings.authorMenu.unsubscribeNotifications
      )
    }
    return (
      <div>
        <Tippy
          {...tippyDefaultProps}
          content={
            <HoverSubList>
              {renderFetchLi(
                `/subscribe/${entityId}/0`,
                loggedInStrings.authorMenu.subscribeNotifications
              )}
              {renderFetchLi(
                `/subscribe/${entityId}/1`,
                loggedInStrings.authorMenu.subscribeNotificationsAndMail
              )}
            </HoverSubList>
          }
        >
          <Li>
            <SubLink as="div" tabIndex={0}>
              <SubButtonStyle>
                ◂ {loggedInStrings.authorMenu.subscribe}
              </SubButtonStyle>
            </SubLink>
          </Li>
        </Tippy>
      </div>
    )
  }

  function trash() {
    return (
      <Li
        key={
          data.trashed
            ? loggedInStrings.authorMenu.restoreContent
            : loggedInStrings.authorMenu.moveToTrash
        }
      >
        <SubButtonStyle
          as="button"
          onClick={() => {
            void setUuidState({ id: [data.id], trashed: !data.trashed })
          }}
        >
          {data.trashed
            ? loggedInStrings.authorMenu.restoreContent
            : loggedInStrings.authorMenu.moveToTrash}
        </SubButtonStyle>
      </Li>
    )
  }

  function renderNewEntity() {
    const shouldRenderEvents =
      (lang === 'de' && router.asPath === '/community/veranstaltungen') ||
      (lang !== 'de' && router.asPath.startsWith('/community'))

    if (data.taxonomyFolder || data.taxonomyTopic)
      return (
        <Li>
          <Tippy
            {...tippyDefaultProps}
            content={
              <HoverSubList>
                {data.taxonomyFolder && (
                  <>
                    {renderLi(
                      `/entity/create/text-exercise?taxonomy%5Bterm%5D=${data.id}`,
                      entities.exercise
                    )}
                    {renderLi(
                      `/entity/create/text-exercise-group?taxonomy%5Bterm%5D=${data.id}`,
                      entities.exerciseGroup
                    )}
                  </>
                )}

                {data.taxonomyTopic && (
                  <>
                    {renderLi(
                      `/entity/create/article?taxonomy%5Bterm%5D=${data.id}`,
                      entities.article
                    )}
                    {renderLi(
                      `/entity/create/course?taxonomy%5Bterm%5D=${data.id}`,
                      entities.course
                    )}
                    {renderLi(
                      `/entity/create/video?taxonomy%5Bterm%5D=${data.id}`,
                      entities.video
                    )}
                    {renderLi(
                      `/entity/create/applet?taxonomy%5Bterm%5D=${data.id}`,
                      entities.applet
                    )}
                    {shouldRenderEvents &&
                      renderLi(
                        `/entity/create/event?taxonomy%5Bterm%5D=${data.id}`,
                        entities.event
                      )}
                  </>
                )}
              </HoverSubList>
            }
          >
            <SubLink as="div" tabIndex={0}>
              <SubButtonStyle>
                ◂ {loggedInStrings.authorMenu.newEntity}
              </SubButtonStyle>
            </SubLink>
          </Tippy>
        </Li>
      )
  }

  function renderLi(href: string, text: string) {
    return (
      <Li key={text}>
        <SubLink href={href}>
          <SubButtonStyle>{text}</SubButtonStyle>
        </SubLink>
      </Li>
    )
  }

  function renderFetchLi(href: string, text: string, csrf?: boolean) {
    return (
      <Li>
        <SubButtonStyle
          as="button"
          onClick={() => fetchLegacyUrl(href, text, csrf)}
        >
          {text}
        </SubButtonStyle>
      </Li>
    )
  }

  //quick experiment
  function fetchLegacyUrl(url: string, text: string, csrf?: boolean) {
    //TODO: this works quite nicely, but the fetch below does not :)
    if (url.startsWith('/subscribe') || url.startsWith('/unsubscribe')) {
      updateIsSubscribed(data.id, !isSubscribed)
      return false
    }

    NProgress.start()

    const cookies = cookie.parse(
      typeof window === 'undefined' ? '' : document.cookie
    )

    const options = csrf
      ? { method: 'POST', body: JSON.stringify({ csrf: cookies['CSRF'] }) }
      : {}

    try {
      void fetch(url, options)
        .then((res) => {
          //if location.href is not res.url there was probably an authentication error. use api mutation in the future.
          if (res.status === 200 && location.href.startsWith(res.url)) {
            NProgress.done()
            showToastNotice(`'${text}' erfolgreich `, 'success')

            if (
              url.startsWith('/subscribe') ||
              url.startsWith('/unsubscribe')
            ) {
              //TODO: Mutate Subscribed here

              return false
            }

            setTimeout(() => {
              csrReload()
            }, 1500)
          } else {
            showErrorNotice()
          }
        })
        .catch(() => {
          showErrorNotice()
        })
    } catch (e) {
      console.log(e)
      showErrorNotice()
    }

    function showErrorNotice() {
      NProgress.done()
      showToastNotice('Something went wrong… Please try again.', 'warning')
      return false
    }
  }
}

import {
  faClock,
  faPencilAlt,
  faShareAlt,
  faTools,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { LazyTippy } from '../navigation/lazy-tippy'
import { AuthorToolsData } from './author-tools-hover-menu'
import { useAuthentication } from '@/auth/use-authentication'
import { useInstanceData } from '@/contexts/instance-context'
import { useLoggedInComponents } from '@/contexts/logged-in-components'
import { useLoggedInData } from '@/contexts/logged-in-data-context'

interface UserToolsProps {
  id: number
  onShare?: () => void
  hideEdit: boolean
  data: AuthorToolsData
  unrevisedRevision?: number
  aboveContent?: boolean
}

export interface UserToolsData {
  editHref: string
}

export function UserTools({
  id,
  onShare,
  hideEdit,
  data,
  unrevisedRevision,
  aboveContent,
}: UserToolsProps) {
  const { strings } = useInstanceData()
  const auth = useAuthentication()
  const loggedInData = useLoggedInData()
  const lic = useLoggedInComponents()

  // note: we hide the ui on ssr and fade it in on the client
  const [firstPass, setFirstPass] = useState(true)

  useEffect(() => {
    if (firstPass && (!auth.current || (auth.current && lic))) {
      setFirstPass(false)
    }
  }, [auth, lic, firstPass])

  // note: this component is added twice, once without aboveContent and once with it
  // (responsive variants)

  // HELP!! This component got somewhat super complicated ^^
  // (maybe I have some better ideas another day ...)

  return aboveContent ? renderInlineContainer() : renderSideContainer()

  function fadeIn() {
    return clsx('transition-opacity', firstPass ? 'opacity-0' : 'opacity-100')
  }

  function buttonClassName() {
    // no autocomplete here yet
    if (aboveContent) {
      return clsx(
        'serlo-button serlo-make-interactive-green',
        'text-sm m-0.5 ml-1 leading-browser'
      )
    } else {
      return clsx(
        'serlo-button serlo-make-interactive-transparent-green',
        'py-1 m-1 text-base leading-browser'
      )
    }
  }

  function renderInlineContainer() {
    return (
      <nav
        className={clsx(
          'mr-4 -mt-4 mb-8',
          'flex lg:hidden justify-end',
          fadeIn()
        )}
      >
        {renderButtons()}
      </nav>
    )
  }

  function renderSideContainer() {
    return (
      <nav
        className={clsx(
          'absolute right-8 bottom-8 h-full',
          'lg:flex hidden items-end',
          fadeIn()
        )}
      >
        <div className="sticky bottom-8 flex-col flex items-start">
          {renderButtons()}
        </div>
      </nav>
    )
  }

  function renderButtons() {
    if (firstPass) {
      if (aboveContent) {
        return <button className={buttonClassName()}>X</button> // placeholder button, avoid layout shift
      }
      return null
    }

    return data.type === 'Profile' ? (
      renderProfileButtons()
    ) : (
      <>
        {(!hideEdit || auth.current) && renderEdit()}
        {renderShare()}
        {auth.current && renderExtraTools()}
      </>
    )
  }

  function renderEdit() {
    // TODO!!! Check permissions. createEntityRevision / editTaxonomy ?
    // show history should only available to people who are able to create revision ? (= guest)

    const showHistory = unrevisedRevision !== undefined && unrevisedRevision > 0

    if (showHistory) {
      return renderUnrevised()
    }

    const editHref =
      data.type == 'Page'
        ? `/page/revision/create/${data.id}/${data.revisionId || ''}`
        : data.type == 'Taxonomy'
        ? `/taxonomy/term/update/${id}`
        : `/entity/repository/add-revision/${id}`

    return (
      <a href={editHref} className={buttonClassName()}>
        {renderInner(strings.edit.button, faPencilAlt)}
      </a>
    )
  }

  function renderUnrevised() {
    return (
      <a
        href={`/entity/repository/history/${id}`}
        className={buttonClassName()}
      >
        {renderInner(
          `${strings.edit.unrevised} (${unrevisedRevision || ''})`,
          faClock
        )}
      </a>
    )
  }

  function renderShare() {
    return (
      <button className={buttonClassName()} onClick={onShare}>
        {renderInner(strings.share.button, faShareAlt)}
      </button>
    )
  }

  function renderExtraTools() {
    if (!lic || !loggedInData) return null // safeguard
    const supportedTypes = [
      'Page',
      'Article',
      'Video',
      'Applet',
      'Event',
      'CoursePage',
      'Taxonomy',
      '_ExerciseInline',
      '_ExerciseGroupInline',
      '_SolutionInline',
    ]
    if (supportedTypes.indexOf(data.type) === -1) return null

    const Comp = lic.AuthorToolsHoverMenu

    return (
      <LazyTippy
        interactive
        content={<Comp data={data} />}
        placement={aboveContent ? 'bottom' : 'left-end'}
        delay={[0, 300]}
        interactiveBorder={aboveContent ? 10 : 40}
      >
        <button className={buttonClassName()}>
          {renderInner(loggedInData.strings.tools, faTools)}
        </button>
      </LazyTippy>
    )
  }

  function renderProfileButtons() {
    if (!loggedInData) return null
    return (
      <a href="/user/settings">
        {renderInner(loggedInData.strings.authorMenu.editProfile, faPencilAlt)}
      </a>
    )
  }

  function renderInner(text: string, icon: IconDefinition) {
    return (
      <>
        <FontAwesomeIcon icon={icon} className="lg: mr-0.5" /> {text}
      </>
    )
  }
}

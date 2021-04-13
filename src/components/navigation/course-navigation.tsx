import { faGraduationCap, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import * as React from 'react'

import { Link } from '../content/link'
import { useInstanceData } from '@/contexts/instance-context'
import { CourseData } from '@/data-types'

export interface CourseNavigationProps {
  open: boolean
  onOverviewButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  data: CourseData
}

export function CourseNavigation({
  data,
  open,
  onOverviewButtonClick,
}: CourseNavigationProps) {
  const { strings } = useInstanceData()

  return (
    <nav
      id="course-overview"
      className="mt-6 bg-brand-50 sm:bg-white pt-1 pb-5"
    >
      <h1 className="m-4 font-bold text-xl text-brand">
        <FontAwesomeIcon icon={faGraduationCap} /> {data.title}
      </h1>
      {open ? (
        <ol className="serlo-list mb-0 mt-7 ">
          {data.pages.map((page) => (
            <li className="serlo-li" key={page.url}>
              <Link
                className={clsx('text-lg leading-browser', {
                  'font-semibold text-truegray-800 hover:no-underline':
                    page.active,
                })}
                href={page.active ? undefined : page.url}
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <button
          onClick={onOverviewButtonClick}
          className="serlo-button mx-4 bg-brand text-white hover:bg-brand-lighter"
        >
          <FontAwesomeIcon icon={faListUl} /> {strings.course.showPages}
        </button>
      )}
    </nav>
  )
}

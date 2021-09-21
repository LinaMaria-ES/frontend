import clsx from 'clsx'
import { ReactElement } from 'react'

interface MaxWidthDivProps {
  showNav?: boolean
  noMarginBottom?: boolean
  children: JSX.Element | ReactElement[]
}

export function MaxWidthDiv({
  showNav,
  noMarginBottom,
  children,
}: MaxWidthDivProps) {
  return (
    <div
      className={clsx(
        'max-w-screen-sm mx-auto',
        !noMarginBottom && 'mb-24',
        'sm:ml-[51px]',
        showNav ? 'md:ml-[200px] lg:ml-auto' : 'md:ml-auto'
      )}
    >
      {children}
    </div>
  )
}

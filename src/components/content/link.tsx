import { default as NextLink } from 'next/link'
import React from 'react'

import { PrettyLinksContext } from '../pretty-links-context'
import { StyledA } from '../tags/styled-a'
import { ExternalLink } from './external-link'

export interface LinkProps {
  href?: string
  children: React.ReactNode
  className?: string
  noExternalIcon?: boolean
}

//TODO: Should come from cloudflare worker
const legacyLinks = [
  '/entity/unrevised',
  '/auth/login',
  '/auth/logout',
  '/privacy',
  '/imprint',
  '/terms',
  '/disable-frontend',
  '/enable-frontend',
]

export function Link({
  href,
  children = null,
  className,
  noExternalIcon,
}: LinkProps) {
  const prettyLinks = React.useContext(PrettyLinksContext)

  if (!href || href === undefined || href === '') return <>{children}</>

  const prettyLink = getPrettyLink(href)
  const displayHref = prettyLink ? prettyLink : href

  const isAbsolute = href.indexOf('//') > -1
  const isExternal = isAbsolute && href.indexOf('.serlo.org') === -1
  const isLegacyLink = legacyLinks.indexOf(displayHref) > -1

  if (isExternal || (isAbsolute && prettyLink === undefined))
    return renderLink()
  if (!isLegacyLink || prettyLink) return renderClientSide()

  //fallback
  return renderLink()

  function getPrettyLink(href: string): string | undefined {
    if (prettyLinks === undefined || prettyLinks === {}) return undefined

    const prettyLink = prettyLinks[href.replace('/', 'uuid')]?.alias
    if (prettyLink !== undefined) return prettyLink

    //fallback for wrong absolute links
    return prettyLinks['uuid' + href.split('de.serlo.org/')[1]]?.alias
  }

  function renderClientSide() {
    return (
      <NextLink href="/[[...slug]]" as={decodeURIComponent(displayHref)}>
        {renderLink()}
      </NextLink>
    )
  }

  function renderLink() {
    return (
      <StyledA href={displayHref} className={className}>
        {children}
        {isExternal && !noExternalIcon && <ExternalLink />}
      </StyledA>
    )
  }
}

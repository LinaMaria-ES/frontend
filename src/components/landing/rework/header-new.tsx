import clsx from 'clsx'
import { Router } from 'next/router'
import { useState } from 'react'

import { Link } from '../../content/link'
import { MobileMenu } from '../../navigation/mobile-menu'
import { MobileMenuButtonNew } from '../../navigation/mobile-menu-button-new'
import { MenuNew } from './menu-new'
import { SearchInputNew } from './search-input-new'
import { useAuthentication } from '@/auth/use-authentication'
import { useInstanceData } from '@/contexts/instance-context'

export function HeaderNew() {
  const [isOpen, setOpen] = useState(false)
  const auth = useAuthentication()
  const { headerData } = useInstanceData()

  // compat: close mobile menu on client side navigation, we need the global Router instance
  Router.events.on('routeChangeStart', () => {
    setOpen(false)
  })

  return (
    <header className="text-truegray-700">
      <MobileMenuButtonNew onClick={() => setOpen(!isOpen)} open={isOpen} />
      <div className="flex justify-between pt-3 pb-6 px-side lg:px-side-lg">
        <div>
          <Link href="/" path={['logo']}>
            <img
              className="inline"
              alt="Serlo"
              src="/_assets/img/serlo-logo.svg"
              width="120"
              height="80"
            />
          </Link>
          <span
            className={clsx(
              'font-handwritten text-xl align-text-top',
              'ml-9 mt-2 block mobile:inline-block mobile:ml-2 mobile:mt-4'
            )}
          >
            Die freie Lernplattform
          </span>
        </div>
        <div className="hidden md:block">
          <SearchInputNew />
        </div>

        <MenuNew data={headerData} auth={auth.current} />
      </div>
      {isOpen && <MobileMenu data={headerData} auth={auth.current} />}
    </header>
  )
}

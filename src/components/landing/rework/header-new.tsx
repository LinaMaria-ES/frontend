import clsx from 'clsx'
import { Router } from 'next/router'
import { useState } from 'react'

import { Link } from '../../content/link'
import { MobileMenu } from '../../navigation/mobile-menu'
import { MobileMenuButtonNew } from '../../navigation/mobile-menu-button-new'
import { MenuNew } from './menu-new'
import { useAuthentication } from '@/auth/use-authentication'
import { Quickbar } from '@/components/navigation/quickbar'
import { useInstanceData } from '@/contexts/instance-context'
import { useWindowWidth } from '@/helper/use-window-width'
import { theme } from '@/theme'

export function HeaderNew() {
  const [isOpen, setOpen] = useState(false)
  const auth = useAuthentication()
  const { headerData } = useInstanceData()

  // compat: close mobile menu on client side navigation, we need the global Router instance
  Router.events.on('routeChangeStart', () => {
    setOpen(false)
  })

  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < theme.breakpointsInt.sm

  return (
    <header className="text-truegray-700">
      {isMobile ? (
        <MobileMenuButtonNew onClick={() => setOpen(!isOpen)} open={isOpen} />
      ) : null}
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
        <div className="hidden lg:block mt-5 flex-grow mx-8">
          <Quickbar />
        </div>

        {isMobile ? null : <MenuNew data={headerData} auth={auth.current} />}
      </div>
      {isOpen && isMobile ? (
        <MobileMenu data={headerData} auth={auth.current} />
      ) : null}
    </header>
  )
}

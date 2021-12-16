import clsx from 'clsx'
// eslint-disable-next-line import/no-internal-modules
import { useSession, signIn, signOut } from 'next-auth/react'

import { FrontendClientBase } from '@/components/frontend-client-base'
import { HeadTags } from '@/components/head-tags'
import { PartnerListNew } from '@/components/landing/rework/partner-list-new'
import { Logo } from '@/components/navigation/logo'
import { renderedPageNoHooks } from '@/helper/rendered-page'

export default renderedPageNoHooks(() => (
  <FrontendClientBase noHeaderFooter noContainers>
    <HeadTags data={{ title: 'Single Sign-On – serlo.org' }} />
    <header className="px-side pt-12 bg-brand-100 sm:text-center pb-5">
      <div className="pb-6">
        <Logo subline="" noLink />
      </div>
    </header>
    <section
      className={clsx(
        'serlo-responsive-margin mt-5 mb-10',
        'md:mt-12 md:px-8 lg:block text-center min-h-1/2'
      )}
    >
      <div className="max-w-xl sm:mx-auto text-lg">
        <Content />
      </div>
    </section>
    <Footer />
  </FrontendClientBase>
))

const Content = () => {
  const { data: session } = useSession()

  const isLoggedIn = !!session
  const username = session && session.user ? session.user.name : undefined

  function signOutHelper() {
    void signOut({ redirect: false }).then(() => {
      window.location.href =
        'https://keycloak.serlo-staging.dev/auth/realms/serlo/protocol/openid-connect/logout?redirect_uri=' +
        encodeURIComponent(window.location.href)
    })
  }

  return (
    <>
      <h1 className="serlo-h1 text-brand mt-16 mb-5">
        <span className="font-normal">👋</span> Willkommen
        {username ? ` ${username}` : ''}!<br />
      </h1>
      <p className="serlo-p">
        Du bist {isLoggedIn ? '' : 'nicht'} angemeldet{' '}
        <span className={isLoggedIn ? 'text-brandgreen' : 'text-gray-200'}>
          ⬤
        </span>
      </p>
      <p className="serlo-p mt-24">
        {isLoggedIn ? renderLogout() : renderLogin()}
      </p>
    </>
  )

  function renderLogin() {
    return (
      <>
        Du kannst dich mit deiner DAAD-ID (BIRD) anmelden.
        <br />
        <button
          className="serlo-button serlo-make-interactive-green mt-3"
          onClick={() => {
            void signIn('bird')
          }}
        >
          Jetzt anmelden
        </button>
      </>
    )
  }
  function renderLogout() {
    return (
      <>
        Wunderbar, leider gibt&apos;s hier sonst nichts zu sehen 🙈.
        <br />
        <button
          className="serlo-button serlo-make-interactive-green mt-3"
          onClick={() => {
            signOutHelper()
          }}
        >
          Wieder abmelden
        </button>
      </>
    )
  }
}

const Footer = () => (
  <footer className="partner font-bold text-center serlo-responsive-padding pb-1">
    <h2 className="font-bold pt-16 pb-12 text-center">
      Partner und Unterstützer
    </h2>
    <PartnerListNew />
    <nav>
      <a
        href="https://de.serlo.org/serlo"
        target="_blank"
        rel="noreferrer"
        className="serlo-link"
      >
        Über Serlo
      </a>
      {' • '}
      <a
        href="https://de.serlo.org/privacy"
        target="_blank"
        rel="noreferrer"
        className="serlo-link"
      >
        Datenschutz
      </a>
      {' • '}
      <a
        href="https://de.serlo.org/imprint"
        target="_blank"
        rel="noreferrer"
        className="serlo-link"
      >
        Impressum
      </a>
    </nav>
    <style jsx>
      {`
        .partner {
          background: url('/_assets/img/landing/about-container.svg');
          border-bottom: 2rem solid #ffefda;
          background-size: cover;
        }
      `}
    </style>
  </footer>
)

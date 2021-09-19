import clsx from 'clsx'
import Head from 'next/head'
import styled from 'styled-components'

import { HeadTags } from '../head-tags'
import { CommunityWall } from '../landing/rework/community-wall'
import { FooterNew } from '../landing/rework/footer-new'
import { HeaderNew } from '../landing/rework/header-new'
import { PartnerListNew } from '../landing/rework/partner-list-new'
import { WelcomeMessage } from '../landing/rework/welcome-message'
import { Quickbar } from '../navigation/quickbar'
import { Link } from '@/components/content/link'
import { LandingSubjectsNew } from '@/components/landing/rework/landing-subjects-new'
import { InstanceLandingData } from '@/data-types'

export interface LandingDEProps {
  data: InstanceLandingData
}

export function LandingDE({ data }: LandingDEProps) {
  const subjectsData = data.subjectsData

  return (
    <>
      <Head>
        <link href="_assets/landing-fonts.css" rel="stylesheet" />
      </Head>
      <HeadTags data={{ title: 'Serlo – Die freie Lernplattform' }} />
      <HeaderNew />
      <main className="text-truegray-700">
        <section className="text-center max-w-3xl mx-auto mt-20 md:mt-15vh font-bold px-2">
          <PWithWink as="p" className="text-brand font-handwritten text-3xl">
            <WelcomeMessage />
          </PWithWink>
          <h1
            className={clsx(
              'text-center text-5xl font-extrabold',
              'tracking-tight',
              'max-w-2xl mt-3 mb-6 mx-auto'
            )}
          >
            Was möchtest du <Underlined className="pb-2">lernen ?</Underlined>
          </h1>
          <div className="lg:hidden mt-10 mb-8">
            <Quickbar />
          </div>
          <p className="text-3xl leading-cozy">
            Hier auf Serlo findest du{' '}
            <b className="tracking-tight">einfache Erklärungen,</b> ausgewählte{' '}
            <b className="tracking-tight">Lernvideos</b> und interaktive{' '}
            <b className="tracking-tight">Übungsaufgaben</b> mit Musterlösungen.
          </p>
        </section>

        <section className="mt-10">
          <LandingSubjectsNew data={subjectsData} />
        </section>

        <AboutSection
          className={clsx(
            'text-center text-4xl',
            'tracking-tight font-bold mt-7'
          )}
        >
          <p className="mb-8 max-w-2xl px-2 mx-auto">
            Unsere Lernplattform wird von einem gemeinnützigen Verein
            entwickelt. Sie ist komplett{' '}
            <b className="font-extrabold">
              kostenlos, werbefrei und{' '}
              <span className="whitespace-nowrap">frei lizenziert</span>
            </b>
            .{' '}
            <Underlined
              className="font-handwritten text-brand"
              style={{ fontSize: '1.2em' }}
            >
              Für immer!
            </Underlined>
          </p>
          <p className="mb-8 max-w-2xl px-2 mx-auto">
            Jeden Monat nutzen über 1.2 Millionen Schüler*innen und Lehrkräfte
            Serlo.
          </p>
          <ButtonWithWings
            className="serlo-new-landing-button inline"
            href="/serlo"
          >
            Mehr über uns
          </ButtonWithWings>
        </AboutSection>

        <CommunityWall />

        <section className="mt-20 mb-20 mx-side">
          <img src="/_assets/img/landing/birds.svg" className="mx-auto" />
          <h3
            style={{ hyphens: 'auto' }}
            className={clsx(
              'text-center text-4xl font-bold',
              'leading-cozy tracking-tight',
              'max-w-2xl mt-7 mx-auto'
            )}
          >
            Zusammen setzen wir uns für mehr Bildungsgerechtigkeit und die
            digitale Transformation unserer Schulen ein.
          </h3>
        </section>

        <PartnerSection className="text-center">
          <h3
            className={clsx(
              'text-center text-4xl font-bold',
              'leading-cozy tracking-tight',
              'max-w-2xl mt-32 mx-auto relative z-10 mb-16'
            )}
          >
            Partner und Förderer
          </h3>
          <PartnerListNew />
          <ButtonWithWink
            className={clsx(
              'hidden md:inline-block mx-auto mt-12',
              'font-bold text-xl rounded-lg text-truegray-700 ',
              'px-8 py-4 tracking-tight border-truegray-700 border-solid border-2',
              'hover:border-brand-light hover:no-underline hover:text-brand-light'
            )}
            href="/partner"
          >
            Alle Partner ansehen
          </ButtonWithWink>
        </PartnerSection>
      </main>
      <FooterNew />
    </>
  )
}

const AboutSection = styled.section`
  padding-top: 7rem;
  padding-bottom: 5rem;
  margin: 6rem 0 0 0;
  background-image: url('/_assets/img/landing/about-big-arrow.svg'),
    url('/_assets/img/landing/about-container.svg');
  background-repeat: no-repeat, no-repeat;
  background-position: 77% 12%;
  background-size: 200%, 100vw 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    padding-top: 11rem;
    padding-bottom: 9rem;
    background-position: 20% 19%;
    background-size: 82%, 100vw 100%;
  }
`

const Underlined = styled.span`
  padding-right: 1rem;
  white-space: nowrap;
  background: url('/_assets/img/landing/simple-underline.svg') no-repeat bottom;
`

const ButtonWithWings = styled(Link)`
  &:after,
  &:before {
    content: ' ';
    background: url('/_assets/img/landing/wing-left.svg') no-repeat;
    position: absolute;
    margin-top: -0.6rem;
    width: 4rem;
    height: 4rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity ease-in 0.2s;
  }

  &:after {
    margin-left: 1rem;
    transform: scaleX(-1);
  }

  &:before {
    margin-left: -5rem;
  }

  &:hover {
    &:after,
    &:before {
      opacity: 1;
    }
  }
`

const ButtonWithWink = styled(ButtonWithWings)`
  &:after,
  &:before {
    background: url('/_assets/img/landing/wink-left.svg') no-repeat;
    margin-top: -2rem;
    background-size: 65%;
  }
`

const PWithWink = styled(ButtonWithWink)`
  &:after,
  &:before {
    margin-top: -1rem;
    background-size: 75%;
    width: 2.5rem;
    height: 2.5rem;
    opacity: 1;
  }
  &:after {
    margin-left: -0.5rem;
  }
  &:before {
    margin-left: -1.5rem;
  }
`

const PartnerSection = styled.section`
  padding-top: 1rem;
  background: url('/_assets/img/landing/footer-container.svg') no-repeat;
  background-size: 100% 100%;
`

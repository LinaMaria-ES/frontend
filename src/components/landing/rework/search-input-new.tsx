import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { lighten } from 'polished'
import { useState, useRef, useContext, useEffect } from 'react'
import styled, { css } from 'styled-components'

import { isLegacyLink } from '../../content/link'
import { LazyTippy } from '../../navigation/lazy-tippy'
import SearchIcon from '@/assets-webkit/img/search-icon.svg'
import { EntityIdContext } from '@/contexts/entity-id-context'
import { useInstanceData } from '@/contexts/instance-context'
import { inputFontReset, makeLightButton, makePadding } from '@/helper/css'
import { replacePlaceholders } from '@/helper/replace-placeholders'
import { submitEvent } from '@/helper/submit-event'
import { ExternalProvider, useConsent } from '@/helper/use-consent'

/*
This components starts with only a placeholder that looks like a searchbar (basically a button).
When activated (by click) it loads the Google Custom Search scrips that generate the real input button and alot of markup.
We style this markup and use it to silenty replace the placeholder.
From this point on it's a styled GSC that loads /search to display the results.
It's a very hacky, but it's free and works … okay.
*/

export function SearchInputNew() {
  const [searchLoaded, setSearchLoaded] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [consentJustGiven, setConsentJustGiven] = useState(false)
  const { checkConsent, giveConsent } = useConsent()
  const consentGiven = checkConsent(ExternalProvider.GoogleSearch)
  const searchFormRef = useRef<HTMLDivElement>(null)

  // const [isSearchPage, setIsSearchPage] = React.useState(false)
  const { lang, strings } = useInstanceData()
  const router = useRouter()
  const onSearchPage = router.route === '/search'
  const id = useContext(EntityIdContext)

  useEffect(() => {
    // note: find a better way to tell search input that it should activate itself
    if (onSearchPage) {
      activateSearch()
    }
    // I only want to run this the first time the page loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (consentJustGiven) activateSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consentJustGiven])

  useEffect(() => {
    const resultsContainer = document.getElementById('gcs-results')
    setupLinkCatcher(resultsContainer)
  })

  const checkElement = async (selector: string) => {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    return document.querySelector(selector)
  }

  function activateSearch() {
    if (id) {
      submitEvent(`clicksearch_${id}`)
    }
    if (searchActive) return
    if (!consentGiven) {
      searchFormRef.current?.focus()
      return
    }

    if (!searchLoaded) {
      const gcse = document.createElement('script')
      gcse.type = 'text/javascript'
      gcse.async = true
      gcse.src = 'https://cse.google.com/cse.js?cx=' + getSearchEngineId(lang)

      const s = document.getElementsByTagName('script')[0]
      s.parentNode!.insertBefore(gcse, s)

      setSearchLoaded(true)
    }

    void checkElement('#gsc-i-id1').then((element) => {
      const input = element as HTMLInputElement
      input.setAttribute('placeholder', '… heute lerne ich')
      input.focus()
      setSearchActive(true)

      const resultsContainer = document.getElementById('gcs-results')
      setupLinkCatcher(resultsContainer)
    })
  }

  function onConsentButtonAction() {
    giveConsent(ExternalProvider.GoogleSearch)
    setConsentJustGiven(true)
  }

  function setupLinkCatcher(container: HTMLElement | null) {
    if (!container || container === undefined) return
    const className = 'gs-title'

    container.addEventListener(
      'click',
      function (e) {
        const langDomain = `https://${lang}.serlo.org`
        const target = e.target as HTMLElement
        const link = target.classList.contains(className)
          ? target
          : target.parentElement

        const absoluteHref = link?.dataset.ctorig
        const relativeHref = absoluteHref?.replace(langDomain, '')
        if (
          !e.metaKey &&
          !e.ctrlKey &&
          link &&
          link.classList.contains(className) &&
          typeof absoluteHref !== 'undefined' &&
          absoluteHref.startsWith(langDomain) &&
          relativeHref !== undefined &&
          !isLegacyLink(relativeHref)
        ) {
          e.preventDefault()
          void router.push('/[[...slug]]', relativeHref).then(() => {
            if (window.location.hash.length < 1) window.scrollTo(0, 0)
          })
        }
      },
      false
    )
  }

  function getSearchEngineId(instance: string) {
    switch (instance) {
      case 'de':
        return '017461339636837994840:ifahsiurxu4'
      case 'es':
        return '5bd728bf64beb7e94'
      case 'fr':
        return 'b31aebc4f2a4db942'
      case 'ta':
        return '65f223ba41d6c4383'
      case 'hi':
        return 'd1ded9becf410cea7'
      case 'en':
      default:
        return 'b3d3ba59c482534d2'
    }
  }

  return (
    <>
      <LazyTippy
        content={renderConsentPop()}
        trigger="focus click"
        interactive
        placement="bottom-start"
        onLoaded={() => {
          if (onSearchPage && !consentGiven) {
            searchFormRef.current?.focus()
          }
        }}
      >
        <SearchForm
          id="searchform"
          ref={searchFormRef}
          onClick={activateSearch}
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              activateSearch()
            }
          }}
          tabIndex={searchActive ? -1 : 0}
        >
          {!searchActive && (
            <>
              <PlaceholderText>… heute lerne ich</PlaceholderText>
              <PlaceholderButton>
                {!searchLoaded ? (
                  <PlaceholderIcon />
                ) : (
                  <LoadingIcon icon={faSpinner} size="1x" spin />
                )}
              </PlaceholderButton>
            </>
          )}

          {/* Note: This exact classname is important for gcse to work!*/}
          <div
            className="gcse-searchbox-only"
            data-autocompletemaxcompletions="7"
            data-resultsurl="/search"
            data-enablehistory="true"
          />
        </SearchForm>
      </LazyTippy>
    </>
  )
  function renderConsentPop() {
    if (searchActive || consentGiven) return null
    return (
      <ConsentPop>
        <ConsentButton
          onClick={onConsentButtonAction}
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              onConsentButtonAction()
            }
          }}
        >
          {strings.search.agree}
        </ConsentButton>
        {replacePlaceholders(strings.search.privacy, {
          privacypolicy: (
            <a
              className="text-white font-bold hover:no-underline"
              href="/privacy"
              target="_blank"
            >
              {strings.entities.privacyPolicy}
            </a>
          ),
        })}
      </ConsentPop>
    )
  }
}

const height = 40
const heightPx = `${height}px`

const smHeight = 41
const smHeightPx = `${smHeight}px`

/*
this is kind of a pattern for lack of better solutions:
https://github.com/styled-components/styled-components/issues/1209#issue-263146426
*/

const sharedTextStyles = css`
  flex: 1;
  margin-left: 52px;
  line-height: ${heightPx};
  font-size: 0.9rem;
  font-weight: bold;
  color: #ccc;
  margin-left: 15px;
`

const sharedButtonStyles = css`
  height: ${heightPx};
  width: ${heightPx};

  background-color: ${(props) => props.theme.colors.brand};
  transition: background-color 0.2s ease-in;
  text-align: center;
  pointer-events: none;
  cursor: pointer;

  border-radius: 5rem;
  width: 35px;
  height: 35px;
  margin: 2px 2px 0 0;

  &:hover,
  &:focus {
    background-color: ${(props) => props.theme.colors.lighterblue};
  }
`

const sharedIconStyles = css`
  width: 18px;
  height: 18px;
  fill: #fff;
  margin-top: ${(height - 19) / 2}px;
  margin-top: ${(smHeight - 22) / 2}px;

  display: inline;
`

const gscMiscResets = css`
  #___gcse_0 {
    flex: 1;
  }

  .gcse-search {
    display: none;
  }

  .gsc-input-box {
    border: 0;
    padding: 0;
    background: none;
  }

  .gsib_a {
    padding: 0;

    padding: 4px 0 0 0;
    vertical-align: top;
  }

  form.gsc-search-box,
  table.gsc-search-box {
    margin-bottom: 0 !important;
  }

  td.gsc-search-button {
    vertical-align: top;
  }
`

const gcsInput = css`
  background: transparent !important;
  text-indent: 0 !important;

  &,
  &::placeholder {
    ${inputFontReset}
    ${sharedTextStyles}
    line-height: inherit;
    font-size: 1rem !important;
  }
  color: rgb(64, 64, 64) !important;
  /* 
  &::placeholder {
    text-indent: 50px !important;
  }

  text-indent: 50px !important; */

  text-indent: 15px !important;

  &::placeholder {
    text-indent: 15px !important;
  }
`

const gcsButton = css`
  ${sharedButtonStyles}

  /*resets*/
  pointer-events: auto;
  padding: 0;
  border: 0;
  outline: none;

  & > svg {
    /* doesn't need shared styles */
    width: 18px;
    height: 18px;
    display: inline;
  }
`

const PlaceholderText = styled.div`
  ${sharedTextStyles}
`

const PlaceholderButton = styled.div`
  ${sharedButtonStyles}
`

const PlaceholderIcon = styled(SearchIcon)`
  ${sharedIconStyles}
`

const LoadingIcon = styled(FontAwesomeIcon)`
  ${sharedIconStyles}
  color: #fff;
  font-size: 20px;
`

const SearchForm = styled.div`
  display: flex;
  justify-content: flex-end;
  height: ${smHeightPx};
  min-height: 38px;
  margin: 0 auto;
  padding-left: 16px;
  margin: 1.5rem 16px 0 16px;
  max-width: 320px;

  outline: none;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: ${(props) => lighten(0.1, props.theme.colors.lighterblue)};
  transition: all 0.4s ease;
  border-radius: 22px;
  background-color: transparent;

  &:focus-within {
    background-color: ${(props) =>
      lighten(0.1, props.theme.colors.lighterblue)};
    border-color: ${(props) => lighten(0.1, props.theme.colors.lighterblue)};
    color: red !important;
  }

  @media (min-width: 412px) {
    margin: 1.5rem auto 0 auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 380px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    max-width: 380px;
  }

  ${gscMiscResets}

  input.gsc-input {
    ${gcsInput}
  }

  button.gsc-search-button {
    ${gcsButton}
  }
`

const ConsentPop = styled.div`
  background-color: ${(props) => props.theme.colors.brand};
  color: #fff;
  width: auto;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;
  ${makePadding};
  padding-top: 12px;
  padding-bottom: 12px;
  z-index: 5;
  width: 88vw;
  outline: 0;

  width: 277px;
`

const ConsentButton = styled.button`
  ${makeLightButton}
  background-color: #fff;
  font-size: 1rem;
  display: block;
  margin: 3px auto 8px auto;
  &:hover {
    background-color: ${(props) =>
      lighten(0.15, props.theme.colors.lighterblue)};
    color: ${(props) => props.theme.colors.brand};
  }
`

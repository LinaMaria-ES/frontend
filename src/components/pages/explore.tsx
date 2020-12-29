import levenshtein from 'fast-levenshtein'
import React from 'react'
import Autosuggest from 'react-autosuggest'
import styled from 'styled-components'

import { HSpace } from '../content/h-space'
import { Injection } from '../content/injection'
import { Lazy } from '../content/lazy'
import { Link } from '../content/link'
import { SpecialCss } from '../content/special-css'
import { RelativeContainer } from '../navigation/relative-container'
import { StyledH1 } from '../tags/styled-h1'
import { StyledP } from '../tags/styled-p'
import { MaxWidthDiv } from '@/components/navigation/max-width-div'
import theme from '@/components/pages/explore.module.css'

const { query2tokens } = require('../../../external/textAnalyzer.js')

export function Explore() {
  const [searchIndex, setSearchIndex] = React.useState<any>({})

  const ranking = React.useRef<any>([])
  const counts = React.useRef<any>({ age: {} })

  const [choices, setChoices] = React.useState<any>([])
  const [limit, setLimit] = React.useState(10)
  const [query, setQuery] = React.useState<string>('')
  const [counter, setCounter] = React.useState(1)

  React.useEffect(() => {
    void (async () => {
      const res3 = await fetch(
        //'http://localhost:8081/exercise_index_29_dez_2020.json'
        'https://gist.githubusercontent.com/Entkenntnis/321a2f2d1941f8dfdd66c34e0041bc81/raw/184aa30ab3a5aee44299f9a49c777b9b061ad166/exercise_index_29_dez_2020.json'
      )
      const json3 = await res3.json()

      json3.lengthCache = {}

      for (const key of Object.keys(json3.tokens)) {
        json3.lengthCache[key] = Object.keys(json3.tokens[key]).length
      }

      json3.autocomplete.tokenList = Object.keys(json3.autocomplete.tokens)

      const avgTF: any = {}

      for (const id in json3.payloads) {
        avgTF[id] = []
      }

      for (const token in json3.tokens) {
        if (token.length > 3) {
          for (const id in json3.tokens[token]) {
            avgTF[id].push(json3.tokens[token][id])
          }
        }
      }

      for (const id in avgTF) {
        avgTF[id] =
          avgTF[id].length == 0
            ? 0
            : avgTF[id].reduce((a: number, b: number) => a + b, 0) /
              avgTF[id].length
      }

      json3.avgTF = avgTF

      //console.log(json3)

      setSearchIndex(json3)

      //console.log(searchIndex)
    })()
  }, [])

  React.useEffect(() => {
    if (query) sessionStorage.setItem('__explore_query', query)
  }, [query])

  React.useEffect(() => {
    console.log('search:', query)
    const words = query2tokens(query)
    console.log(words)

    const candidates: any = {}

    const addFromToken = (token: any) => {
      if (token) {
        for (const id of Object.keys(token)) {
          if (!candidates[id]) candidates[id] = 0
          candidates[id]++
        }
      }
    }

    // collect all possible results
    for (const word of words) {
      addFromToken(searchIndex.tokens[word])
    }

    const minCount = Math.ceil(words.length / 2)
    const excludeList: any = []
    for (const id in candidates) {
      if (candidates[id] < minCount) {
        excludeList.push(id)
      }
    }

    console.log(excludeList)

    const confirmed = true

    /*if (candidates.size > 10000) {
      confirmed = confirm(
        'Diese Suche kann etwas länger dauern ... Fortfahren?'
      )
    }*/

    if (confirmed) {
      ranking.current = []

      for (const id in candidates) {
        if (excludeList.includes(id)) continue
        if (choices.length > 0) {
          if (
            !searchIndex.payloads[id].age.some((age: any) =>
              choices.includes(age)
            )
          )
            continue
        }
        const { score, explain } = calculateScore(id, words, searchIndex)
        ranking.current.push({
          id,
          score,
          explain,
        })
      }

      ranking.current.sort((a: any, b: any) => b.score - a.score)

      // count
      counts.current = { age: {} }
      for (const entry of ranking.current) {
        const ages = searchIndex.payloads[entry.id].age
        for (const age of ages) {
          if (!counts.current.age[age]) counts.current.age[age] = 0
          counts.current.age[age]++
        }
      }

      //console.log(counts.current)

      setCounter(counter + 1)
    }
  }, [query, choices])

  return (
    <RelativeContainer>
      <MaxWidthDiv>
        <SpecialCss>
          <HSpace amount={50} />
          <StyledH1>Entdecke Aufgaben auf Serlo</StyledH1>
          {searchIndex ? (
            <>
              <InputForm
                runSearch={(query: string) => {
                  setLimit(10)
                  console.log('split')
                  setQuery(query)
                }}
                searchIndex={searchIndex}
              />
              <StyledP>
                <em>{ranking.current.length} Ergebnisse</em>
              </StyledP>
              {choices.length > 0 ? (
                <FacetDiv>
                  <StyledP>
                    Filter:{' '}
                    {choices.map((choice: any) => (
                      <React.Fragment key={choice}>
                        <strong>{choice}</strong>{' '}
                        <span
                          style={{ color: 'blue', cursor: 'pointer' }}
                          onClick={() =>
                            setChoices(choices.filter((c: any) => c != choice))
                          }
                        >
                          [x]
                        </span>
                        ,{' '}
                      </React.Fragment>
                    ))}
                  </StyledP>
                </FacetDiv>
              ) : null}
              {choices.length == 0 && (
                <CategorySelector
                  counts={counts.current.age}
                  heading="Altersstufe"
                  choices={choices}
                  setChoices={setChoices}
                />
              )}
              {ranking.current.slice(0, limit).map(({ id, explain }: any) => (
                <React.Fragment key={id}>
                  <Document id={id} explain={explain} />
                </React.Fragment>
              ))}
              {ranking.current.length > limit && (
                <StyledP>
                  <button
                    onClick={() => {
                      setLimit(limit + 10)
                    }}
                  >
                    Mehr anzeigen
                  </button>
                </StyledP>
              )}
            </>
          ) : (
            <StyledP>Suchindex wird geladen ...</StyledP>
          )}
        </SpecialCss>
      </MaxWidthDiv>
    </RelativeContainer>
  )
}

const autocompleteStopwords = ['zu', 'zur', 'zum', 'und', 'aufgaben']

function InputForm(props: any) {
  const [inputValue, setInputValue] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<string[]>([])

  const throttled = React.useCallback(
    throttle(500, ({ value }: any) => {
      // to search
      const query = value.toLowerCase()

      const tokens = query.split(/[^a-zäöüß0-9]/).filter((x: any) => x)

      if (tokens.length > 0) {
        const frontToken = tokens[tokens.length - 1]
        const fixedToken = tokens.slice(0, -1)

        let docs = Object.keys(props.searchIndex.autocomplete.docs)

        for (const t of fixedToken) {
          docs = docs.filter((doc) =>
            props.searchIndex.autocomplete.tokens[t]?.includes(parseInt(doc))
          )
        }

        const relevantTokens = props.searchIndex.autocomplete.tokenList.filter(
          (t: any) =>
            t.includes(frontToken) &&
            !fixedToken.includes(t) &&
            props.searchIndex.autocomplete.tokens[t]?.some((doc: any) => {
              return docs.includes(doc.toString())
            })
        )

        if (relevantTokens.length == 1 || relevantTokens.includes(frontToken)) {
          const relTok =
            relevantTokens.length == 1 ? relevantTokens[0] : frontToken
          docs = docs.filter((doc) =>
            props.searchIndex.autocomplete.tokens[relTok].includes(
              parseInt(doc)
            )
          )
          for (const id of docs) {
            for (const token of props.searchIndex.autocomplete.docs[id]) {
              if (token !== relTok && !fixedToken.includes(token)) {
                if (!autocompleteStopwords.includes(token)) {
                  const newTok = `${relTok} ${token}`
                  if (!relevantTokens.includes(newTok)) {
                    relevantTokens.push(newTok)
                  }
                }
              }
            }
          }
        }

        const entries = relevantTokens
          .map((t: any) => [...fixedToken, t].join(' '))
          .map((val: any) => {
            return {
              val,
              distance: levenshtein.get(val, query),
            }
          })

        entries.sort((a: any, b: any) => a.distance - b.distance)

        setSuggestions(entries.slice(0, 5).map((entry: any) => entry.val))
      }
    }),
    [props.searchIndex]
  )

  React.useEffect(() => {
    if (props.searchIndex) {
      setInputValue(sessionStorage.getItem('__explore_query') ?? '')
      props.runSearch(inputValue)
    }
  }, [props.searchIndex])

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '20px' }} />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={throttled}
          onSuggestionsClearRequested={() => {
            setSuggestions([])
          }}
          getSuggestionValue={(str: any) => {
            return str
          }}
          renderSuggestion={(str: any) => str}
          inputProps={{
            value: inputValue,
            onChange: (e: any, { newValue }: any) => {
              setInputValue(newValue)
            },
            onKeyDown: (e: any) => {
              if (e.key == 'Enter') {
                props.runSearch(inputValue)
              }
            },
          }}
          theme={theme}
        />
        <div style={{ width: '20px' }} />
        <button
          onClick={() => {
            props.runSearch(inputValue)
          }}
        >
          Los
        </button>
      </div>
      <HSpace amount={40} />
    </>
  )
}

function throttle(delay: any, fn: any) {
  let inThrottle = false
  let last: any = undefined

  return (args: any) => {
    if (inThrottle) {
      last = () => {
        fn(args)
      }
      return
    }

    inThrottle = true
    fn(args)
    const resetThrottle = () => {
      if (last) {
        last()
        last = undefined
        setTimeout(resetThrottle, delay)
      }
      inThrottle = false
    }
    setTimeout(resetThrottle, delay)
  }
}
function CategorySelector(props: any) {
  const { counts, heading, choices, setChoices } = props

  if (!counts) return null

  const categories = []

  for (const key of Object.keys(counts)) {
    categories.push({ key, count: counts[key] })
  }

  if (categories.length <= 1) return null

  categories.sort((a, b) => b.count - a.count)

  return (
    <FacetDiv>
      <StyledP>
        <strong>{heading}</strong>:
        {categories.map((cat) => (
          <React.Fragment key={cat.key}>
            <label>
              <input
                type="checkbox"
                checked={choices.includes(cat.key)}
                onChange={() => {
                  if (choices.includes(cat.key)) {
                    setChoices(choices.filter((c: any) => c != cat.key))
                  } else {
                    setChoices([...choices, cat.key])
                  }
                }}
              />
              {choices.includes(cat.key) ? (
                <strong>
                  {cat.key} ({cat.count})
                </strong>
              ) : (
                <>
                  {cat.key} ({cat.count})
                </>
              )}
            </label>
            &nbsp;&nbsp;
          </React.Fragment>
        ))}
      </StyledP>
    </FacetDiv>
  )
}

function Document({ id, explain }: any) {
  return (
    <>
      <HSpace amount={60} />
      <p style={{ textAlign: 'right' }}>
        <small>
          Aufgabe <Link href={`/${id}`}>{id}</Link> ({explain})
        </small>
      </p>
      <Lazy>
        {' '}
        <Injection href={`/${id}`} key={id} />
      </Lazy>
    </>
  )
}

function round2(num: number) {
  return Math.round(num * 100) / 100
}

function calculateScore(id: any, words: string[], searchIndex: any) {
  // task score
  const { weight, explain } = calculateTFIDF(
    id,
    words,
    searchIndex.tokens,
    searchIndex.payloads[id].docLength,
    searchIndex
  )

  //console.log('weights', weightTask, weightSolution, weightTax)
  const penaltyFactor1 = searchIndex.payloads[id].solutionMissing ? 0.45 : 1
  const penaltyFactor2 = getLinkedEntityPenalty(
    searchIndex.payloads[id].linkedEntities.length
  )

  const recencyValue = Math.log(id) * 0.01

  const taxBoost =
    words.filter((word) => searchIndex.payloads[id].taxonomy.includes(word))
      .length > 0
      ? 1
      : 0.75

  //console.log(id, weight, penaltyFactor)

  //console.log('parts', searchIndex.payloads[id].parts)

  const score =
    (weight + recencyValue) * penaltyFactor1 * penaltyFactor2 * taxBoost
  return {
    score,
    explain: `Score: ${round2(
      score
    )}, sol: ${penaltyFactor1}, lnks: ${penaltyFactor2}, rec: ${round2(
      recencyValue
    )}, tax: ${round2(taxBoost)}, ${explain}`,
  }
}

function getLinkedEntityPenalty(amount: any) {
  if (amount == 0) return 0.45
  return 1
}

function calculateTFIDF(
  id: any,
  words: any,
  tokens: any,
  length: any,
  searchIndex: any
) {
  let score = 0
  let explain = ''
  let occurCount = 0
  for (const word of words) {
    const token = tokens[word]
    if (token) {
      if (token[id]) {
        occurCount++
        const tf = Math.sqrt(Math.min(token[id], 6))
        const idf =
          Math.log(4000 / ((searchIndex.lengthCache[word] as number) + 1)) + 1
        score += tf * idf
        explain += `[${word} tf:${round2(tf)} idf:${round2(idf)}] `
        //console.log('idf', idf)
      }
    }
  }

  const fieldLength = Math.max(1 / Math.sqrt(Math.max(40, length)), 1 / 60)

  const coord = occurCount / words.length

  explain += `* fl:${round2(fieldLength)} * coord:${round2(coord)}`

  const weight = coord * score * fieldLength

  return { weight, explain }
}

const FacetDiv = styled.div`
  background-color: ${(props) => props.theme.colors.lightBlueBackground};
  padding-top: 20px;
  padding-bottom: 1px;
`

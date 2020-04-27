import styled from 'styled-components'
import { makeMargin } from '../../helper/csshelper'
import React from 'react'
import { renderArticle } from '../../schema/articleRenderer'
import { convertEdtrioState } from '../../schema/convertEdtrioState'
import { getServerSideProps } from '../../../pages/[...slug]'
import StyledP from '../tags/StyledP'

export default function ScMcExercise({ state }) {
  if (state.isSingleChoice) return <SingleChoice state={state} />

  return <MultipleChoice state={state} />
}

function SingleChoice({ state }) {
  const [selected, setSelected] = React.useState(undefined)
  const [showFeedback, setShowFeedback] = React.useState(false)

  return (
    <Container>
      <Choices>
        {state.answers.map((answer, i) => (
          <label key={i}>
            <input
              type="radio"
              checked={selected === i}
              onChange={() => {
                setShowFeedback(false)
                setSelected(i)
              }}
            />
            {renderArticle(convertEdtrioState(answer.content).children)}
          </label>
        ))}
      </Choices>
      {showFeedback && state.answers[selected] && (
        <Feedback right={state.answers[selected].isCorrect}>
          {renderArticle(
            convertEdtrioState(state.answers[selected].feedback).children
          )}
        </Feedback>
      )}
      <button onClick={() => setShowFeedback(true)}>Stimmt's?</button>
    </Container>
  )
}

function MultipleChoice({ state }) {
  const [selected, setSelected] = React.useState(state.answers.map(_ => false))
  const [showFeedback, setShowFeedback] = React.useState(false)
  const right = state.answers.every(
    (answer, i) => answer.isCorrect === selected[i]
  )
  return (
    <Container>
      <Choices>
        {state.answers.map((answer, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={selected[i]}
              onChange={() => {
                setShowFeedback(false)
                const newArr = selected.slice(0)
                newArr[i] = !newArr[i]
                setSelected(newArr)
              }}
            />
            {renderArticle(convertEdtrioState(answer.content).children)}
            {showFeedback &&
              selected[i] &&
              renderArticle(convertEdtrioState(answer.feedback).children)}
          </label>
        ))}
      </Choices>
      {showFeedback && (
        <Feedback right={right}>
          <StyledP>{right ? 'Richtig' : 'Falsch'}</StyledP>
        </Feedback>
      )}
      <button onClick={() => setShowFeedback(true)}>Stimmt's?</button>
    </Container>
  )
}

const Choices = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const Feedback = styled.div<{ right?: boolean }>`
  color: ${props => (props.right ? 'green' : 'red')};
`

const Container = styled.div`
  ${makeMargin}
  margin-bottom: ${props => props.theme.spacing.mb.block}
`

/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { useScopedSelector } from '@edtr-io/core'
import {
  EditorPlugin,
  EditorPluginProps,
  child,
  object,
  string,
  optional,
} from '@edtr-io/plugin'
import { isEmpty } from '@edtr-io/store'
import { Icon, faExternalLinkAlt, styled } from '@edtr-io/ui'
import * as React from 'react'

import { InlineInput } from './helpers/inline-input'
import { InlineSettings } from './helpers/inline-settings'
import { InlineSettingsInput } from './helpers/inline-settings-input'
import { SemanticSection } from './helpers/semantic-section'
import { useLoggedInData } from '@/contexts/logged-in-data-context'

const solutionState = object({
  prerequisite: optional(
    object({
      id: string(),
      title: string(),
    })
  ),
  strategy: child({
    plugin: 'text',
  }),
  steps: child({ plugin: 'rows' }),
})

export type SolutionPluginState = typeof solutionState
export type SolutionProps = EditorPluginProps<SolutionPluginState>

export const solutionPlugin: EditorPlugin<SolutionPluginState> = {
  Component: SolutionEditor,
  state: solutionState,
  config: {},
}

const OpenInNewTab = styled.span({ margin: '0 0 0 10px' })

function SolutionEditor({ editable, state, focused }: SolutionProps) {
  const { prerequisite, strategy } = state
  const hasStrategy = !useScopedSelector(isEmpty(strategy.id))

  const loggedInData = useLoggedInData()
  if (!loggedInData) return null
  const editorStrings = loggedInData.strings.editor

  return (
    <>
      {renderPrerequisite()}
      {hasStrategy || editable ? (
        <SemanticSection editable={editable}>
          {strategy.render({
            config: {
              placeholder:
                editorStrings.solution.optionallyExplainTheSolutionStrategyHere,
            },
          })}
        </SemanticSection>
      ) : null}
      <SemanticSection editable={editable}>
        {state.steps.render()}
      </SemanticSection>
    </>
  )

  function renderPrerequisite() {
    return (
      <SemanticSection editable={editable}>{renderContent()}</SemanticSection>
    )

    function renderContent() {
      if (editable) {
        return (
          <div>
            {
              editorStrings.solution
                .forThisExerciseYouNeedTheFollowingFundamentals
            }{' '}
            {focused ? (
              <InlineSettings
                onDelete={() => {
                  if (prerequisite.defined) {
                    prerequisite.remove()
                  }
                }}
                position="below"
              >
                <InlineSettingsInput
                  value={
                    prerequisite.defined && prerequisite.id.value !== ''
                      ? `/${prerequisite.id.value}`
                      : ''
                  }
                  placeholder={editorStrings.solution.idOfAnArticleEG_1855}
                  onChange={(event) => {
                    const newValue = event.target.value.replace(/[^0-9]/g, '')
                    if (prerequisite.defined) {
                      prerequisite.id.set(newValue)
                    } else {
                      prerequisite.create({
                        id: newValue,
                        title: '',
                      })
                    }
                  }}
                />
                <a
                  target="_blank"
                  href={
                    prerequisite.defined && prerequisite.id.value !== ''
                      ? `/${prerequisite.id.value}`
                      : ''
                  }
                  rel="noopener noreferrer"
                >
                  <OpenInNewTab
                    title={editorStrings.solution.openTheArticleInANewTab}
                  >
                    <Icon icon={faExternalLinkAlt} />
                  </OpenInNewTab>
                </a>
              </InlineSettings>
            ) : null}
            <a>
              <InlineInput
                value={prerequisite.defined ? prerequisite.title.value : ''}
                onChange={(value) => {
                  if (prerequisite.defined) {
                    prerequisite.title.set(value)
                  } else {
                    prerequisite.create({ id: '', title: value })
                  }
                }}
                placeholder={editorStrings.solution.titleOfTheLink}
              />
            </a>
          </div>
        )
      }

      if (
        prerequisite.defined &&
        prerequisite.id.value &&
        prerequisite.title.value
      ) {
        return (
          <p>
            {
              editorStrings.solution
                .forThisExerciseYouNeedTheFollowingFundamentals
            }{' '}
            <a href={`/${prerequisite.id.value}`}>{prerequisite.title.value}</a>
          </p>
        )
      }

      return null
    }
  }
}

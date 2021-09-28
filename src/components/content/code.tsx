/* eslint-disable import/no-internal-modules */
import * as React from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import coy from 'react-syntax-highlighter/dist/cjs/styles/prism/coy'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import latex from 'react-syntax-highlighter/dist/esm/languages/prism/latex'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'

SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('latex', latex)
// hä? what about html

export interface CodeProps {
  content: React.ReactNode
  language: string
  showLineNumbers: boolean
}

export function Code({ content, language, showLineNumbers }: CodeProps) {
  // SyntaxHighlighter has own styles on pre, so wrap in div to use own classes
  return (
    <div className="mb-block mt-1 border-l-8 border-brand-lighter mx-side">
      <SyntaxHighlighter
        language={language}
        showLineNumbers={showLineNumbers}
        style={coy as object}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  )
}

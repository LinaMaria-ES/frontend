import React from 'react'

//expects placeholders to be in this format: %placeholder%

export function replacePlaceholders(
  string: string,
  replaceables: { [key: string]: JSX.Element | string }
) {
  const parts = string.split('%')
  const keys = Object.keys(replaceables)

  return parts.map((part, index) => {
    if (index % 2 == 0) return part
    if (keys.indexOf(part) > -1) {
      return <React.Fragment key={index}>{replaceables[part]}</React.Fragment>
    }
    return <React.Fragment key={index}>%{part}%</React.Fragment>
  })
}

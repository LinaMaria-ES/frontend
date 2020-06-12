import { NextApiRequest, NextApiResponse } from 'next'

import { serloDomain } from '@/serlo-domain'

// need this to bypass CORS and cache responses
// eslint-disable-next-line import/no-default-export
export default async function privacy(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await fetch(`https://de.${serloDomain}/privacy/json`)
  const json = await data.json()
  res.json(json)
}

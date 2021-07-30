import chromium from 'chrome-aws-lambda'
import { NextApiRequest, NextApiResponse } from 'next'

const styles = `
    width: 100%;
    position:relative;
    top: -10px;
    font-size: 9px;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    justify-content: space-between;
    padding-right:40px;
    padding-left:40px;
    color: #666;
    `

// TODO: Check if we need this instead of the default date format
//const today = new Date().toLocaleDateString("de-DE");
//const updated = `Stand: ${today}`;

// const browser = await puppeteer.launch( { args: ['--no-sandbox'] } );

export default async function createPdf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('starting')
  console.log(req.query.url)
  const urlString = 'https://de.serlo-staging.dev/1565' //decodeURIComponent(req.query.url as string)
  try {
    if (urlString) {
      //&& isValidUrl(urlString)
      console.log('url check passed')

      const browser = await chromium.puppeteer.launch({
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      })
      console.log('browser launched')
      const page = await browser.newPage()
      console.log('new page created')
      await page.goto(urlString + '#print--preview', {
        waitUntil: 'networkidle0',
      })
      console.log('navigated')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pdf = await page.pdf({
        format: 'a4',
        margin: {
          top: '40px',
          bottom: '80px',
          left: '40px',
          right: '40px',
        },
        displayHeaderFooter: true,
        headerTemplate: '<span> </span>',
        footerTemplate: `<div style="${styles}">
                            <span>Online: ${urlString}</span>
                            <span class="date"></span>
                            <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
                        </div>`,
      })
      console.log('pdf created')

      await browser.close()
      console.log('browser closed')
      // res.status(200).send(urlString)
      // console.log('response sent')
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Length', pdf.length)
      // res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).send(pdf)
    } else throw 'Invalid URL!'
  } catch (error: unknown) {
    throw 'Unknown'
    // res.status(500).send({
    //   status: 'Failed',
    //   error,
    // })
  }
}

// function isValidUrl(string: string) {
//   try {
//     const url = new URL(string)
//     if (url.hostname === 'serlo.org') return true
//   } catch (_) {
//     return false
//   }
//   return false
// }

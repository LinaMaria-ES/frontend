import { InstanceLandingData } from '@/data-types'

interface PrinciplesGraphicProps {
  strings: InstanceLandingData['strings']
}

export function PrinciplesGraphic({ strings }: PrinciplesGraphicProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="148 -89 426.6 282.9">
      <g>
        <text x="354.9" y="-73.6" transform="translate(3.6 3.8)">
          <tspan
            x="354.9"
            y="-73.6"
            style={{ textAlign: 'center' }}
            fill="#fff"
            fontSize="12"
            textAnchor="middle"
          >
            {strings.democraticallyStructured}
          </tspan>
        </text>
        <text x="230" y="-2.4" transform="translate(10.3 3.8)">
          <tspan
            style={{ textAlign: 'end' }}
            x="230"
            y="-2.4"
            fill="#fff"
            fontSize="12"
            textAnchor="end"
          >
            {strings.freeOfCharge}
          </tspan>
        </text>
        <text x="229.6" y="100.9" transform="translate(10.3 3.8)">
          <tspan
            style={{ textAlign: 'end' }}
            x="229.6"
            y="100.9"
            fill="#fff"
            fontSize="12"
            textAnchor="end"
          >
            {strings.adFree}
          </tspan>
        </text>
        <text x="354.9" y="180" transform="translate(3.6 3.8)">
          <tspan
            style={{ textAlign: 'center' }}
            x="354.9"
            y="180"
            fill="#fff"
            fontSize="12"
            textAnchor="middle"
          >
            {strings.openlyLicensed}
          </tspan>
        </text>
        <g>
          <text x="463.9" y="102.2" transform="translate(13.6 3.8)">
            <tspan
              style={{ textAlign: 'start' }}
              x="463.9"
              y="102.2"
              fill="#fff"
              fontSize="12"
            >
              {strings.transparent}
            </tspan>
          </text>
          <text x="463.5" y="-2.8" transform="translate(13.6 3.8)">
            <tspan
              x="463.5"
              y="-2.8"
              style={{ textAlign: 'start' }}
              fill="#fff"
              fontSize="12"
            >
              {strings.nonProfit}
            </tspan>
          </text>
        </g>
      </g>
      <path
        fill="#fff"
        d="M304.9 53.7a53.6 53.6 0 10107.2 0 53.6 53.6 0 00-107.2 0M364.8-56.6a14 14 0 00-18.7 6.9 14 14 0 0010.3 19.8 283 283 0 002.7 5.8l2.8-5.9a14.1 14.1 0 002.9-26.6zm-8.1 18.7c-1 0-2.1-.1-3-.4l-3 1.5c-.2.1-.4.1-.3-.2l.7-2.6c-1.2-1-2-2.1-2-3.5 0-2.2 2-4 4.7-4.8-.2.5-.3 1.1-.3 1.6 0 3.6 3.9 6.4 8.7 6.4h.4a9.1 9.1 0 01-5.9 2zm11.1-5.3l.8 2.6c.1.2-.1.3-.3.2l-2.9-1.5c-.9.3-1.9.4-3 .4-4.1 0-7.3-2.3-7.3-5.1s3.3-5.1 7.3-5.1c4.1 0 7.3 2.3 7.3 5.1 0 1.4-.8 2.5-1.9 3.4zM364.8 137.7a15 15 0 00-3.4-1.1 283 283 0 00-2.4-5.4l-.3-.4-2.8 5.9a14.1 14.1 0 108.9 1zm-2.6 20.9l-2.2-5.5a2.7 2.7 0 00-1-5.2 2.7 2.7 0 00-1 5.2l-2.2 5.5a8.7 8.7 0 1111.9-8.1 9 9 0 01-5.5 8.1zM284.4 91.6l-.5-.1-5.9.3a14 14 0 00-22.3-.3 14.3 14.3 0 002.3 19.9 14 14 0 0019.8-2.3c2.9-3.6 3.7-8.2 2.6-12.3l4-5.2zm-8.9 11.9c0 .9-.8.9-.8.9h-3v2.8h-1v-2.8H263v2.8h-1v-2.8h-3c-.8 0-.8-.9-.8-.9v-8.7c0-.9.8-.9.8-.9h15.7c.8 0 .8.9.8.9zM269.3-8.8c-.9.4-1.5 1.1-2.1 1.8h1.4c.6-.1 1.7-.1 2.1-.5.4-.6-.4-1.8-1.4-1.3z"
      />
      <path
        fill="#fff"
        d="M282.3 9.3l-3.1-5a14.2 14.2 0 00-10.7-19.6c-7.7-1.2-14.9 4-16.3 11.6a14.2 14.2 0 0023.7 12.5l6.5 1c.1-.1-.1-.5-.1-.5zm-16.4-4.4h-5.6a.7.7 0 01-.7-.7v-6.8h6.3zm7.4-.7c0 .4-.3.7-.7.7H267v-7.5h6.3zm.6-7.4H267v-3.4l-.5.1-.7.1v3.3h-6.9v-2.7c0-.4.3-.8.8-.8h3.1c-.8-.2-1.5-.5-1.5-1.2 0-.8.9-2.1 2.2-1.8 1.3.3 2.3 1.3 3 2.2.7-.9 1.7-2.1 3.1-2.3 1.2-.1 2.1 1 2 1.8-.1.7-.8 1-1.6 1.2h3.1c.4 0 .8.3.8.8z"
      />
      <path
        fill="#fff"
        d="M263.6-8.8c-.6-.3-1 0-1.3.5-.1.2-.3.5-.1.8.6.6 2.3.6 3.5.5a5.3 5.3 0 00-2.1-1.8zM466.1-3.7a14.2 14.2 0 10-27 8l-3.1 5s-.2.4-.1.5l6.5-1a14.2 14.2 0 0023.7-12.5zM452.4 7.1c-3.4-4.7-8.1-7.3-8.1-10.2 0-3.8 5.4-6.6 8.1-2.4 2.9-4.2 8.1-1.4 8.1 2.4 0 2.9-4.7 5.5-8.1 10.2z"
      />
      <path
        fill="#007dc2"
        d="M373 56.1l-.3-.6a27 27 0 00-3.1-6.1 31 31 0 00-4.4-4.5 61.4 61.4 0 00-8.6-5.6c-3-1.7-5.6-3.6-7.7-5.4-2.3-2-3.6-3.5-4.7-5.5a19.3 19.3 0 01-2.6-7.4v-.7c.1-.1.2.1.4.5.8 1.4 2.1 2.9 3.4 4.1 2.3 2.1 5 3.9 8.6 5.7l8.5 4.6a46.5 46.5 0 0110.9 9.1l-.5.4c-1 .6-1.9 1.4-2.4 2l-.1.1.3-.3c.6-.6 1.6-1.2 2.6-1.7l.4-.2.5.7 1.6 2.3.3.6-.2.1a8 8 0 00-2 1.1l-.9.9.5-.1c.7-.3 1.5-.4 2.3-.4l1.1.1 1.2.5-.6.3c-1 .5-2.2 1.4-2.9 2.1-.9.9-1.5 1.8-1.7 2.7.2.5.2.6.1.6"
      />
      <path
        fill="#007dc2"
        d="M372.3 60.4c-.5-3.6-1.7-6.5-2.7-8.3-1-1.9-2-3-2-3a34 34 0 00-4.7-4.4c-3.5-2.7-7.6-5.1-7.6-5.1l-2.6-1.6-.7-.5c-1.7-1.2-3.9-3.1-3.9-3.1a24.7 24.7 0 01-4.3-5.2c-.5-.9-1-1.8-1.3-2.7-.5-1.2-.9-2.5-1.1-3.7l-.2-2.1-.1-1.3a14.7 14.7 0 00-2.6 9.2 15.4 15.4 0 003.2 8.8l1.2 1.6a41.1 41.1 0 0011.1 8.1l1.2.6.5-.1a16.6 16.6 0 016.1-.2l.6.1h-.1l-1.3-.1-2.8.2-2 .5.7.4 2.6 1.5.5.3.5-.1 1.9-.3h.2l.9.1-.6.1-2.1.5-.2.1.2.2c.8.8 1.3 1.9 1.3 2.8l-.1.5h2.3l2.1.6c1.5.7 3.3 2.3 4.3 3.9l.4.5c.2 1.3.3 2.6.2 4l1.5 3.4z"
      />
      <path
        fill="#007dc2"
        d="M371.5 67a93.8 93.8 0 01-23-4.7c-1.6-.6-4-1.6-6-2.8-2.5-1.5-3.9-2.9-4.1-4.3-.1-.8.2-1.4 1-1.9 1.1-.8 2.8-1.3 5.4-1.6l5.6-.5c1.3-.1 2.3-.3 3-.5l.5-.2.3-.3-.1-.3c-1.2-1-4-1.7-6.6-2.5l-.5-.1-8.1-2.1-1.6-.4 7.9 1.4c2.4.5 4.4 1.1 6 1.6 2 .7 3.3 1.4 4 2 .2.2.2.4.2.6-.1.3-.4.5-.9.7-1.4.5-4.1 1-7.8 1.4l-2.8.4c-1.3.3-2.9.9-2.9 1.9 0 1 1.3 2.4 3.6 3.7 2.4 1.4 5.7 2.7 9.4 3.8a57.6 57.6 0 0016.1 2.1zM384.6 62.4c-.7 0-1.4-.6-1.4-1.3 0-.8.6-1.4 1.3-1.4h.1c.8 0 1.4.6 1.4 1.3 0 .4-.1.7-.4 1-.2.2-.5.4-1 .4.1 0 .1 0 0 0"
      />
      <path
        fill="#007dc2"
        d="M370.6 78.4h-.9c-3.2-.1-6.7-.7-10-2-4.4-1.6-7.2-3-10.4-4.9a53.8 53.8 0 00-16.8-7.4c-2.3-.6-4.4-.8-6.3-.8h-.7c-1.7.1-3.1.3-4.3.8l-.4.1.7-.7c1.2-.9 3.1-1.6 5.2-1.9l2.7-.1 3.7.2c2.4.4 5.6 1.4 9.6 3a89 89 0 016.2 2.8l4.5 2 8.4 2.8c1.9.5 3.9.8 6.2.9h.7c1.8 0 4.3-.2 5.3-.4 1.5-.3 2-.5 3.2-.9 2-.7 3.4-1.4 5.9-3.1 2.3-1.5 3.2-2.2 4.8-3.7.6-.6.9-.8 1.6-1.2.6-.4 1.3-.7 1.9-.9l.4-.1-.2-.2c-1.1-.6-2-1.6-2.8-2.8a5.4 5.4 0 00-4.5-2.5h-.4c-1.4.1-2.4.4-4.1 1.2l-.9.4.8-.8a9 9 0 013.8-2.3c.6-.2.7-.2 1.7-.2h.7l.9.1c1.5.3 2.6 1.1 3.9 2.5 1.7 1.9 3.3 3.2 4.5 3.5l.4.1-.5.3-3.2 1.9a20.7 20.7 0 00-4.7 5 22.2 22.2 0 01-15 9c-.6.3-.9.3-1.6.3"
      />
      <path
        fill="#fff"
        d="M463.3 91.5a14 14 0 00-22.3.3l-5.9-.3-.5.1 4 5.2c-1.1 4.1-.3 8.7 2.6 12.3a14.1 14.1 0 0022.1-17.6zm-1.2 6l-2.1.6c-.2-.7-.4-1.3-.8-1.9l1.9-1.1c.4.8.8 1.6 1 2.4zm-9.7-7.4c.9 0 1.7.1 2.5.3l-.5 2.2c-.6-.2-1.3-.3-2-.3zm-2.6.4l.6 2.1-1.9.8-1.1-1.9c.8-.4 1.6-.8 2.4-1zm-4.5 2.6l1.5 1.5-1.2 1.7-1.9-1.1c.4-.8 1-1.4 1.6-2.1zm-2.6 4.5l2.1.6a7 7 0 00-.3 2h-2.1c0-.9.1-1.7.3-2.6zm.1 5.2l2.1-.6c.2.7.4 1.3.8 1.9l-1.9 1.1c-.4-.8-.8-1.6-1-2.4zm4.6 6c-.8-.4-1.4-1-2.1-1.6l1.5-1.5c.5.5 1 .9 1.6 1.2zm5 1.4c-.9 0-1.7-.1-2.6-.3l.6-2.1a7 7 0 002 .3zm2.6-.4l-.6-2.1c.7-.2 1.3-.4 1.9-.8l1.1 1.9c-.8.5-1.6.8-2.4 1zm1.3-16.4l1.1-1.9c.8.4 1.4 1 2.1 1.6l-1.6 1.5c-.5-.5-1-.9-1.6-1.2zm3.2 13.8l-1.5-1.5c.5-.5.9-1 1.2-1.6l1.9 1.1-1.6 2zm2.5-4.4l-2.1-.6a7 7 0 00.3-2h2.2c0 .9-.1 1.7-.4 2.6z"
      />
    </svg>
  )
}

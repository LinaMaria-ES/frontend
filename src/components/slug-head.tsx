import Head from 'next/head'

//TODO: define and export data types somewhere
interface SlugHeadProps {
  contentType: string
  data: {
    alias: string
    data: any
  }
  title: string
  origin: string
}

export function SlugHead({ contentType, data, title, origin }: SlugHeadProps) {
  function getMetaContentType() {
    //match legacy content types that are used by google custom search
    if (contentType === undefined) return ''
    if (contentType === 'Exercise') return 'text-exercise'
    if (contentType === 'CoursePage') return 'course-page'
    if (data.data?.type === 'topicFolder') return 'topic-folder'
    if (contentType === 'TaxonomyTerm') return 'topic'
    //Article, Video, Applet, Page
    return contentType.toLowerCase()
  }

  function getMetaImage() {
    const subject = data.alias ? data.alias.split('/')[1] : 'default'
    let imageSrc = 'serlo.jpg'

    switch (subject) {
      case 'mathe':
        imageSrc = 'mathematik.jpg'
        break
      case 'nachhaltigkeit':
        imageSrc = 'nachhaltigkeit.jpg'
        break
      case 'biologie':
        imageSrc = 'biologie.jpg'
        break
    }

    return `${origin}/_assets/img/meta/${imageSrc}`
  }

  function getMetaDescription() {
    if (!data.data) return false
    const hasDescription =
      data.data.metaDescription && data.data.metaDescription.length > 10
    if (hasDescription) return data.data.metaDescription

    if (data.data.value === undefined || data.data.value.children === undefined)
      return false

    const slice = data.data.value.children.slice(0, 10)
    const stringified = JSON.stringify(slice)
    const regexp = /"text":"(.)*?"/g
    const matches = stringified.match(regexp)
    const longFallback = matches
      ? matches.map((str) => str.substring(8, str.length - 1)).join('')
      : ''
    if (longFallback.length < 50) return false

    const softCutoff = 135
    const fallback =
      longFallback.substr(
        0,
        softCutoff + longFallback.substr(softCutoff).indexOf(' ')
      ) + ' …'
    const description = hasDescription ? data.data.metaDescription : fallback
    return description
  }
  const metaDescription = getMetaDescription()
  return (
    <Head>
      <title>{title ? title : 'Serlo.org'}</title>
      <meta name="content_type" content={getMetaContentType()} />
      {metaDescription && <meta name="description" content={metaDescription} />}
      <meta property="og:title" content={title} />
      <meta property="og:image" content={getMetaImage()} />
    </Head>
  )
}

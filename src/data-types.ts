import { CodeProps } from './components/content/code'
import { EquationProps } from './components/content/equations'
import {
  ExerciseChildData,
  SolutionChildData,
  ExerciseProps,
} from './components/content/exercise'
import { ExerciseGroupProps } from './components/content/exercise-group'
import { GeogebraProps } from './components/content/geogebra'
import { InjectionProps } from './components/content/injection'
import { MathProps } from './components/content/math'
import { SpoilerBodyProps } from './components/content/spoiler-body'
import { SpoilerContainerProps } from './components/content/spoiler-container'
import { VideoProps } from './components/content/video'
import { Instance } from './fetcher/query'
import { RenderImgData } from './schema/article-renderer'

// This file describes the data structures that controls the frontend.

// There are two types of data: instance data (language specific) and page data.

// Instance data are bound to one language and will not reload between pages within this language.

// Page data is reloaded for every page request.

// Both data comes in through initial props on the index page.

// If your data is static across all pages and languages, don't add it here, but add it directly to the component.

// The origin points to the frontend deployment.

export interface InitialProps {
  instanceData?: InstanceData
  pageData: PageData
  origin: string
}

// Instance data consists of the language, translation strings, header menu and footer menu.

// The frontend supports all languages that the backend supports.

export interface InstanceData {
  lang: Instance
  strings: {
    header: HeaderStrings
    footer: FooterStrings
    categories: CategoryStrings
    share: ShareStrings
    edit: EditStrings
    license: LicenseStrings
    course: CourseStrings
    taxonomy: TaxonomyStrings
    content: ContentStrings
    cookie: CookieStrings
  }
  headerData: HeaderData
  footerData: FooterData
}

// Landing pages have a different structure, because they should only load on the landing page

export interface InstanceLandingData {
  lang: Instance
  strings: LandingStrings
}

// Menus are trees of title and urls, possibly with icons.

export type HeaderData = HeaderLink[]

export interface HeaderLink {
  title: string
  url: string
  icon?: HeaderIcon
  children?: HeaderLink[]
}

export type HeaderIcon =
  | 'subject'
  | 'about'
  | 'participate'
  | 'community'
  | 'donate'
  | 'user'
  | 'login'
  | 'notifications'

export interface HeaderStrings {
  slogan: string
  search: string
  login: string
}

// The footer is split into different categories and has three separate links.

export interface FooterData {
  footerNavigation: FooterNavigation
  aboutHref: string
  participationHref: string
  donationHref: string
}

export type FooterNavigation = FooterCategory[]

export interface FooterCategory {
  title: string
  children: FooterLink[]
}

export interface FooterLink {
  title: string
  url: string
  icon?: 'newsletter' | 'github'
}

export interface FooterStrings {
  summaryHeading: string
  summaryText: string
  learnMore: string
  participate: string
  donate: string
  toTop: string
}

// We have different types of pages, each with its own set of data:

export type PageData =
  | LandingPage
  | DonationPage
  | SearchPage
  | ErrorPage
  | NotificationsPage
  | SingleEntityPage
  | TaxonomyPage

export type FetchedData = PageData & {
  redirect?: string
  error?: string
  pageData: PageData
  alias?: string
}

// The landing page is custom built and takes no additional data

export interface LandingPage {
  kind: 'landing'
}

// The same for donation, search and error and notifications page:

export interface DonationPage {
  kind: 'donation'
}

export interface SearchPage {
  kind: 'search'
}

export interface ErrorPage {
  kind: 'error'
}

export interface NotificationsPage {
  kind: 'user/notifications'
}

// There are several page elements that are common for entities:

export interface EntityPageBase {
  breadcrumbsData?: BreadcrumbsData
  secondaryNavigationData?: SecondaryNavigationData
  metaData?: HeadData
  horizonData?: HorizonData
  newsletterPopup: boolean
  cacheKey?: string // save page data to session storage
}

// Breadcrumb entries are shown nexts to each other, with possible ellipsis in between
// (Another example of discrimination data types ...)

export type BreadcrumbsData = BreadcrumbEntry[]

export type BreadcrumbEntry = BreadcrumbLinkEntry | BreadcrumbEllipsis

export interface BreadcrumbLinkEntry {
  label: string
  url?: string
  ellipsis?: boolean | false
}

export interface BreadcrumbEllipsis extends BreadcrumbLinkEntry {
  label: ''
  ellipsis: true
}

// Menu shown on the left (desktop) or between header and content (mobile)
// Links can be active, urls are already prettified.

export type SecondaryNavigationData = SecondaryNavigationEntry[]

export interface SecondaryNavigationEntry {
  url?: string
  title: string
  active?: boolean
}

// Populate some head tags (e.g. open graph)

export interface HeadData {
  title: string
  contentType?: string
  metaDescription?: string
  metaImage?: string
}

// The data that fills the horizon (desktop, below content)

export type HorizonData = HorizonEntry[]

export interface HorizonEntry {
  title: string
  imageUrl: string
  text: string
  url: string
}

// All entities (except taxonomy) have a shared data structure.

export interface SingleEntityPage extends EntityPageBase {
  kind: 'single-entity'
  entityData: EntityData
}

export interface EntityData {
  id: number
  title?: string
  categoryIcon?: CategoryType
  schemaData?: SchemaData
  content?: FrontendContentNode[] | any[]
  inviteToEdit?: boolean
  licenseData?: LicenseData
  courseData?: CourseData
}

// Entities can belong to a category. Each has a translated string.

export type CategoryType =
  | 'article'
  | 'course'
  | 'video'
  | 'applet'
  | 'folder'
  | 'exercises'

export type CategoryStrings = {
  [K in CategoryType]: string
}

// Some flags to control schema.org behaviour. Not very well done yet.

export interface SchemaData {
  wrapWithItemType?: string
  useArticleTag?: boolean
  setContentAsSection?: boolean
}

// The actual content of the page.

// The frontend defines it's own content format that bridges the gap between legacy and edtr-io state.
// Will switch to edtr-io state one day.
// Until then: Here are the types the fontend expects after converting

export interface FrontendContentTextNode {
  text?: string
  color?: 'blue' | 'green' | 'orange'
  em?: boolean
  strong?: boolean
}

type FrontendContentNodeNoText =
  | ({ type: 'img' } & RenderImgData['element']) //href
  | ({ type: 'math' | 'inline-math' } & MathProps)
  | ({ type: 'code' } & CodeProps)
  | ({ type: 'equations' } & EquationProps)
  | ({ type: 'exercise' } & ExerciseProps) //unsure!
  | ({ type: 'exercise-group' } & ExerciseGroupProps)
  | ({ type: '@edtr-io/exercise' } & ExerciseChildData)
  | ({ type: '@edtr-io/solution' } & SolutionChildData)
  | ({ type: 'spoiler-container' } & SpoilerContainerProps)
  | { type: 'spoiler-title'; children: FrontendContentNode[] }
  | ({ type: 'spoiler-body' } & SpoilerBodyProps)
  | ({ type: 'injection' } & InjectionProps) //href
  | ({ type: 'video' } & VideoProps)
  | ({ type: 'geogebra' } & GeogebraProps)
  | { type: 'row'; children: FrontendContentNode[] }
  | { type: 'col'; size: number; children: FrontendContentNode[] }
  | { type: 'anchor'; id: string }
  | { type: 'important'; children: FrontendContentNode[] }
  | { type: 'p'; children?: FrontendContentNode[] }
  | {
      type: 'h'
      id?: string | number
      level: number
      children: FrontendContentNode[]
    }
  | { type: 'a'; href?: string; children: FrontendContentNode[] }
  | { type: 'ul'; children: FrontendContentNode[] }
  | { type: 'ol'; children: FrontendContentNode[] }
  | {
      type: 'li'
      children: FrontendContentNode[]
    }
  | { type: 'table'; children: FrontendContentNode[] } //maybe make more explicit, should only contain tr,td,th
  | { type: 'td'; children: FrontendContentNode[] } // etc.
  | { type: 'th'; children: FrontendContentNode[] }
  | { type: 'tr'; children: FrontendContentNode[] }

export type FrontendContentNode = (
  | FrontendContentNodeNoText
  | ({ type?: '' | 'text' } & FrontendContentTextNode) //usually type is not set for text nodes
) & {
  children?: FrontendContentNode[]
} //TODO: added because children are always just checked in code not by checking/guarding types
//changing that need quite a bit of refactoring
//maybe that's okay for now?

// Some translations

export interface ShareStrings {
  button: string
  title: string
  copyLink: string
  copySuccess: string
  close: string
}

export interface EditStrings {
  button: string
}

// A license notice.

export interface LicenseData {
  title: string
  url: string // to to license
  id: number // of the license
}

export interface LicenseStrings {
  readMore: string
}

// Data for a course page.

export interface CourseData {
  title: string
  pages: CoursePagesData
  nextPageUrl?: string
}

export type CoursePagesData = CoursePageEntry[]

export interface CoursePageEntry {
  title: string
  url: string
  active?: boolean
}

export interface CourseStrings {
  showPages: string
  pages: string
  next: string
}

// Taxonomy: Folders with other entities, sorted by category, first level of subfolders and exercises are shown directly

export interface TaxonomyPage extends EntityPageBase {
  kind: 'taxonomy'
  taxonomyData: TaxonomyData
}

export interface ProcessedResponseTaxonomy {
  contentType: 'TaxonomyTerm'
  data: ProcessedResponseTaxonomyChild
}

interface ProcessedResponseTaxonomyChild {
  title: string
  url: string
  purpose: 0 | 1 | 2
  links: TaxonomyData
  description?: FrontendContentNode
  children?: ProcessedResponseTaxonomyChild[]
  exercises?: FrontendContentNode[]
}

// Shared attributes for first and second level.

export interface TaxonomyTermBase {
  articles: TaxonomyLink[]
  courses: TaxonomyLink[]
  videos: TaxonomyLink[]
  applets: TaxonomyLink[]
  exercises: TaxonomyLink[]
  description?: FrontendContentNode[]
  subfolders: TaxonomyTermBase[]
}

export interface TaxonomyLink {
  title: string
  url: string
}

// Second level has folders and exercises as links

export interface TaxonomySubTerm extends TaxonomyTermBase, TaxonomyLink {
  folders: TaxonomyLink[]
}

// First level loads second level elements and exercises as content.

export interface TaxonomyData extends TaxonomyTermBase {
  id: number
  title: string
  subterms: TaxonomySubTerm[]
  exercisesContent: FrontendContentNode[][]
}

// Some translations for the taxonomy.

export interface TaxonomyStrings {
  topicFolder: string
}

// And some translations for content

export interface ContentStrings {
  hide: string
  show: string
  prerequisite: string
  solution: string
  exerciseGroup: string
  right: string
  wrong: string
  check: string
  yourAnswer: string
  chooseOption: string
}

export interface CookieStrings {
  part1: string
  part2: string
  part3: string
  link1: string
  link2: string
  button: string
}

export interface LandingStrings {
  vision: string
  learnMore: string
  democraticallyStructured: string
  nonProfit: string
  transparent: string
  openlyLicensed: string
  adFree: string
  freeOfCharge: string
  wikiTitle: string
  wikiText: string
  movementTitle: string
  callForAuthors: string
  communityLink: string
  callForOther: string
  getInvolved: string
}

import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NextPage } from 'next'
import Head from 'next/head'
import * as React from 'react'
import styled from 'styled-components'

import AuthorBadge from '@/assets-webkit/img/community/badge-author.svg'
import DonorBadge from '@/assets-webkit/img/community/badge-donor.svg'
import ReviewerBadge from '@/assets-webkit/img/community/badge-reviewer.svg'
import { useAuthentication } from '@/auth/use-authentication'
import { CommentArea } from '@/components/comments/comment-area'
import { StyledA } from '@/components/tags/styled-a'
import { StyledH1 } from '@/components/tags/styled-h1'
import { StyledH2 } from '@/components/tags/styled-h2'
import { StyledLi } from '@/components/tags/styled-li'
import { StyledOl } from '@/components/tags/styled-ol'
import { StyledP } from '@/components/tags/styled-p'
import { TimeAgo } from '@/components/time-ago'
import { CloseButton, StyledModal } from '@/components/user-tools/share-modal'
import { UserTools } from '@/components/user-tools/user-tools'
import { useInstanceData } from '@/contexts/instance-context'
import { UserPage } from '@/data-types'
import { makeGreenButton, makeMargin } from '@/helper/css'
import { replacePlaceholders } from '@/helper/replace-placeholders'
import { renderArticle } from '@/schema/article-renderer'

export interface ProfileProps {
  userData: UserPage['userData']
}

export const Profile: NextPage<ProfileProps> = ({ userData }) => {
  const { strings } = useInstanceData()
  const { id, username, description, lastLogin, imageUrl, date } = userData
  const { activeDonor, activeReviewer, activeAuthor } = userData
  const auth = useAuthentication()
  const isOwnProfile = auth.current?.username === username
  const lastLoginDate = lastLogin ? new Date(lastLogin) : undefined
  const registerDate = new Date(date)
  const [showImageModal, setShowImageModal] = React.useState(false)

  return (
    <>
      <Head>
        <title>{username}</title>
        {!activeDonor && !activeAuthor && !activeReviewer && (
          <meta name="robots" content="noindex" />
        )}
      </Head>

      <ProfileHeader>
        {renderProfileImage()}
        <div>
          <UsernameHeading>{username}</UsernameHeading>
          <StyledP>
            {strings.profiles.activeSince}{' '}
            <time
              dateTime={registerDate.toISOString()}
              title={registerDate.toLocaleDateString()}
            >
              {registerDate.getFullYear()}
            </time>
          </StyledP>
        </div>
        {renderBadges()}
      </ProfileHeader>

      {description && (
        <>
          <StyledH2>{strings.profiles.aboutMe}</StyledH2>
          {renderArticle(description, `profile${id}`)}
        </>
      )}
      <CommentArea id={id} noForms />
      {lastLoginDate && (
        <Gray>
          {strings.profiles.lastLogin}:{' '}
          <b>
            <TimeAgo datetime={lastLoginDate} dateAsTitle />
          </b>
        </Gray>
      )}
      {renderUserTools()}
      {renderHowToEditImage()}
    </>
  )

  function renderBadges() {
    if (!activeAuthor && !activeReviewer && !activeDonor) return null

    return (
      <BadgesContainer>
        {activeReviewer &&
          renderBadge({ Badge: ReviewerBadge, name: strings.roles.reviewer })}
        {activeAuthor &&
          renderBadge({ Badge: AuthorBadge, name: strings.roles.author })}
        {activeDonor &&
          renderBadge({ Badge: DonorBadge, name: strings.roles.donor })}
      </BadgesContainer>
    )
  }

  function renderBadge({
    Badge,
    name,
  }: {
    Badge: typeof ReviewerBadge | typeof AuthorBadge | typeof DonorBadge
    name: string
  }) {
    return (
      <BadgeContainer>
        <Badge />
        <StyledP>{name}</StyledP>
      </BadgeContainer>
    )
  }

  function renderUserTools() {
    return (
      <UserTools
        id={id}
        hideEditProfile={!isOwnProfile}
        data={{
          type: 'Profile',
          id: id,
        }}
      />
    )
  }

  function renderProfileImage() {
    return (
      <ProfileImageCage>
        <ProfileImage src={imageUrl} />
        {isOwnProfile && (
          <ProfileImageEditButton onClick={() => setShowImageModal(true)}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </ProfileImageEditButton>
        )}
      </ProfileImageCage>
    )
  }

  function renderHowToEditImage() {
    const { heading, description, steps } = strings.profiles.howToEditImage
    const chatUrl = (
      <StyledA href="https://community.serlo.org">community.serlo.org</StyledA>
    )
    const myAccountLink = (
      <StyledA href="https://community.serlo.org/account/profile">
        {steps.myAccount}
      </StyledA>
    )

    return (
      <StyledModal
        isOpen={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
      >
        <StyledH2>{heading}</StyledH2>
        <StyledP>{replacePlaceholders(description, { chatUrl })}</StyledP>
        <StyledOl>
          <StyledLi>
            {replacePlaceholders(steps.goToChat, { chatUrl })}
          </StyledLi>
          <StyledLi>{steps.signIn}</StyledLi>
          <StyledLi>
            {replacePlaceholders(steps.goToMyAccount, { myAccountLink })}
          </StyledLi>
          <StyledLi>{steps.uploadPicture}</StyledLi>
        </StyledOl>
        {/*TODO: Should be merged in a common Modal*/}
        <CloseButton onClick={() => setShowImageModal(false)}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </CloseButton>
      </StyledModal>
    )
  }
}

const ProfileImageEditButton = styled.button`
  ${makeGreenButton}
  display: block;
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 2em;
  height: 2em;
  background-color: ${(props) => props.theme.colors.brandGreen};
  color: ${(props) => props.theme.colors.white};

  &:focus {
    background-color: ${(props) => props.theme.colors.brand};
  }
`

const ProfileImageCage = styled.figure`
  width: 150px;
  height: 150px;
  contain: content;
`

const ProfileImage = styled.img`
  display: block;
  border-radius: 50%;
  width: 100%;
  height: 100%;
`

const BadgesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const BadgeContainer = styled.div`
  margin-right: 20px;

  & > * {
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
`

const ProfileHeader = styled.header`
  ${makeMargin}
  margin-top: 40px;
  margin-bottom: 30px;

  @media (min-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    & > * {
      margin-right: 20px;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    & > * {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
  }

  & ${BadgeContainer} > svg,
  & h1 {
    height: 40px;
    margin-top: 15px;
    margin-bottom: 10px;
  }
`

const UsernameHeading = styled(StyledH1)`
  font-weight: normal;
`

const Gray = styled(StyledP)`
  margin-top: 70px;
  font-size: 0.9rem;
  color: #777;
`

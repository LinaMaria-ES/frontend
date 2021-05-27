import styled from 'styled-components'

import { StyledModal } from '../user-tools/share-modal'
import { useInstanceData } from '@/contexts/instance-context'
import { makeMargin } from '@/helper/css'

export interface LightBoxProps {
  open: boolean
  onClose: () => void
  src: string
  label?: string
}

export function LightBox(props: LightBoxProps) {
  const { strings } = useInstanceData()
  const { open, onClose, label, src } = props
  if (!open) return null

  const pictureString = strings.content.picture

  return (
    <LightboxStyledModal isOpen={open} onRequestClose={onClose}>
      <_StyledImg onClick={onClose} src={src} alt={label ?? pictureString} />
      <p>{label}</p>
    </LightboxStyledModal>
  )
}

export const LightboxStyledModal = styled(StyledModal)`
  text-align: center;
  top: 50%;
  padding-bottom: 30px;
  width: inherit;

  pointer-events: none;
  > p {
    pointer-events: auto;
  }
`

const _StyledImg = styled.img`
  padding: 50px ${makeMargin};
  margin: 0 auto;
  max-width: 100%;
  height: auto;
  max-height: 86vh;
  cursor: zoom-out;
`

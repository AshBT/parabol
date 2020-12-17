import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import {NewMeetingSettingsToggleCheckIn_settings} from '~/__generated__/NewMeetingSettingsToggleCheckIn_settings.graphql'
import useAtmosphere from '../hooks/useAtmosphere'
import useMutationProps from '../hooks/useMutationProps'
import SetCheckInEnabledMutation from '../mutations/SetCheckInEnabledMutation'
import {PALETTE} from '../styles/paletteV2'
import {ICON_SIZE} from '../styles/typographyV2'
import {NewMeeting} from '../types/constEnums'
import {NewMeetingPhaseTypeEnum} from '../types/graphql'
import Checkbox from './Checkbox'
import PlainButton from './PlainButton/PlainButton'

const ButtonRow = styled(PlainButton)({
  alignItems: 'center',
  display: 'flex',
  padding: '12px 12px 12px 16px',
  width: NewMeeting.CONTROLS_WIDTH,
  background: '#fff',
  border: `1px solid ${PALETTE.BORDER_DROPDOWN}`,
  borderTop: 0,
  borderRadius: '0 0 4px 4px',
  ':hover': {
    backgroundColor: PALETTE.BACKGROUND_MAIN_LIGHTENED
  }
})

const Label = styled('div')({
  color: PALETTE.TEXT_MAIN,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  minWidth: 160,
  lineHeight: '24px',
  userSelect: 'none',
})

const StyledCheckbox = styled(Checkbox)<{active: boolean}>(({active}) => ({
  color: active ? PALETTE.LINK_BLUE : PALETTE.TEXT_MAIN,
  fontSize: ICON_SIZE.MD24,
  marginRight: 16,
  textAlign: 'center',
  userSelect: 'none',
  width: ICON_SIZE.MD24
}))

interface Props {
  settings: NewMeetingSettingsToggleCheckIn_settings
}

const NewMeetingSettingsToggleCheckIn = (props: Props) => {
  const {settings} = props
  const {id: settingsId, phaseTypes} = settings
  const hasCheckIn = phaseTypes.includes(NewMeetingPhaseTypeEnum.checkin)
  const atmosphere = useAtmosphere()
  const {onCompleted, onError, submitting, submitMutation} = useMutationProps()
  const toggleCheckIn = () => {
    if (submitting) return
    submitMutation()
    SetCheckInEnabledMutation(
      atmosphere,
      {isEnabled: !hasCheckIn, settingsId},
      {onError, onCompleted}
    )
  }
  return (
    <ButtonRow onClick={toggleCheckIn}>
      <StyledCheckbox active={hasCheckIn} />
      <Label>{'Include Icebreaker'}</Label>
    </ButtonRow>
  )
}

export default createFragmentContainer(NewMeetingSettingsToggleCheckIn, {
  settings: graphql`
    fragment NewMeetingSettingsToggleCheckIn_settings on TeamMeetingSettings {
      id
      phaseTypes
    }
  `
})

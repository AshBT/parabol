import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import useAtmosphere from '../hooks/useAtmosphere'
import useMutationProps from '../hooks/useMutationProps'
import {PALETTE} from '../styles/paletteV2'
import AtlassianClientManager from '../utils/AtlassianClientManager'
import {ScopePhaseAreaAddJira_meeting} from '../__generated__/ScopePhaseAreaAddJira_meeting.graphql'
import JiraSVG from './JiraSVG'
import RaisedButton from './RaisedButton'

const AddJiraArea = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100%'
})

const StyledLink = styled('span')({
  color: PALETTE.LINK_BLUE,
  cursor: 'pointer',
  outline: 0,
  ':hover, :focus, :active': {
    color: PALETTE.LINK_BLUE_HOVER
  },
  paddingTop: 24
})

const AddJiraButton = styled(RaisedButton)({
  whiteSpace: 'pre-wrap',
})
interface Props {
  gotoParabol: () => void
  meeting: ScopePhaseAreaAddJira_meeting
}

const ScopePhaseAreaAddJira = (props: Props) => {
  const atmosphere = useAtmosphere()
  const mutationProps = useMutationProps()

  const {gotoParabol, meeting} = props
  const {teamId, viewerMeetingMember} = meeting
  const {teamMember} = viewerMeetingMember
  const {integrations} = teamMember
  const hasAuth = integrations.atlassian?.isActive ?? false

  const importStories = () => {
    if (!hasAuth) {
      AtlassianClientManager.openOAuth(atmosphere, teamId, mutationProps)
    }
  }
  return (
    <AddJiraArea>
      <AddJiraButton onClick={importStories} size={'medium'}><JiraSVG />Import stories from Jira</AddJiraButton>
      <StyledLink onClick={gotoParabol}>Or add new tasks in Parabol</StyledLink>
    </AddJiraArea>
  )
}

export default createFragmentContainer(ScopePhaseAreaAddJira, {
  meeting: graphql`
    fragment ScopePhaseAreaAddJira_meeting on PokerMeeting {
      teamId
      viewerMeetingMember {
        teamMember {
          integrations {
            atlassian {
                isActive
            }
          }
        }
      }
    }
  `
})

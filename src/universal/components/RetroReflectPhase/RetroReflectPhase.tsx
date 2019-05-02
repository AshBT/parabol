import {RetroReflectPhase_team} from '__generated__/RetroReflectPhase_team.graphql'
import ms from 'ms'
import React, {useRef} from 'react'
import styled from 'react-emotion'
import {createFragmentContainer, graphql} from 'react-relay'
import BottomNavControl from 'universal/components/BottomNavControl'
import BottomNavIconLabel from 'universal/components/BottomNavIconLabel'
import MeetingPhaseWrapper from 'universal/components/MeetingPhaseWrapper'
import MeetingHelpToggle from 'universal/components/MenuHelpToggle'
import Overflow from 'universal/components/Overflow'
import {RetroMeetingPhaseProps} from 'universal/components/RetroMeeting'
import PhaseItemColumn from 'universal/components/RetroReflectPhase/PhaseItemColumn'
import useAtmosphere from 'universal/hooks/useAtmosphere'
import useTimeout from 'universal/hooks/useTimeout'
import MeetingControlBar from 'universal/modules/meeting/components/MeetingControlBar/MeetingControlBar'
import {GROUP} from 'universal/utils/constants'
import handleRightArrow from 'universal/utils/handleRightArrow'
import isDemoRoute from 'universal/utils/isDemoRoute'
import lazyPreload from 'universal/utils/lazyPreload'
import {phaseLabelLookup} from 'universal/utils/meetings/lookups'
import {REFLECTION_WIDTH} from 'universal/utils/multiplayerMasonry/masonryConstants'
import EndMeetingButton from '../EndMeetingButton'

const minWidth = REFLECTION_WIDTH + 32

const StyledOverflow = styled(Overflow)({
  // using position helps with overflow of columns for small screens
  position: 'relative'
})

const StyledWrapper = styled(MeetingPhaseWrapper)(({phaseItemCount}: {phaseItemCount: number}) => ({
  minWidth: phaseItemCount * minWidth,
  // using position helps with overflow of columns for small screens
  position: 'absolute'
}))

const BottomControlSpacer = styled('div')({
  minWidth: '6rem'
})

const StyledBottomBar = styled(MeetingControlBar)({
  justifyContent: 'space-between'
})

interface Props extends RetroMeetingPhaseProps {
  team: RetroReflectPhase_team
}

const ReflectHelpMenu = lazyPreload(async () =>
  import(/* webpackChunkName: 'ReflectHelpMenu' */ 'universal/components/MeetingHelp/ReflectHelpMenu')
)
const DemoReflectHelpMenu = lazyPreload(async () =>
  import(/* webpackChunkName: 'DemoReflectHelpMenu' */ 'universal/components/MeetingHelp/DemoReflectHelpMenu')
)

const RetroReflectPhase = (props: Props) => {
  const {team, handleGotoNext, isDemoStageComplete} = props
  const atmosphere = useAtmosphere()
  const {current} = handleGotoNext
  const {gotoNext, ref: gotoNextRef} = current
  const minTimeComplete = useTimeout(ms('2m'))
  const phaseRef = useRef<HTMLDivElement>(null)
  const {viewerId} = atmosphere
  const {newMeeting} = team
  if (!newMeeting) return null
  const {facilitatorUserId, localPhase, id: meetingId, reflectionGroups, localStage} = newMeeting
  const isComplete = localStage ? localStage.isComplete : false
  const reflectPrompts = localPhase!.reflectPrompts!
  const isFacilitating = facilitatorUserId === viewerId
  const nextPhaseLabel = phaseLabelLookup[GROUP]
  const isEmpty = !reflectionGroups || reflectionGroups.length === 0
  const isReadyToGroup =
    !isComplete &&
    !isEmpty &&
    minTimeComplete &&
    reflectPrompts.reduce(
      (sum, prompt) => sum + (prompt.editorIds ? prompt.editorIds.length : 0),
      0
    ) === 0
  return (
    <React.Fragment>
      <StyledOverflow>
        <StyledWrapper phaseItemCount={reflectPrompts.length} innerRef={phaseRef}>
          {reflectPrompts.map((prompt, idx) => (
            <PhaseItemColumn
              key={prompt.id}
              meeting={newMeeting}
              retroPhaseItemId={prompt.id}
              question={prompt.question}
              editorIds={prompt.editorIds}
              description={prompt.description}
              idx={idx}
              phaseRef={phaseRef}
            />
          ))}
        </StyledWrapper>
      </StyledOverflow>
      {isFacilitating && (
        <StyledBottomBar>
          <BottomControlSpacer />
          <BottomNavControl
            isBouncing={isDemoStageComplete || isReadyToGroup}
            disabled={isEmpty}
            onClick={() => gotoNext()}
            onKeyDown={handleRightArrow(() => gotoNext())}
            innerRef={gotoNextRef}
          >
            <BottomNavIconLabel
              icon='arrow_forward'
              iconColor='warm'
              label={`Next: ${nextPhaseLabel}`}
            />
          </BottomNavControl>
          <EndMeetingButton meetingId={meetingId} />
        </StyledBottomBar>
      )}
      <MeetingHelpToggle
        floatAboveBottomBar={isFacilitating}
        menu={isDemoRoute() ? <DemoReflectHelpMenu /> : <ReflectHelpMenu />}
      />
    </React.Fragment>
  )
}

graphql`
  fragment RetroReflectPhase_phase on ReflectPhase {
    reflectPrompts {
      id
      question
      description
      editorIds
    }
  }
`

export default createFragmentContainer(
  RetroReflectPhase,
  graphql`
    fragment RetroReflectPhase_team on Team {
      newMeeting {
        ...PhaseItemColumn_meeting
        id
        facilitatorUserId
        ... on RetrospectiveMeeting {
          localStage {
            isComplete
          }
          reflectionGroups {
            id
          }
          localPhase {
            ...RetroReflectPhase_phase @relay(mask: false)
          }
          phases {
            ...RetroReflectPhase_phase @relay(mask: false)
          }
        }
      }
    }
  `
)

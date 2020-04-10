import graphQLSubscriptionType from '../graphQLSubscriptionType'
import {AddReactjiToReflectionSuccess} from './AddReactjiToReflectionPayload'
import {AddReactjiToReactableSuccess} from './AddReactjiToReactablePayload'
import AutoGroupReflectionsPayload from './AutoGroupReflectionsPayload'
import CreateReflectionPayload from './CreateReflectionPayload'
import DragDiscussionTopicPayload from './DragDiscussionTopicPayload'
import EditReflectionPayload from './EditReflectionPayload'
import EndDraggingReflectionPayload from './EndDraggingReflectionPayload'
import NewMeetingCheckInPayload from './NewMeetingCheckInPayload'
import PromoteNewMeetingFacilitatorPayload from './PromoteNewMeetingFacilitatorPayload'
import RemoveReflectionPayload from './RemoveReflectionPayload'
import {SetAppLocationSuccess} from './SetAppLocationPayload'
import SetPhaseFocusPayload from './SetPhaseFocusPayload'
import SetStageTimerPayload from './SetStageTimerPayload'
import StartDraggingReflectionPayload from './StartDraggingReflectionPayload'
import UpdateDragLocationPayload from './UpdateDragLocationPayload'
import UpdateNewCheckInQuestionPayload from './UpdateNewCheckInQuestionPayload'
import UpdateReflectionContentPayload from './UpdateReflectionContentPayload'
import UpdateReflectionAnonymityPayload from './UpdateReflectionAnonymityPayload'
import UpdateReflectionGroupTitlePayload from './UpdateReflectionGroupTitlePayload'
import VoteForReflectionGroupPayload from './VoteForReflectionGroupPayload'
import {AddCommentSuccess} from './AddCommentPayload'
import {DeleteCommentSuccess} from './DeleteCommentPayload'
import {UpdateCommentContentSuccess} from './UpdateCommentContentPayload'
import {UpdateRetroMaxVotesSuccess} from './UpdateRetroMaxVotesPayload'

const types = [
  AddCommentSuccess,
  AddReactjiToReflectionSuccess, // DEPRECATED
  AddReactjiToReactableSuccess,
  AutoGroupReflectionsPayload,
  CreateReflectionPayload,
  DeleteCommentSuccess,
  DragDiscussionTopicPayload,
  EndDraggingReflectionPayload,
  EditReflectionPayload,
  NewMeetingCheckInPayload,
  PromoteNewMeetingFacilitatorPayload,
  RemoveReflectionPayload,
  SetAppLocationSuccess,
  SetPhaseFocusPayload,
  SetStageTimerPayload,
  StartDraggingReflectionPayload,
  UpdateCommentContentSuccess,
  UpdateDragLocationPayload,
  UpdateNewCheckInQuestionPayload,
  UpdateReflectionContentPayload,
  UpdateReflectionAnonymityPayload,
  UpdateReflectionGroupTitlePayload,
  UpdateRetroMaxVotesSuccess,
  VoteForReflectionGroupPayload
]

export default graphQLSubscriptionType('MeetingSubscriptionPayload', types)

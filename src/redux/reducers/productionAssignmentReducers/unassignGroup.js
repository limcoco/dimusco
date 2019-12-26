import {
    UNASSIGN_GROUP,
    UNASSIGN_GROUP_FAILED
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const unassignGroupStatus = (state = initialState, action) => {
    switch (action.type) {
        case UNASSIGN_GROUP:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case UNASSIGN_GROUP_FAILED:
            state = {
                ...state,
                ...action.payload,
                failure: true
            }
        break
        default:
        break
    }
    return state
}
  
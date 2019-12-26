import {
    ASSIGN_GROUP,
    ASSIGN_GROUP_FAILED
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const assignGroupStatus = (state = initialState, action) => {
    switch (action.type) {
        case ASSIGN_GROUP:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case ASSIGN_GROUP_FAILED:
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
  
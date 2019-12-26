import {
    REMOVE_CONTACT_TO_GROUP,
    REMOVE_CONTACT_TO_GROUP_FAILED
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const removeContactFromGroupStatus = (state = initialState, action) => {
    switch (action.type) {
        case REMOVE_CONTACT_TO_GROUP:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case REMOVE_CONTACT_TO_GROUP_FAILED:
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
  
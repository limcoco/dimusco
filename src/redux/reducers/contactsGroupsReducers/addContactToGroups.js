import {
    ADD_CONTACT_TO_GROUP,
    ADD_CONTACT_TO_GROUP_FAILED
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const addContactToGroupStatus = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CONTACT_TO_GROUP:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case ADD_CONTACT_TO_GROUP_FAILED:
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
  
import {
    DELETE_CONTACTS_GROUP,
    DELETE_CONTACTS_GROUP_FAILED
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const deleteContactsGroupStatus = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_CONTACTS_GROUP:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case DELETE_CONTACTS_GROUP_FAILED:
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
  
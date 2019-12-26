import {
    CREATE_CONTACTS_GROUP,
    CREATE_CONTACTS_GROUP_FAILED
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const createContactsGroupStatus = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_CONTACTS_GROUP:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case CREATE_CONTACTS_GROUP_FAILED:
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
  
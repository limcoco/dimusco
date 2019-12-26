import {
    CONTACTS_GROUPS,
    CONTACTS_GROUPS_FAILED
} from '../../actionTypes';

const initialState = {
    results: [],
    success: false,
    failure: false
}
export const contactsGroups = (state = initialState, action) => {
    switch (action.type) {
        case CONTACTS_GROUPS:
            state = {
                ...state,
                results: action.payload.results,
                success: true,
            }
        break
        case CONTACTS_GROUPS_FAILED:
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
  
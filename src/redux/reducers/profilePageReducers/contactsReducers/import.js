import {
    IMPORT_CONTACTS_SUCCESS,
    IMPORT_CONTACTS_FAILURE
} from '../../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const importStatus = (state = initialState, action) => {
    switch (action.type) {
        case IMPORT_CONTACTS_SUCCESS:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case IMPORT_CONTACTS_FAILURE:
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
  
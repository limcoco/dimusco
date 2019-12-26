import {
    EXPORT_CONTACTS_SUCCESS,
    EXPORT_CONTACTS_FAILURE
} from '../../../actionTypes';

const initialState = {
    success: false,
    failure: false,
    data: ''
}
export const exportStatus = (state = initialState, action) => {
    switch (action.type) {
        case EXPORT_CONTACTS_SUCCESS:
            state = {
                ...state,
                data: action.payload,
                success: true,
            }
        break
        case EXPORT_CONTACTS_FAILURE:
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
  
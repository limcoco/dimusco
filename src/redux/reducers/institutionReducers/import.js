import {
    IMPORT_SUCCESS,
    IMPORT_FAILURE
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false
}
export const importStatus = (state = initialState, action) => {
    switch (action.type) {
        case IMPORT_SUCCESS:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case IMPORT_FAILURE:
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
  
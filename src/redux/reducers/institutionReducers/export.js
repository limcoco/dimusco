import {
    EXPORT_SUCCESS,
    EXPORT_FAILURE
} from '../../actionTypes';

const initialState = {
    success: false,
    failure: false,
    data: ''
}
export const exportStatus = (state = initialState, action) => {
    switch (action.type) {
        case EXPORT_SUCCESS:
            state = {
                ...state,
                data: action.payload,
                success: true,
            }
        break
        case EXPORT_FAILURE:
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
  
import {
    PRODUCTIONS_GROUPS,
    PRODUCTIONS_GROUPS_FAILED
} from '../../actionTypes';

const initialState = {
    assigned: [],
    unassigned: [],
    success: false,
    failure: false
}
export const productionAssignmentGroups = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCTIONS_GROUPS:
            state = {
                ...state,
                ...action.payload,
                success: true,
            }
        break
        case PRODUCTIONS_GROUPS_FAILED:
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
  
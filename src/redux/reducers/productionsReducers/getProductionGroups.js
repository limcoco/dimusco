import { GET_PRODUCTION_GROUPS_DETAILS } from "../../actions/productionsActions";

export const productionGroups = (state = {results: []}, action) => {
  switch (action.type) {
    case GET_PRODUCTION_GROUPS_DETAILS:
      state = {
        ...action.payload
      }
      break
    default:
      break
  }
  return state
}

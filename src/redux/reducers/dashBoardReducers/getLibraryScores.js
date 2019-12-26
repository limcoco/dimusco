import { GET_LIBRARY_SCORES } from "../../actions/dashBoardActions";
const initialState = {
  results: []
}
export const libraryScores = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIBRARY_SCORES:
      state = action.payload;
      break
    default:
      break
  }
  return state
}

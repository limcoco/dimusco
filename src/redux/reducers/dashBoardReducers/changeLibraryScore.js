import { CHANGE_LIBRARY_SCORE } from "../../actions/dashBoardActions";

export const changeLibraryScoreStatus = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_LIBRARY_SCORE:
      state = action.payload;
      break
    default:
      break
  }
  return state
}
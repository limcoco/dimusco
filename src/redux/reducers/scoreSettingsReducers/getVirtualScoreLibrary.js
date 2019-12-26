import { GET_VIRTUAL_LIBRARY_SCORES } from "../../actions/scoreSettingsActions";

export const virtualLibraryScores = (state = [], action) => {
  switch (action.type) {
    case GET_VIRTUAL_LIBRARY_SCORES:
      state = action.payload;
      break
    default:
      break
  }
  return state
}

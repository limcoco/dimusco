import { GET_UPLOAD_SCORES } from "../../actions/uploadScoresAction";

export const uploadScores = (state = [], action) => {
  switch (action.type) {
    case GET_UPLOAD_SCORES:
      state = action.payload;
      break
    default:
      break
  }
  return state
}

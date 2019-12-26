import { GET_SCORE_PAGES } from "../../actions/scoreSettingsActions";

export const scorePages = (state = [], action) => {
  switch (action.type) {
    case GET_SCORE_PAGES:
      state = [
        ...action.payload
      ]
      break
    default:
      break
  }
  return state
}

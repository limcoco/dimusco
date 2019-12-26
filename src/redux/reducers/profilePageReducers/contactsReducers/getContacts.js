import { GET_CONTACTS } from "../../../actionTypes";

export const contacts = (state = [], action) => {
  switch (action.type) {
    case GET_CONTACTS:
      console.log('action.payload', action.payload)
      state = action.payload;
      break
    default:
      break
  }
  return state
}

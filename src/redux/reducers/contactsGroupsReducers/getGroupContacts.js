import { GET_GROUP_CONTACTS } from "../../actionTypes";

export const groupContacts = (state = [], action) => {
  switch (action.type) {
    case GET_GROUP_CONTACTS:
      state = action.payload;
      break
    default:
      break
  }
  return state
}

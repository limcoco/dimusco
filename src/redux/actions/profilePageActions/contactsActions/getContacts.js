
import Request from "../../../../utils/Request";
import auth from '../../../account/authToken';

import {GET_CONTACTS} from '../../../actionTypes';

export const getContactsSuccess = payload => ({
    type: GET_CONTACTS,
    payload: payload
});
  

export const getContacts = (onSuccess, onFailure, data) => (dispatch) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
    }
   
    Request(
        "get",
        "account-contacts",
        headers,
        data,
        [],
        (response) => {
            console.log('contacts', response.data)
            response && response.data &&
                dispatch(getContactsSuccess(response.data.results || []))
                onSuccess && onSuccess(response.data)
        },
        onFailure,
    )
}
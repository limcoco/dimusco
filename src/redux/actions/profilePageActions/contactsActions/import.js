import Request from "../../../../utils/Request";
import auth from '../../../account/authToken';
import {
    IMPORT_CONTACTS_SUCCESS,
    IMPORT_CONTACTS_FAILURE
} from '../../../actionTypes';

export const importSuccess = payload => ({
    type: IMPORT_CONTACTS_SUCCESS,
    payload
});

export const importFailed = payload => ({
    type: IMPORT_CONTACTS_FAILURE,
    payload
});

export const importCsv = ({file, wipe}, onSuccess, onFailure) => (dispatch) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
        'Content-Type': 'multipart/form-data;'
    }

    const data = new FormData() 
    data.append('file', file)
    data.append('wipe', wipe)
    Request(
        "post",
        "contacts-import",
        headers,
        data,
        [],
        (response) => {
            dispatch(importSuccess(response));
            onSuccess && onSuccess()
        },
        (response) => {
            dispatch(importFailed(response));
            onFailure && onFailure()
        }
      )
}

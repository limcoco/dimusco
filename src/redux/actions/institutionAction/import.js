import Request from "../../../utils/Request";
import auth from '../../account/authToken';
import {
    IMPORT_SUCCESS,
    IMPORT_FAILURE
} from '../../actionTypes';

export const importSuccess = payload => ({
    type: IMPORT_SUCCESS,
    payload
});

export const importFailed = payload => ({
    type: IMPORT_FAILURE,
    payload
});

export const importCsv = (file, onSuccess, onFailure) => (dispatch) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
        'Content-Type': 'multipart/form-data;'
    }

    const data = new FormData() 
    data.append('file', file)

    Request(
        "post",
        "import",
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

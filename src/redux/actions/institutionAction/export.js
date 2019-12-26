import Request from "../../../utils/Request";
import auth from '../../account/authToken';
import {
    EXPORT_SUCCESS,
    EXPORT_FAILURE
} from '../../actionTypes';

export const exportSuccess = payload => ({
    type: EXPORT_SUCCESS,
    payload
});

export const exportFailed = payload => ({
    type: EXPORT_FAILURE,
    payload
});

export const exportCsv = (onSuccess, onFailure) => (dispatch) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
        'Content-Type': 'multipart/form-data;'
    }

    Request(
        "get",
        "export",
        headers,
        {},
        [],
        (response) => {
            dispatch(exportSuccess(response.data));
            onSuccess && onSuccess(response.data)
        },
        (response) => {
            dispatch(exportFailed(response));
            onFailure && onFailure()
        }
      )
}

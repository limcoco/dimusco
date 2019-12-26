import Request from "../../../utils/Request";
import auth from '../../account/authToken';

export const GET_UPLOAD_SCORES = Symbol("GET_UPLOAD_SCORES")

export const getUploadScores = (payload, onSuccess, onFailure) => (dispatch) => {
    let headers = {
        Authorization: "Token " + auth.getActiveToken(),
    }
   
      Request(
        "get",
        "read-score-upload",
        headers,
        payload,
        [],
        (response) => {
            response && response.data &&
                dispatch({
                    type: GET_UPLOAD_SCORES,
                    payload: response.data || []
                })
            onSuccess && onSuccess()
        },
        onFailure,
      )
}
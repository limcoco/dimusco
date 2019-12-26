
import Request from "../../../utils/Request";
import auth from '../../account/authToken';

export const GET_VIRTUAL_LIBRARY_SCORES = Symbol("GET_VIRTUAL_LIBRARY_SCORES")

export const getVirtualScoreLibrary = (payloads, onSuccess, onFailure) => (dispatch) => {
    let headers = {
        Authorization: "Token " + auth.getActiveToken(),
    }
   
    Request(
        'get',
        payloads.production ? 'production-virtual-score-library' : 'virtual-score-libraries',
        headers,
        payloads,
        [],
        (response) => {
            response && response.data &&
                dispatch({
                    type: GET_VIRTUAL_LIBRARY_SCORES,
                    payload: response.data.results || []
                })
            onSuccess && onSuccess()
        },
        onFailure,
        undefined,
        undefined
      );
}
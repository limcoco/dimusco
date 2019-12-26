import Request from "../../../utils/Request";
import auth from '../../account/authToken';

export const GET_SCORE_PAGES = Symbol("GET_SCORE_PAGES")

export const getScorePages = (onSuccess, onFailure, payload) => (dispatch) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
    }
    Request(
        'get',
        'related-scores',
        headers,
        payload,
        [],
        (response) => {
            response && response.data &&
                dispatch({
                    type: GET_SCORE_PAGES,
                    payload: response.data
                })
            onSuccess && onSuccess(response)
        },
        onFailure
    );
}
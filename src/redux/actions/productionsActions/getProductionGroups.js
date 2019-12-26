import Request from "../../../utils/Request";
import auth from '../../account/authToken';

export const GET_PRODUCTION_GROUPS_DETAILS = Symbol("GET_PRODUCTION_GROUPS_DETAILS")

export const getProductionGroups = (onSuccess, onFailure, prid) => (dispatch) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
    }
    Request(
        'get',
        'production-group-list',
        headers,
        {},
        [prid],
        (response) => {
            response && response.data &&
                dispatch({
                    type: GET_PRODUCTION_GROUPS_DETAILS,
                    payload: response.data
                })
            onSuccess && onSuccess(response)
        },
        onFailure
    );
}
import Request from "../../../utils/Request";
import auth from '../../account/authToken';

export const CREATE_PRODUCTION_GROUPS_DETAILS = Symbol("CREATE_PRODUCTION_GROUPS_DETAILS")

export const createProductionGroup = (onSuccess, onFailure, data) => (dispatch) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
    }
    Request(
        'post',
        'create-group',
        headers,
        data,
        [],
        (response) => {
            response && response.data &&
                dispatch({
                    type: CREATE_PRODUCTION_GROUPS_DETAILS,
                    payload: response.data
                })
            onSuccess && onSuccess(response)
        },
        onFailure
    );
}
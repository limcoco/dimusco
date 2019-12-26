
import Request from "../../../../utils/Request";
import auth from '../../../account/authToken';

export const GET_ORDERS_HISTORY = Symbol("GET_ORDERS_HISTORY")

export const getOrdersHistory = (data, onSuccess, onFailure) => (dispatch) => {
    const {start_date, end_date, active, ordering} = data;
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
    }

    Request(
        "get",
        "purchase-read",
        headers,
        {start_date, end_date, search: active, ordering},
        [],
        (response) => {
            response && response.data &&
                dispatch({
                    type: GET_ORDERS_HISTORY,
                    payload: response.data.results || []
                })
                onSuccess && onSuccess(response.data)
        },
        onFailure,
    )
}
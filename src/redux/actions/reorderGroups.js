import {
    REORDER_GROUP,
    REORDER_GROUP_FAILED,
} from '../actionTypes';
import Request from '../../utils/Request';
import auth from '../account/authToken';

export const reorderGroupSuccess = payload => ({
    type: REORDER_GROUP,
    payload
});

export const reorderGroupFailed = payload => ({
    type: REORDER_GROUP_FAILED,
    payload
});
  
export const reorderGroup = (pid, parent, onSuccess, onFailure) => dispatch => {
    Request(
      'patch',
      'update-group',
      { Authorization: "Token " + auth.getActiveToken()},
      {parent},
      [pid],
      response => {
        if (response && response.data) {
          dispatch(reorderGroupSuccess(response.data));
          onSuccess && onSuccess(response.data)
        }
      },
      response => {
        dispatch(reorderGroupFailed({message: response.message}));
        onFailure && onFailure()
      }
    );
}

export const reorderContactGroup = (pid, parent, onSuccess, onFailure) => dispatch => {
    Request(
      'patch',
      'update-contact-group',
      { Authorization: "Token " + auth.getActiveToken()},
      {parent},
      [pid],
      response => {
        if (response && response.data) {
          dispatch(reorderGroupSuccess(response.data));
          onSuccess && onSuccess(response.data)
        }
      },
      response => {
        dispatch(reorderGroupFailed({message: response.message}));
        onFailure && onFailure(response)
      }
    );
}
import {
    ADD_CONTACT_TO_GROUP,
    ADD_CONTACT_TO_GROUP_FAILED
} from '../../actionTypes';
import Request from '../../../utils/Request';
import auth from '../../account/authToken';

export const addContactToGroupSuccess = payload => ({
    type: ADD_CONTACT_TO_GROUP,
    payload
});

export const addContactToGroupFailed = payload => ({
    type: ADD_CONTACT_TO_GROUP_FAILED,
    payload
});
  
export const addContactToGroup = (data, onSuccess, onFailure) => (dispatch) => {
  Request(
      'post',
      'contact-group-members',
      { Authorization: 'Token ' + auth.getActiveToken() },
      data,
      [],
      response => {
        if (response && response.data) {
          dispatch(addContactToGroupSuccess(response.data));
          onSuccess && onSuccess(response.data);
        }
      },
      response => {
        dispatch(addContactToGroupFailed({message: response.message}));
        onFailure && onFailure(response)
      }
    );
}
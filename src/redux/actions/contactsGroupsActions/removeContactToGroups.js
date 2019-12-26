import {
    REMOVE_CONTACT_TO_GROUP,
    REMOVE_CONTACT_TO_GROUP_FAILED
} from '../../actionTypes';
import Request from '../../../utils/Request';
import auth from '../../account/authToken';

export const removeContactToGroupSuccess = payload => ({
    type: REMOVE_CONTACT_TO_GROUP,
    payload
});

export const removeContactToGroupFailed = payload => ({
    type: REMOVE_CONTACT_TO_GROUP_FAILED,
    payload
});
  
export const removeContactFromGroup = (data, onSuccess, onFailure) => (dispatch) => {
  Request(
      'patch',
      'contact-group-members',
      { Authorization: 'Token ' + auth.getActiveToken() },
      data,
      [],
      response => {
        if (response && response.data) {
          dispatch(removeContactToGroupSuccess(response.data));
          onSuccess && onSuccess(response.data);
        }
      },
      response => {
        dispatch(removeContactToGroupFailed({message: response.message}));
        onFailure && onFailure(response)
      }
    );
}
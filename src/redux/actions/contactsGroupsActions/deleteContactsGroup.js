import {
    DELETE_CONTACTS_GROUP,
    DELETE_CONTACTS_GROUP_FAILED
} from '../../actionTypes';
import Request from '../../../utils/Request';
import auth from '../../account/authToken';

export const deleteContactsGroupSuccess = payload => ({
    type: DELETE_CONTACTS_GROUP,
    payload
});

export const deleteContactsGroupFailed = payload => ({
    type: DELETE_CONTACTS_GROUP_FAILED,
    payload
});
  
export const deleteContactsGroup = (id, onSuccess, onFailed) => dispatch => {
    Request(
      'delete',
      'contacts-group',
      { Authorization: 'Token ' + auth.getActiveToken() },
      {},
      [id],
      response => {
          dispatch(deleteContactsGroupSuccess(response));
          onSuccess && onSuccess();
      },
      response => {
        dispatch(deleteContactsGroupFailed({message: response.message}));
        onFailed && onFailed(response)
      }
    );
}
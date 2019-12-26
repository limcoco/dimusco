import {
    CREATE_CONTACTS_GROUP,
    CREATE_CONTACTS_GROUP_FAILED
} from '../../actionTypes';
import Request from '../../../utils/Request';
import auth from '../../account/authToken';

export const createContactsGroupSuccess = payload => ({
    type: CREATE_CONTACTS_GROUP,
    payload
});

export const createContactsGroupFailed = payload => ({
    type: CREATE_CONTACTS_GROUP_FAILED,
    payload
});
  
export const createContactsGroup = (data, onSuccess, onFailure) => dispatch => {
    Request(
      'post',
      'contacts-groups',
      { Authorization: 'Token ' + auth.getActiveToken() },
      data,
      [],
      response => {
        if (response && response.data) {
          dispatch(createContactsGroupSuccess(response.data));
          onSuccess && onSuccess();
        }
      },
      response => {
        dispatch(createContactsGroupFailed({message: response.message}));
        onFailure && onFailure(response)
      }
    );
}
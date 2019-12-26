import {
    CONTACTS_GROUPS,
    CONTACTS_GROUPS_FAILED
} from '../../actionTypes';
import Request from '../../../utils/Request';
import auth from '../../account/authToken';

export const getContactsGroupsSuccess = payload => ({
    type: CONTACTS_GROUPS,
    payload
});

export const getContactsGroupsFailed = payload => ({
    type: CONTACTS_GROUPS_FAILED,
    payload
});
  

export const getContactsGroups = (onSuccess) => dispatch => {
    Request(
      'get',
      'contacts-groups',
      { Authorization: 'Token ' + auth.getActiveToken() },
      {},
      [],
      response => {
        if (response && response.data) {
          dispatch(getContactsGroupsSuccess(response.data));
          onSuccess && onSuccess(response.data)
        }
      },
      response => {
        dispatch(getContactsGroupsFailed({message: response.message}));
      }
    );
}
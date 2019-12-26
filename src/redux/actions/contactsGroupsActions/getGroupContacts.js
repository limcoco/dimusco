import {
    GET_GROUP_CONTACTS,
} from '../../actionTypes';
import Request from '../../../utils/Request';
import auth from '../../account/authToken';

export const getGroupContactsSuccess = payload => ({
    type: GET_GROUP_CONTACTS,
    payload
});

export const getGroupContacts = (id, data, onSuccess, onFialed) => dispatch => {
    Request(
      'get',
      'get-group-contacts',
      { Authorization: 'Token ' + auth.getActiveToken() },
      data,
      [id],
      response => {
        if (response && response.data) {
          dispatch(getGroupContactsSuccess(response.data.results || []));
          onSuccess && onSuccess(response.data)
        }
      },
      onFialed
    );
}
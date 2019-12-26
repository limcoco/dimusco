import {
    ASSIGN_GROUP,
    ASSIGN_GROUP_FAILED,
    PRODUCTIONS_GROUPS
} from '../../actionTypes';
import Request from '../../../utils/Request';
export const assignGroupSuccess = payload => ({
    type: ASSIGN_GROUP,
    payload
});

export const assignGroupFailed = payload => ({
    type: ASSIGN_GROUP_FAILED,
    payload
});
  
export const getProcutionGroupsSuccess = payload => ({
    type: PRODUCTIONS_GROUPS,
    payload
});

export const assignGroup = (payload, token) => dispatch => {
    Request(
      'post',
      'production-groups',
      { Authorization: 'Token ' + token },
      payload,
      [],
      response => {
        if (response && response.data) {
          dispatch(assignGroupSuccess(response.data));
          dispatch(getProcutionGroupsSuccess(response.data));
        }
      },
      response => {
        dispatch(assignGroupFailed({message: response.message}));
      }
    );
}
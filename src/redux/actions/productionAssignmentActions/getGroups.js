import {
    PRODUCTIONS_GROUPS,
    PRODUCTIONS_GROUPS_FAILED
} from '../../actionTypes';
import Request from '../../../utils/Request';
export const getProcutionGroupsSuccess = payload => ({
    type: PRODUCTIONS_GROUPS,
    payload
});

export const getProcutionGroupsFailed = payload => ({
    type: PRODUCTIONS_GROUPS_FAILED,
    payload
});
  
export const getProcutionGroups = (assignment, token) => dispatch => {
    Request(
      'get',
      'production-groups',
      { Authorization: 'Token ' + token },
      {assignment},
      [],
      response => {
        if (response && response.data) {
          dispatch(getProcutionGroupsSuccess(response.data));
        }
      },
      response => {
        dispatch(getProcutionGroupsFailed({message: response.message}));
      }
    );
}
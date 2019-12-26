import {
    UNASSIGN_GROUP,
    UNASSIGN_GROUP_FAILED,
    PRODUCTIONS_GROUPS
} from '../../actionTypes';
import Request from '../../../utils/Request';
export const unassignGroupSuccess = payload => ({
    type: UNASSIGN_GROUP,
    payload
});

export const unassignGroupFailed = payload => ({
    type: UNASSIGN_GROUP_FAILED,
    payload
});
  
export const getProcutionGroupsSuccess = payload => ({
    type: PRODUCTIONS_GROUPS,
    payload
});

export const unassignGroup = (assignment, token, groups, group_id) => dispatch => {
    Request(
      'patch',
      'production-unassign-groups',
      { Authorization: 'Token ' + token },
      {},
      [assignment],
      response => {
        if (response) {
          dispatch(unassignGroupSuccess(response));
          dispatch(getProcutionGroupsSuccess({assigned: groups.assigned.filter((item) => {
              return item.group_id !== group_id
          }), unassigned: [...groups.unassigned, ...groups.assigned.filter((item) => {
            return item.group_id === group_id
        })]}));
        }
      },
      response => {
        dispatch(unassignGroupFailed({message: response.message}));
      }
    );
}
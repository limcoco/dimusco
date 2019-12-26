import { RemoveEnsembleSession } from '../account/ensemble/presenter';
import { RemoveInstitutionSession } from '../account/institution/presenter';
import { RemovePublisherSession } from '../account/publisher/presenter';
import { RemoveUserSession } from '../account/session/presenter';
import { RemoveToken } from '../account/token/presenter';

import { removeCartAction } from '../actions/cart';

export const logout = () => dispatch => {
  dispatch(RemoveUserSession());
  dispatch(RemoveInstitutionSession());
  dispatch(RemoveEnsembleSession());
  dispatch(RemovePublisherSession());
  dispatch(RemoveToken());
  dispatch(removeCartAction());
  localStorage.removeItem('country');
  localStorage.removeItem('curr');
  localStorage.removeItem('textContent');
  localStorage.removeItem('items');
  localStorage.removeItem('items_package');
  localStorage.removeItem('production');
};

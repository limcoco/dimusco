import {
  getProductsStart,
  getProductsSuccess,
  getProductsFailed,
  getProductSuccess,
  changeActiveProduct as changeActiveProductAction,
  productHasContact,
  productHasContactFailed
} from '../actions/product';

import { RemoveUserSession } from '../account/session/presenter';
import { RemoveInstitutionSession } from '../account/institution/presenter.js';
import { RemoveToken } from '../account/token/presenter.js';
import { RemoveEnsembleSession } from '../account/ensemble/presenter.js';
import { UpdatedCurrency } from '../actions/ActiveCurrencyAction';

import Request from '../../utils/Request';

export const getProducts = data => dispatch => {
  dispatch(getProductsStart());
  Request(
    'get',
    'get-scores',
    {},
    data,
    [],
    response => {
      if (response && response.data) {
        dispatch(getProductsSuccess(response.data));
        dispatch(UpdatedCurrency(false));
      }
    },
    response => {
      dispatch(getProductsFailed(response.data));
    }
  );
};

export const getProduct = (url, data, token, success) => dispatch => {
  Request(
    'get',
    url,
    { Authorization: 'Token ' + token },
    data,
    [],
    response => {
      dispatch(getProductSuccess({ response: response.data, sid: data.q }));
      success && success(response.data)
    },
    response => {
      dispatch(getProductsFailed(response.data));
      dispatch(RemoveUserSession());
      dispatch(RemoveInstitutionSession());
      dispatch(RemoveEnsembleSession());
      dispatch(RemoveToken());
      localStorage.removeItem('production');
      // window.history.push('/');
    }
  );
};

export const changeActiveProduct = data => dispatch => {
  dispatch(changeActiveProductAction(data));
};


export const checkProductHasContact = (ssid, token, onSuccess) => dispatch => {
  Request(
    'get',
    'has-contract',
    { Authorization: 'Token ' + token },
    {ssid},
    [],
    response => {
      if (response && response.data) {
        dispatch(productHasContact(response.data));
        onSuccess && onSuccess(response.data)
      }
    },
    response => {
      dispatch(productHasContactFailed(response.data));
    }
  );
}
import {
  GET_PRODUCTS_START,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILED,
  GET_PRODUCT_SUCCESS,
  CHANGE_ACTIVE_PRODUCT,
  RESET_ACTIVE_PRODUCT,
  PRODUCT_HAS_CONTRACT,
  PRODUCT_HAS_CONTRACT_FAILED
} from '../actionTypes';

export const getProductsStart = () => ({
  type: GET_PRODUCTS_START
});

export const getProductsSuccess = payload => ({
  type: GET_PRODUCTS_SUCCESS,
  payload
});

export const getProductsFailed = payload => ({
  type: GET_PRODUCTS_FAILED,
  payload
});

export const getProductSuccess = payload => ({
  type: GET_PRODUCT_SUCCESS,
  payload
});

export const changeActiveProduct = payload => ({
  type: CHANGE_ACTIVE_PRODUCT,
  payload
});

export const resetActiveProduct = () => ({
  type: RESET_ACTIVE_PRODUCT
});

export const productHasContact = (payload) => ({
  type: PRODUCT_HAS_CONTRACT,
  payload
});

export const productHasContactFailed = () => ({
  type: PRODUCT_HAS_CONTRACT_FAILED
});



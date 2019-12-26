import {
  removeCartAction,
  addToCartErrorAction,
  addToUserCartAction,
  addToEnsembleCartAction,
  addToPublisherCartAction,
  getCartProductsStartAction,
  getCartProductsSuccessAction,
  getCartProductsFailedAction,
  removeFromUserCartAction,
  removeFromEnsembleCartAction,
  removeFromPublisherCartAction,
  clearUserCartAction,
  clearEnsembleCartAction,
  clearPublisherCartAction,
  clearInstitutionCartAction,
  addScoreToInstitutionCart,
  addPlayToInstitutionCart,
  getInstitutionCartProductsStartAction,
  getInstitutionCartProductsSuccessAction,
  getInstitutionCartProductsFailedAction,
  removePlayFromInstitutionCartAction,
  removeScoreFromInstitutionCartAction,
  removeFromInstitutionCartErrorAction,
  institutionPurchaseStart,
  institutionPurchaseSuccess,
  institutionPurchaseFailed
} from '../actions/cart';

import Request from '../../utils/Request';

export const emptyCart = () => dispatch => {
  dispatch(removeCartAction());
};

export const clearAllCartItems = type => dispatch => {
  switch (type) {
    case 'user':
      dispatch(clearUserCartAction());
      break;
    case 'ensemble':
      dispatch(clearEnsembleCartAction());
      break;
    case 'publisher':
      dispatch(clearPublisherCartAction());
      break;
    case 'institution':
      dispatch(clearInstitutionCartAction());
      break;
  }
};

export const removeCartItem = (sid, cart, type) => dispatch => {
  const newCart = cart.filter(item => item.sid != sid);

  switch (type) {
    case 'user':
      dispatch(removeFromUserCartAction({ newCart, sid }));
      break;
    case 'ensemble':
      dispatch(removeFromEnsembleCartAction({ newCart, sid }));
      break;
    case 'publisher':
      dispatch(removeFromPublisherCartAction({ newCart, sid }));
      break;
  }
};

export const addToCart = (type, newScore, prevCart, callbacks) => dispatch => {
  const found = prevCart.filter(item => item.sid === newScore.sid);
  if (found[0]) {
    // item already exists
    callbacks.onFailed('Item Already Exists');
    dispatch(addToCartErrorAction('Score already in the cart'));
    return;
  }
  let action;
  switch (type) {
    case 'user':
      action = addToUserCartAction;
      break;
    case 'ensemble':
      action = addToEnsembleCartAction;
      break;
    case 'publisher':
      action = addToPublisherCartAction;
      break;
    default:
      action = () => {};
  }
  if (callbacks.onSuccess) callbacks.onSuccess();
  dispatch(action(newScore));
};

export const getCartProducts = cart => dispatch => {
  dispatch(getCartProductsStartAction());

  const data = {
    scores: JSON.stringify(
      cart.map(item => ({
        sid: item.sid,
        start: item.start,
        is_lifetime: item.isLifeTime
      }))
    )
  };

  Request(
    'post',
    'get-cart-scores',
    {},
    data,
    [],
    response => {
      dispatch(getCartProductsSuccessAction(response.data));
    },
    response => {
      dispatch(getCartProductsFailedAction(response.data));
    }
  );
};

export const addToInstitutionCart = (
  newScore,
  type,
  instCart = {},
  callbacks = {}
) => dispatch => {
  let found = [];

  if (type === 'plays') {
    found = instCart.plays.filter(item => item.ssid == newScore.ssid);
  }

  if (found[0]) {
    dispatch(addToCartErrorAction('Score already in the cart'));
    if (callbacks.onFailed) callbacks.onFailed();
    return;
  }

  switch (type) {
    case 'scores':
      dispatch(addScoreToInstitutionCart(newScore));
      break;
    case 'plays':
      dispatch(addPlayToInstitutionCart(newScore));
      break;
  }
  if (callbacks.onSuccess) callbacks.onSuccess();
};

const InstCartRequest = (payload, token, onSuccess, onError) => {
  Request(
    'post',
    'get-cart-scores',
    { Authorization: 'Token ' + token },
    payload,
    [],
    response => {
      onSuccess(response.data);
    },
    response => {
      onError(response.data);
    }
  );
};

export const getInstitutionCartProducts = (data, token) => dispatch => {
  dispatch(getInstitutionCartProductsStartAction());
  const playsPayload = {
    scores: JSON.stringify(
      Array.from(new Set(data.plays.map(play => play.sid)))
    )
  };
  const scoresPayload = {
    scores: JSON.stringify(
      Array.from(new Set(data.scores.map(score => score.sid)))
    )
  };

  const onRequestError = err =>
    dispatch(getInstitutionCartProductsFailedAction(err));

  InstCartRequest(
    playsPayload,
    token,
    playsResponse => {
      InstCartRequest(
        scoresPayload,
        token,
        scoresResponse => {
          const instCartProducts = {
            scores: scoresResponse.scores,
            play: playsResponse.play
          };
          dispatch(getInstitutionCartProductsSuccessAction(instCartProducts));
        },
        onRequestError
      );
    },
    onRequestError
  );
};

export const removeFromInstitutionCart = (id, type, instCart) => dispatch => {
  try {
    let found;
    if (type === 'plays') {
      found = instCart.plays.filter(item => id === item.ssid);
    } else {
      found = instCart.scores.filter(item => id === item.sid);
    }
    if (found[0]) {
      if (type === 'scores') {
        dispatch(
          removeScoreFromInstitutionCartAction({
            id,
            arr: instCart.scores.filter(item => item.sid != id)
          })
        );
      } else if (type === 'plays') {
        dispatch(
          removePlayFromInstitutionCartAction({
            id,
            arr: instCart.plays.filter(item => item.ssid != id)
          })
        );
      }
    } else {
      throw new Error("Item Doesn't exist in the cart");
    }
  } catch (err) {
    dispatch(removeFromInstitutionCartErrorAction(err.message));
  }
};

export const institutionPurchase = (payload, token, cbs) => dispatch => {
  try {
    dispatch(institutionPurchaseStart());
    Request(
      'post',
      'institution-order',
      { Authorization: 'Token ' + token },
      payload,
      [],
      response => {
        if (cbs.onSuccess) cbs.onSuccess();
        dispatch(institutionPurchaseSuccess(response.data));
      },
      response => {
        if (cbs.onFailed) cbs.onFailed();
        if (response.data)
        throw new Error(response.data.message);
      }
    );
  } catch (err) {
    dispatch(institutionPurchaseFailed(err));
  }
};

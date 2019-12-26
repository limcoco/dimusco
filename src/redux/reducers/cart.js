import {
  ADD_TO_USER_CART,
  ADD_TO_ENSEMBLE_CART,
  ADD_TO_PUBLISHER_CART,
  ADD_TO_CART_ERROR,
  GET_CART_PRODUCTS,
  GET_CART_PRODUCTS_SUCCESS,
  GET_CART_PRODUCTS_FAILED,
  REMOVE_FROM_ENSEMBLE_CART,
  REMOVE_FROM_PUBLISHER_CART,
  REMOVE_FROM_USER_CART,
  SHOW_CHECKOUT_SCREEN,
  HIDE_CHECKOUT_SCREEN,
  CLEAR_USER_CART,
  CLEAR_ENSEMBLE_CART,
  CLEAR_PUBLISHER_CART,
  CLEAR_INSTITUTION_CART,
  ADD_SCORE_TO_INSTITUTION_CART,
  ADD_PLAY_TO_INSTITUTION_CART,
  GET_INSTITUTION_CART_PRODUCTS_START,
  GET_INSTITUTION_CART_PRODUCTS_SUCCESS,
  GET_INSTITUTION_CART_PRODUCTS_FAILED,
  REMOVE_SCORE_FROM_INSTITUTION_CART,
  REMOVE_PLAY_FROM_INSTITUTION_CART,
  INSTITUTION_PURCHASE_START,
  INSTITUTION_PURCHASE_SUCCESS,
  INSTITUTION_PURCHASE_FAILED,
  REMOVE_CART
} from '../actionTypes';

// every user mode have his own cart
const initialState = {
  // flag for async actions
  isLoading: false,
  // local carts!
  userCart: [],
  ensembleCart: [],
  publisherCart: [],
  // institution have two different carts
  institutionCart: {
    plays: [],
    scores: []
  },
  // general error for all carts
  error: null,
  // get full data of the products currently in the cart
  products: [],
  institutionProducts: [],
  daily: '',
  lifeTime: '',
  showCheckoutScreen: false,
  symbol: ''
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_TO_USER_CART:
      return {
        ...state,
        userCart: state.userCart.concat(payload),
        error: null
      };
    case ADD_TO_ENSEMBLE_CART:
      return {
        ...state,
        ensembleCart: state.ensembleCart.concat(payload),
        error: null
      };
    case ADD_TO_PUBLISHER_CART:
      return {
        ...state,
        publisherCart: state.publisherCart.concat(payload),
        error: null
      };

    case ADD_TO_CART_ERROR:
      return {
        ...state,
        error: payload
      };

    case GET_CART_PRODUCTS:
      return {
        ...state,
        isLoading: true
      };

    case GET_CART_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: payload.scores,
        showCheckoutScreen: true,
        symbol: payload.scores[0].price.symbol,
        lifeTime: payload.life_time,
        daily: payload.daily
      };

    case GET_CART_PRODUCTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: payload
      };

    case REMOVE_FROM_USER_CART:
      return {
        ...state,
        userCart: payload.newCart,
        products: state.products.filter(product => product.sid != payload.sid)
      };

    case REMOVE_FROM_ENSEMBLE_CART:
      return {
        ...state,
        ensembleCart: payload.newCart,
        products: state.products.filter(product => product.sid != payload.sid)
      };

    case REMOVE_FROM_PUBLISHER_CART:
      return {
        ...state,
        publisherCart: payload.newCart,
        products: state.products.filter(product => product.sid != payload.sid)
      };

    case SHOW_CHECKOUT_SCREEN:
      return {
        ...state,
        showCheckoutScreen: true
      };

    case HIDE_CHECKOUT_SCREEN:
      return {
        ...state,
        showCheckoutScreen: false
      };

    case CLEAR_USER_CART:
      return {
        ...state,
        userCart: [],
        products: []
      };

    case CLEAR_ENSEMBLE_CART:
      return {
        ...state,
        ensembleCart: [],
        products: []
      };

    case CLEAR_PUBLISHER_CART:
      return {
        ...state,
        publisherCart: [],
        products: []
      };

    case CLEAR_INSTITUTION_CART:
      return {
        ...state,
        institutionCart: {
          plays: [],
          scores: [],
          products: []
        }
      };

    case ADD_SCORE_TO_INSTITUTION_CART:
      return {
        ...state,
        institutionCart: {
          ...state.institutionCart,
          scores: state.institutionCart.scores.concat(payload)
        }
      };
    case ADD_PLAY_TO_INSTITUTION_CART:
      return {
        ...state,
        institutionCart: {
          ...state.institutionCart,
          plays: state.institutionCart.plays.concat(payload)
        }
      };

    case GET_INSTITUTION_CART_PRODUCTS_START:
      return {
        ...state,
        isLoading: true
      };

    case GET_INSTITUTION_CART_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        institutionProducts: payload
      };

    case GET_INSTITUTION_CART_PRODUCTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: payload
      };

    case REMOVE_SCORE_FROM_INSTITUTION_CART:
      return {
        ...state,
        institutionCart: {
          ...state.institutionCart,
          scores: payload.arr
        },
        institutionProducts: {
          ...state.institutionProducts,
          scores: state.institutionProducts.scores.filter(
            item => item.sid != payload.id
          )
        }
      };

    case REMOVE_PLAY_FROM_INSTITUTION_CART:
      return {
        ...state,
        institutionCart: {
          ...state.institutionCart,
          plays: payload.arr
        },
        institutionProducts: {
          ...state.institutionProducts,
          play: state.institutionProducts.play.filter(
            item => item.ssid != payload.id
          )
        }
      };

    case INSTITUTION_PURCHASE_START:
      return {
        ...state,
        isLoading: true
      };

    case INSTITUTION_PURCHASE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        institutionCart: {
          scores: [],
          plays: []
        },
        institutionProducts: []
      };

    case INSTITUTION_PURCHASE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: payload
      };

    case REMOVE_CART:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};

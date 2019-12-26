import {
    PRODUCT_HAS_CONTRACT,
    PRODUCT_HAS_CONTRACT_FAILED
} from '../actionTypes';
  
  const initialState = {
    hasContract: {},
    isError: false,
    success: false
  };
  
  export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
      case PRODUCT_HAS_CONTRACT:
        return {
          ...state,
            hasContract: payload,
            success: true
        };
  
      case PRODUCT_HAS_CONTRACT_FAILED:
        return {
          ...state,
          isError: true
        };
  
      default:
        return state;
    }
  };
  
import { connect } from 'react-redux';

import Product from './Product';

import {
  getProduct,
  changeActiveProduct,
  addToCart,
  checkProductHasContact
} from '../../../redux/actionCreators';

import { resetActiveProduct } from '../../../redux/actions/product';

const mapStateToProps = state => {
  return {
    InstitutionReducer: state.InstitutionReducer,
    EnsembleReducer: state.EnsembleReducer,
    PublisherReducer: state.PublisherReducer,
    SessionReducer: state.SessionReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer,
    TokenReducer: state.TokenReducer,
    isLoading: state.Product.loading,
    product: state.Product.activeProduct[0],
    similarProducts: state.Product.similarProducts,
    count: state.Product.similarCount,
    cart: state.cart,
    hasContact: state.productHasContactRedcuer
  };
};

const mapDispatchToProps = {
  getProduct,
  changeActiveProduct,
  addToCart,
  resetActiveProduct,
  checkProductHasContact
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product);

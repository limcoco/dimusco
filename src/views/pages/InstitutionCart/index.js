import { connect } from 'react-redux';

import InstitutionCart from './InstitutionCart';
import { getAddresses } from '../../../redux/actions/profilePageActions/addressesActions'

import {
  getInstitutionCartProducts,
  removeFromInstitutionCart,
  institutionPurchase
} from '../../../redux/actionCreators';

const mapStateToProps = state => {
  return {
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    TokenReducer: state.TokenReducer,
    cart: state.cart,
    address: state.addressesStatus.filter((item) => {
      return item.type === 1 && item.default;
    })[0] || {},
    addresses: state.addressesStatus
  };
};

const mapDispatchToProps = {
  getCartProducts: getInstitutionCartProducts,
  removeFromCart: removeFromInstitutionCart,
  institutionPurchase,
  getAddresses
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstitutionCart);

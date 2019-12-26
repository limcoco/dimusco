import classnames from 'classnames';
import React from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ClearAllSession from '../ClearAllSession';
import Cart from './Cart';
import ContentMenu from './ContentMenu';
import Locale from './Locale';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import ProductionMenu from './ProductionMenu';

import { logout, clearSearchQuery } from '../../../redux/actionCreators';
import { getUserDetails } from '../../../redux/actions/profilePageActions';

import './css/index.css';
import {
  RemoveEnsembleSession,
  StopEnsembleSession
} from '../../../redux/account/ensemble/presenter';
import {
  RemoveInstitutionSession,
  StopInstitutionSession
} from '../../../redux/account/institution/presenter';
import {
  RemovePublisherSession,
  StopPublisherSession
} from '../../../redux/account/publisher/presenter';
import { bindActionCreators } from 'redux';

class Header extends React.Component {
  state = {
    openMenu: true,
    searchBox: false,
    isLogin: true,
    toggleSnackbarUser: false,

    // As institution
    isLoginAsInstitution: false,
    isLoginAsPublisher: false,
    isLoginAsEnsemble: false
  };

  

  onLogout = () => {
    const { logout, history } = this.props;
    this.stopAsActing(() => {
      logout();
      history.push('/');
    });
  };

  toggleOpenMenu = () => {
    this.setState({
      openMenu: !this.state.openMenu,
      searchBox: false
    });
  };

  toggleSearchBox = () => {
    this.setState({ searchBox: !this.state.searchBox });
  };

  toggleSnackbarUser = (value = null) => {
    if (value !== null) {
      this.setState({ toggleSnackbarUser: value });
    }
  };

  delete = () => {
    localStorage.removeItem('items');
    localStorage.removeItem('items_package');

    this.props.updateCartCount(0);
  };

  componentWillReceiveProps(nextProps) {
    // Check login & login as insitution
    this.setState({
      isLogin: nextProps.SessionReducer.is_auth,
      isLoginAsInstitution: nextProps.InstitutionReducer.is_auth,
      isLoginAsPublisher: nextProps.PublisherReducer.is_auth,
      isLoginAsEnsemble: nextProps.EnsembleReducer.is_auth
    });
  }

  componentDidMount() {
    this.setState({
      isLogin: this.props.SessionReducer.is_auth,
      isLoginAsInstitution: this.props.InstitutionReducer.is_auth,
      isLoginAsPublisher: this.props.PublisherReducer.is_auth,
      isLoginAsEnsemble: this.props.EnsembleReducer.is_auth
    });

    let oldItems;
    if (this.props.InstitutionReducer.is_auth) {
      oldItems = JSON.parse(localStorage.getItem('items_package')) || [];
    } else {
      oldItems = JSON.parse(localStorage.getItem('items')) || [];
    }

    // Update counter cart
    this.props.updateCartCount(oldItems.length);
    this.props.getUserDetails();
  }

  handleLogoClick = () => {
    const { history, clearSearchQuery } = this.props;
    clearSearchQuery();
    history.push('/');
  };


  stopAsActing = (cb) => {
    const {props} = this;
    // Stop from institution
    props.StopInstitutionSession();
    props.RemoveInstitutionSession();
  
    // Stop from publsiher
    props.StopPublisherSession();
    props.RemovePublisherSession();
  
    // Stop from ensemble
    props.StopEnsembleSession();
    props.RemoveEnsembleSession();
    props.getUserDetails()
    localStorage.removeItem('production');
    cb();
  };

  render() {
    const {
      props: {
        ActiveLanguageReducer,
        history,
        match,
        countCart,
        previewMode,
        SessionReducer,
        InstitutionReducer,
        PublisherReducer,
        EnsembleReducer
      },
      state: { openMenu, isLogin, searchBox },
      onLogout,
      handleLogoClick
    } = this;
    const { words } = ActiveLanguageReducer;

    const auth = {
      isLogin: SessionReducer.is_auth,
      isLoginAsInstitution: InstitutionReducer.is_auth,
      isLoginAsPublisher: PublisherReducer.is_auth,
      isLoginAsEnsemble: EnsembleReducer.is_auth
    };

    let link_cart = '/cart';

    if (auth.isLoginAsInstitution) {
      link_cart = '/inst-cart';
    }
    return (
      <div className={classnames('', { 'visible-on': previewMode })}>
        <ClearAllSession />
        <header className={openMenu ? '' : 'big'}>
          <div className="container">
            <div className="content">
              <div className="user-wrp">
                {isLogin && (
                  <div className="left-side">
                    <ContentMenu
                      auth={auth}
                      words={words}
                      onLogout={onLogout}
                    />
                  </div>
                )}
                <div className="info-right-space">
                  <UserMenu auth={auth} words={words} onLogout={onLogout} />
                </div>
                <div className="info-right-space" style={{marginLeft: '30px'}}>
                  <ProductionMenu auth={auth} words={words} />
                </div>
              </div>
              <div className="logo-box logo-dimusco">
                <div onClick={handleLogoClick} className="logo" role="button">
                  dimusco
                </div>
              </div>
              <div className="right-side">
                <Cart
                  linkCart={link_cart}
                  cartCount={countCart}
                  previewMode={previewMode}
                />
                <Locale {...this.props} />
              </div>
            </div>
          </div>
        </header>
        <SearchBox history={history} match={match} searchBox={searchBox} />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    TokenReducer: state.TokenReducer,
    InstitutionReducer: state.InstitutionReducer,
    PublisherReducer: state.PublisherReducer,
    EnsembleReducer: state.EnsembleReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer,
    SearchReducer: state.SearchReducer,
    TrialReducer: state.TrialReducer,
    LanguageReducer: state.LanguageReducer,
    cartCount: state.CartReducer.count,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      logout,
      clearSearchQuery,
      getUserDetails,
      StopInstitutionSession,
      RemoveInstitutionSession,
      StopPublisherSession,
      RemovePublisherSession,
      StopEnsembleSession,
      RemoveEnsembleSession
    },
    dispatch
  )
})

Header.propTypes = {
  ActiveLanguageReducer: PropTypes.shape({
    words: PropTypes.object.isRequired
  }),
  history: PropTypes.object.isRequired,
  countCart: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
  previewMode: PropTypes.bool.isRequired,
  SessionReducer:  PropTypes.shape({
    is_auth: PropTypes.bool.isRequired
  }),
  InstitutionReducer:  PropTypes.shape({
    is_auth: PropTypes.bool.isRequired
  }),
  PublisherReducer:  PropTypes.shape({
    is_auth: PropTypes.bool.isRequired
  }),
  EnsembleReducer:  PropTypes.shape({
    is_auth: PropTypes.bool.isRequired
  }),
  getUserDetails: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  clearSearchQuery: PropTypes.func.isRequired,
  StopInstitutionSession: PropTypes.func.isRequired,
  RemoveInstitutionSession: PropTypes.func.isRequired,
  StopPublisherSession: PropTypes.func.isRequired,
  RemovePublisherSession: PropTypes.func.isRequired,
  StopEnsembleSession: PropTypes.func.isRequired,
  RemoveEnsembleSession: PropTypes.func.isRequired,
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
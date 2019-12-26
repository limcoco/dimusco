import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, BrowserRouter as Router } from 'react-router-dom';
import { Route, Redirect } from 'react-router';
import Request from './utils/Request.js';
import { saveLanguage } from './redux/actions/ActiveLanguageAction.js';
import { languageLoaded } from './redux/actions/LanguageAction.js';
import { setTrial, removeTrial } from './redux/actions/TrialAction.js';

// Component
import Header from './views/component/Header/index.js';
// import Footer from "./views/component/footer.js"
import NewFooter from './views/component/NewFooter.js';
// import SearchHeader from "./views/component/search_header.js"

// User
import LoginScreen from './views/pages/user/login.js';
import RegisterInvitationScreen from './views/pages/user/register_invitation.js';
import RecoveryPasswordScreen from './views/pages/user/recovery_password.js';
import VerificationScreen from './views/pages/user/verification.js';
import ProfileScreen from './views/pages/ProfilePage';
import BookScreen from './views/pages/dashboard';

import HomeScreen from './views/pages/home';
import CatalogScreen from './views/pages/Catalog';
import CartScreen from './views/pages/product/Cart';
import ProductScreen from './views/pages/ProductPage';
import InstitutionLibrary from './views/pages/InstitutionLibrary';

// Institution
import CreateInstitutionScreen from './views/pages/institution/CreateInstitution';
import ManageInstitutionScreen from './views/pages/institution/manage_institution.js';
import InstitutionScreen from './views/pages/institution';
import CreateContract from './views/pages/CreateContract';

// Ensemble
import CreateEnsembleScreen from './views/pages/ensemble/create_institution.js';
import ManageEnsembleScreen from './views/pages/ensemble/manage_institution.js';
import EnsembleScreen from './views/pages/ensemble/institution.js';

// Publisher
import ManagePublisherScreen from './views/pages/publisher/manage_publisher.js';
import CreatePublisherScreen from './views/pages/publisher/CreatePublisher';
import PublisherScreen from './views/pages/publisher';
import SetPriceScreen from './views/pages/SetPrice';
import SetDiscountScreen from './views/pages/SetDiscount';
import PubLibraryScreen from './views/pages/PublisherLibrary';
import ScoreUploadScreen from './views/pages/ScoreUpload';
import UploadScreen from './views/component/Upload.js';

// Institution/Publisher
import Relations from './views/pages/Relations';

// Group
import CreateGroupScreen from './views/pages/group/create_group.js';

// Layes
import LayersScreen from './views/pages/layer';

// Order page only for institution
// import InstitutionCartScreen from './views/pages/product/institution_cart.js';
import InstitutionCartScreen from './views/pages/InstitutionCart';

//Institution Form
import InstitutionFormScreen from './views/pages/InstitutionForm'

// Payments
// ***** Paypal
import PaypalScreen from './views/pages/payments/paypal.js';
// ***** Card
import PaymentMethodScreen from './views/pages/payments/payment_method.js';
import AddPaymentMethodScreen from './views/pages/payments/add_payment_method.js';

// Deposit
import DepositScreen from './views/pages/payments/deposit/deposit.js';

// Trial
import TrialScreen from './views/pages/trial/';

import InvitationsScreen from './views/pages/Invitations';

import Page404Screen from './views/pages/error/404.js';
import ContactManagement from './views/pages/ContactManagement';
import AddContact from './views/pages/AddContact';
import ImportLog from './views/pages/ImportLog';
import Productions from './views/pages/Productions';
import CreateProduction from './views/pages/CreateProduction';
import ProductionGroup from './views/pages/ProductionGroup';
import ProductSettings from './views/pages/ProductSettings';
import RearrangeScorePages from './views/pages/RearrangeScorePages';
import ProductionScores from './views/pages/ProductionScores';
import ProducrtionAssignment from './views/pages/ProducrtionAssignment';
import ProductionLayer from './views/pages/ProductionLayer';
import Help from './views/pages/Help';
import Privacy from './views/pages/Privacy';
import Imprint from './views/pages/Imprint'
import Contact from './views/pages/Contact'
import Tickets from './views/pages/Tickets'
import ProductPageCopy from './views/pages/ProductPageCopy';
import ScoreOptions from './views/pages/ScoreOptions';
import Authorities from './views/pages/Authorities';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewMode: false
    };

    this.isLoadingContent = true;
    this.countCart = 0;

    this.updateCartCount = this.updateCartCount.bind(this);
    this.togglePreviewMode = this.togglePreviewMode.bind(this);
    this.updateIsLoadingContent = this.updateIsLoadingContent.bind(this);
    this.onReadLangSuccess = this.onReadLangSuccess.bind(this);
    this.onReadLangFailed = this.onReadLangFailed.bind(this);

    this.onGetLanguageSuccess = this.onGetLanguageSuccess.bind(this);
    this.onGetLanguageFailed = this.onGetLanguageFailed.bind(this);

    this.onSuccessTrial = this.onSuccessTrial.bind(this);
  }

  componentDidMount() {
    this.preparingRequest(this.props.ActiveLanguageReducer.lang);
  }

  updateCartCount(count, addToCart = false) {
    this.countCart = count;
    if (addToCart) {
      this.isLoadingContent = false;
    }
    this.forceUpdate();
  }

  togglePreviewMode() {
    this.setState({
      previewMode: !this.state.previewMode
    });
  }

  // not reload after buy item but data still update
  updateIsLoadingContent() {
    this.isLoadingContent = true;
  }

  preparingRequest(id_lang) {
    const { lang } = this.props.ActiveLanguageReducer;
    let tmp_lang;

    if (typeof id_lang === 'undefined') {
      tmp_lang = lang;
    } else {
      tmp_lang = id_lang;
    }

    Request(
      'get',
      'language-read',
      {},
      { language: tmp_lang },
      [],
      this.onReadLangSuccess,
      this.onReadLangFailed
    );
  }

  onReadLangSuccess(response) {
    const { ActiveLanguageReducer, LanguageReducer: {data: {languages}} } = this.props;
    const langauge = response.data.length > 0 ? response.data[0].language : ActiveLanguageReducer.lang
    let words = {};
    let loaded = true;
    if (response.data.length > 0) {
      for (let i = 0; i < response.data.length; i++) {
        words[response.data[i].key] = response.data[i].text;
      }
    } else {
      loaded = false;
    }
    const data = languages.find((item) => {
      return item.code === langauge;
    })
    this.props.RunRedux(saveLanguage({words, ...data}));
  }

  onReadLangFailed(error) {
    let confirm = window.confirm(
      'Failed load configuration language, please refresh page!'
    );
    if (confirm) {
      window.location.reload();
    }
  }

  onSuccessTrial(response) {
    this.props.RunRedux(setTrial(response.data));
    this.forceUpdate();
  }

  getLanguageList() {
    Request(
      'get',
      'language-list',
      {},
      {},
      [],
      this.onGetLanguageSuccess,
      this.onGetLanguageFailed
    );
  }

  onGetLanguageSuccess(response) {
    this.props.RunRedux(languageLoaded(response.data));
    this.forceUpdate();
  }

  onGetLanguageFailed(error) {}

  render() {
    const {
      ActiveLanguageReducer,
      ActiveCurrencyReducer,
      TrialReducer,
      LanguageReducer
    } = this.props;

    if (!LanguageReducer.loaded) {
      this.getLanguageList();
    }

    // TRIAL
    if (TrialReducer.hasOwnProperty('trial')) {
      if (Object.keys(TrialReducer.trial).length === 0) {
        return <TrialScreen onSuccessTrial={this.onSuccessTrial} />;
      }
    }

    if (
      ActiveLanguageReducer.lang !== ActiveLanguageReducer.saved ||
      !ActiveLanguageReducer.loaded
    ) {
      this.preparingRequest(ActiveLanguageReducer.lang);
    }
    
    if (!ActiveLanguageReducer.loaded) {
      return (
        <div />
      );
    } else {
      return (
        <Router>
          <div>
            <Header {...this} previewMode={this.state.previewMode} />
            <main>
              <Switch>
                <Redirect exact from="/" to="/home" />
                <Route
                  path="/home"
                  render={props => <HomeScreen {...props} {...this} />}
                />
                <Route path="/login" name="Login" component={LoginScreen} />
                <Route
                  path="/recovery-password/:uid"
                  name="RecoveryPassword"
                  component={RecoveryPasswordScreen}
                />
                <Route
                  path="/account/signup/:uid"
                  name="RegisterInvitation"
                  component={RegisterInvitationScreen}
                />
                <Route
                  path="/account/verification/:token"
                  name="Verification"
                  component={VerificationScreen}
                />
                <Route
                  path="/profile"
                  name="Profile"
                  component={ProfileScreen}
                />

                <Route
                  path="/help"
                  name="Help"
                  component={Help}
                />

                <Route
                  path="/imprint"
                  name="Imprint"
                  component={Imprint}
                />

                <Route
                  path="/contact"
                  name="Contact"
                  component={Contact}
                />

                <Route
                  path="/privacy"
                  name="Help"
                  component={Privacy}
                />
                
                <Route path="/library" name="Book" component={BookScreen} />
                <Route
                  path="/upload-score"
                  name="Upload"
                  component={UploadScreen}
                />
                {/* product */}
                <Route
                  path="/catalog"
                  render={props => <CatalogScreen {...props} {...this} />}
                />
                <Route
                  path="/cart"
                  render={props => (
                    <CartScreen
                      {...props}
                      {...this}
                      updateCartCount={this.updateCartCount}
                    />
                  )}
                />
                <Route
                  path="/pub-prices"
                  name="SetPrice"
                  component={SetPriceScreen}
                />
                <Route
                  path="/score-options"
                  name="ScoreOptions"
                  component={ScoreOptions}
                />
                <Route
                  path="/pub-discount"
                  name="SetDiscount"
                  component={SetDiscountScreen}
                />
                <Route
                  path="/pub-library"
                  name="PubLibrary"
                  component={PubLibraryScreen}
                />
                <Route
                  path="/upload"
                  name="ScoreUpload"
                  component={ScoreUploadScreen}
                />
                <Route
                  path="/product/:sid"
                  exact
                  render={props => (
                    <ProductScreen
                      {...props}
                      previewMode={this.state.previewMode}
                      togglePreviewMode={this.togglePreviewMode}
                      updateCartCount={this.updateCartCount}
                      ActiveLanguageReducer={this.props.ActiveLanguageReducer}
                    />
                  )}
                />

                <Route
                  path="/product/copy/:sid"
                  exact
                  render={props => (
                    <ProductPageCopy
                      {...props}
                      previewMode={this.state.previewMode}
                      togglePreviewMode={this.togglePreviewMode}
                      ActiveLanguageReducer={this.props.ActiveLanguageReducer}
                    />
                  )}
                />

                <Route
                  path="/mod_page/:id/"
                  name="ProductSettings"
                  component={ProductSettings}
                />

                <Route
                  path="/pages/rearrange/:id"
                  name="Productions"
                  component={RearrangeScorePages}
                />

                {/* Group */}
                <Route
                  path="/inst-create"
                  name="CreateInstitution"
                  component={CreateInstitutionScreen}
                />

                <Route
                  path="/create-production"
                  name="CreateProduction"
                  component={CreateProduction}
                />

                <Route
                  path="/productions"
                  name="Productions"
                  component={Productions}
                />

                <Route
                  path="/inst-list"
                  name="ManageInstitution"
                  component={ManageInstitutionScreen}
                />
                <Route
                  exact
                  path="/inst-groups"
                  name="Institution"
                  component={InstitutionScreen}
                />

                <Route
                  exact
                  path="/production/:prid/groups"
                  name="ProductionGroups"
                  component={ProductionGroup}
                />

                <Route
                  exact
                  path="/production/:prid/library"
                  name="ProductionGroups"
                  component={ProductionScores}
                />

                <Route
                  exact
                  path="/production/:prid/assignment"
                  name="ProductionGroups"
                  component={ProducrtionAssignment}
                />

                <Route
                  exact
                  path="/production/:prid/layer"
                  name="ProductionGroups"
                  component={ProductionLayer}
                />

                <Route
                  path="/institution/:iid"
                  name="ManageInstitution"
                  component={ManageInstitutionScreen}
                />
                {/* Group */}
                <Route
                  path="/create-group"
                  name="CreateGroup"
                  component={CreateGroupScreen}
                />
                <Route
                  path="/assignment"
                  name="ItemPurchased"
                  component={InstitutionLibrary}
                />
                {/* Ensemble */}
                <Route
                  path="/ens-create"
                  name="CreateEnsemble"
                  component={CreateEnsembleScreen}
                />
                <Route
                  path="/ens-list"
                  name="ManageEnsemble"
                  component={ManageEnsembleScreen}
                />

                <Route
                  path="/contacts-info"
                  name="Tickets"
                  component={Tickets}
                />

                <Route
                    path='/contacts'
                    render={(props) => (
                        <ContactManagement
                            {...props}
                        />
                    )}
                />
                <Route
                    path='/addContact'
                    render={(props) => (
                        <AddContact
                            {...props}
                        />
                    )}
                    exact
                />
                 <Route
                      path='/addContact/:id'
                      render={(props) => (
                          <AddContact
                              {...props}
                          />
                      )}
                  />

                <Route
                      path='/import-upload-log'
                      render={(props) => (
                          <ImportLog
                              {...props}
                          />
                      )}
                  />

                <Route
                  exact
                  path="/ensemble"
                  name="Ensemble"
                  component={EnsembleScreen}
                />
                {/* Publisher */}
                <Route
                  path="/pub-list"
                  name="ManagePublisher"
                  component={ManagePublisherScreen}
                />
                <Route
                  path="/invitation"
                  name="Invitations"
                  render={props => (
                    <InvitationsScreen
                      {...props}
                      ActiveLanguageReducer={this.props.ActiveLanguageReducer}
                    />
                  )}
                />
                <Route
                  path="/pub-create"
                  name="CreatePublisher"
                  component={CreatePublisherScreen}
                />
                <Route
                  exact
                  path="/pub-groups"
                  name="Publisher"
                  component={PublisherScreen}
                />
                {/* Institution/Publisher */}
                <Route
                  path="/relations"
                  name="Relations"
                  component={Relations}
                />
                <Route
                  path="/create-contract"
                  name="Create Contract"
                  component={CreateContract}
                />
                {/*<Route path="/institution/:iid" name="ManageInstitution" component={ManageInstitutionScreen}/> */}
                {/* Layer */}
                <Route path="/layers" name="Layers" component={LayersScreen} />
                {/* Order */}
                {/* <Route
                  path="/inst-cart"
                  render={props => (
                    <InstitutionCartScreen {...props} {...this} />
                  )}
                /> */}
                //{' '}
                <Route
                  path="/inst-cart"
                  name="InstitutionCart"
                  component={InstitutionCartScreen}
                />
                <Route
                  path="/inst-form"
                  name="InstitutionForm"
                  component={InstitutionFormScreen}
                />
                {/* Payments */}
                <Route path="/paypal" name="Paypal" component={PaypalScreen} />
                <Route
                  path="/payment-method"
                  name="PaymentMethod"
                  component={PaymentMethodScreen}
                />
                <Route
                  path="/add-payment-method"
                  name="AddPaymentMethod"
                  component={AddPaymentMethodScreen}
                />
                {/* Deposite */}
                <Route
                  path="/deposit"
                  name="Deposit"
                  component={DepositScreen}
                />

                 <Route
                  path="/authorities"
                  name="Authorities"
                  component={Authorities}
                />
                
                {/* Error Page */}
                <Route path="*" name="Page404" component={Page404Screen} />
              </Switch>
            </main>
            {/*            <Footer
              previewMode = {this.state.previewMode}
              ActiveLanguageReducer = {this.props.ActiveLanguageReducer}
            />*/}
            <NewFooter
              previewMode={this.state.previewMode}
              ActiveLanguageReducer={this.props.ActiveLanguageReducer}
            />
          </div>
        </Router>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer,
    ActiveLocationReducer: state.ActiveLocationReducer,
    TrialReducer: state.TrialReducer,
    LanguageReducer: state.LanguageReducer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    RunRedux: data => {
      dispatch(data);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

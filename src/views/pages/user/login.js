import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Presenter from '../../../user/presenter.js';
import Request from '../../../user/utils/request.js';

import checkSession from '../../../utils/check_session.js';

/* Session */
import { CreateUserSession } from '../../../redux/account/session/presenter.js';
import { WriteToken } from '../../../redux/account/token/presenter.js';

import { changeLanguage } from '../../../redux/actions/ActiveLanguageAction.js';
import { changeCurrency } from '../../../redux/actions/ActiveCurrencyAction.js';
import { changeLocation } from '../../../redux/actions/ActiveLocationAction.js';

/* Validate */
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { required, email } from '../../../utils/validate.js';

/* Component */
import {
  ButtonLoading,
  ButtonValidation
} from '../../component/Button/Button.js';

/* Info Modal */
import { InfoModal, ForgotPasswordModal } from '../../component/Modal';

import { removeCartAction } from '../../../redux/actions/cart';
import { getUserDetails } from "../../../redux/actions/profilePageActions"
import { bindActionCreators } from 'redux';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.loggedIn = checkSession.isLoggedIn(
      props.history,
      props.SessionReducer.is_auth
    );
    if (this.loggedIn) {
      this.props.history.push('/home');
    }

    this.state = {
      activeForgot: false,
      email: '',
      password: '',
      isLoadingLogin: false,
      isLoadingRegister: false,
      isLoadingReset: false,
      isDisableLogin: false,
      registerFullname: '',
      registerUsername: '',
      registerPassword: '',
      language: this.props.ActiveLanguageReducer.lang,
      country: this.props.ActiveLocationReducer.countryCode,
      currency: this.props.ActiveCurrencyReducer.code,
      recoveryEmail: '',
      activeVerify: false,
      showModal: false,
      forgotMessage: ''
    };

    // Login
    this.onLogin = this.onLogin.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);

    // Register
    this.onRegister = this.onRegister.bind(this);
    this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
    this.onRegisterFailed = this.onRegisterFailed.bind(this);

    // Request reset password
    this.onRequestEmail = this.onRequestEmail.bind(this);
    this.onRequestEmailSuccess = this.onRequestEmailSuccess.bind(this);
    this.onRequestEmailFailed = this.onRequestEmailFailed.bind(this);

    // Toggling Modal for info messages
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleVerify = this.toggleVerify.bind(this);
  }

  toggleModal(infoMsg, removeHeader) {
    const { showModal } = this.state;
    if (typeof infoMsg !== 'object')
      this.setState({ showModal: !showModal, infoMsg, heading: !removeHeader && 'Login/Register' });
    else this.setState({ showModal: !showModal });
  }

  toggleForgot() {
    this.setState({
      activeForgot: !this.state.activeForgot,
      forgotMessage: ''
    });
  }

  toggleVerify(infoMsg) {
    const { activeVerify } = this.state;
    if (typeof infoMsg !== 'object') {
      this.setState({ activeVerify: !activeVerify, infoMsg });
    } else {
      this.setState({ activeVerify: !activeVerify });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      if (this.state.password.trim() !== '') {
        this.onLogin();
      }
    }
  }

  handleKeyPressRegister(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      if (this.state.registerPassword.trim() !== '') {
        this.onRegister();
      }
    }
  }

  handleKeyPressRecovery(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      if (this.state.recoveryEmail.trim() !== '') {
        this.onRequestEmail();
      }
    }
  }

  removeApiError = () => {
    this.form.hideError(this.userInput);
  };

  onLogin() {
    Presenter.Login(Request.Login(this, this.onSuccess, this.onFailed));
    this.setState({ isLoadingLogin: true });
  }
  onSuccess(params, response) {
    if (
      localStorage.getItem('redirect') !== undefined &&
      localStorage.getItem('redirect') !== null &&
      localStorage.getItem('redirect') !== ''
    ) {
      this.props.history.push(localStorage.getItem('redirect'));
      localStorage.removeItem('redirect');
    } else {
      this.props.history.push('/home');
    }

    // Create user session & token after login success
    this.props.RunRedux(CreateUserSession(response.data.user));
    this.props.RunRedux(WriteToken(response.data.token));

    let { languages } = this.props.LanguageReducer.data;
    var languageData = languages.filter(
      language => language.code == response.data.user.language
    )[0];
    this.props.RunRedux(changeLanguage(languageData));

    let { currencies } = this.props.LanguageReducer.data;
    var currencyData = currencies.filter(
      currency => currency.code == response.data.user.currency
    )[0];
    this.props.RunRedux(changeCurrency(currencyData));
    this.props.RunRedux(changeLocation(response.data.user.country));
    this.props.RunRedux(removeCartAction());
    this.props.getUserDetails(undefined, undefined, response.data.user.name)

    localStorage.setItem('username', this.state.email);
  }

  onFailed(error) {
    // error detail
    try {
      if (error.response.data.hasOwnProperty('detail')) {
        this.toggleModal(error.response.data.detail);
      } else if (error.response.data.hasOwnProperty('non_field_errors')) {
        this.toggleModal(error.response.data.non_field_errors[0]);
      } else {
        this.toggleModal('Something wrong');
      }
    } catch (error) {}

    this.setState({ isLoadingLogin: false });
  }

  onGrab(str) {
    let tmpName = str.substr(0, str.indexOf('@'));
    let newName = null;

    if (tmpName.length >= 16) {
      newName = tmpName.substr(0, 16);
    } else {
      newName = tmpName;
    }
    this.setState({
      registerFullname: newName
    });
  }

  /* On Register */
  onRegister() {
    this.setState({
      isLoadingRegister: true
    });
    Presenter.Register(
      Request.Register(this, this.onRegisterSuccess, this.onRegisterFailed)
    );
    this.props.RunRedux(removeCartAction());
  }

  onRegisterSuccess(params, response) {
    this.toggleVerify();
    this.setState({ isLoadingRegister: false });
  }

  onRegisterFailed(response) {
    const { words } = this.props.ActiveLanguageReducer;
    if (response.data.hasOwnProperty('detail')) {
      this.toggleModal(words['popup_login-reg-exists'] || 'popup_login-reg-exists', true);
    } else if (response.data.hasOwnProperty('non_field_errors')) {
      this.toggleModal(response.data.non_field_errors[0]);
    } else if (response.data.hasOwnProperty('username')) {
      this.toggleModal(response.data.username[0]);
    } else {
      this.toggleModal('Something Wrong');
    }
    this.setState({ isLoadingRegister: false });
  }

  /* Request Email Reset Password */
  onRequestEmail() {
    this.setState({ isLoadingReset: true });
    Presenter.RequestEmailResetPassword(
      Request.RequestEmailResetPassword(
        this,
        this.onRequestEmailSuccess,
        this.onRequestEmailFailed
      )
    );
  }

  onRequestEmailSuccess(params, response) {
    this.setState({
      recoveryEmail: '',
      isLoadingReset: false,
      forgotMessage: 'Link reset password has sent to your email'
    });
  }

  onRequestEmailFailed(response) {
    if (response.data.hasOwnProperty('detail')) {
      this.setState({
        forgotMessage: 'Email not yet registered',
        isLoadingReset: false
      });
    } else {
      this.setState({
        forgotMessage: 'Failed, try again',
        isLoadingReset: false
      });
    }
  }

  componentWillMount() {
    if (localStorage.getItem('username')) {
      this.setState({ email: localStorage.getItem('username') });
    }
  }

  render() {
    if (this.loggedIn) return null;
    const { words } = this.props.ActiveLanguageReducer;

    const state = this.state;
    let buttonLogin, buttonRegister, buttonReset;

    if (state.isLoadingLogin) {
      buttonLogin = <ButtonLoading value={(words.login_signin_button || 'login_signin_button') + '...'} />;
    } else {
      buttonLogin = (
        <ButtonValidation
          onClick={() => this.onLogin()}
          value={words.login_signin_button || 'login_signin_button'}
        />
      );
    }

    if (state.isLoadingRegister) {
      buttonRegister = (
        <ButtonLoading value={(words.login_signon_button || 'login_signon_button') + '...'} />
      );
    } else {
      buttonRegister = (
        <ButtonValidation
          onClick={() => this.onRegister()}
          value={words.login_signon_button || 'login_signon_button'}
        />
      );
    }

    if (state.isLoadingReset) {
      buttonReset = <ButtonLoading value={(words.login_send_link || 'login_send_link') + '...'} />;
    } else {
      buttonReset = (
        <ButtonValidation
          onClick={() => this.onRequestEmail()}
          value={words.login_send_link || 'login_send_link'}
        />
      );
    }

    return (
      <div>
        {/* Info Modal  */}
        <InfoModal
          small
          headline={this.state.heading}
          info={this.state.infoMsg}
          toggleModal={this.toggleModal}
          isActive={this.state.showModal}
        />

        {/*Forgot Password*/}
        <ForgotPasswordModal
          isActive={this.state.activeForgot}
          toggleModal={() => this.toggleForgot()}
          words={words}
          resetButton={buttonReset}
          recoveryEmail={this.state.recoveryEmail}
          onChange={e => this.setState({ recoveryEmail: e.target.value })}
          onKeyPress={e => {
            this.handleKeyPressRecovery(e);
          }}
        />

        {/* verify email */}
        <InfoModal
          headline={words['popup_login-reg-verify_big']}
          info={words['popup_login-reg-verify_small']}
          toggleModal={this.toggleVerify}
          isActive={this.state.activeVerify}
        />

        {/*Login & Register*/}
        <section className="login-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-6 col-xs-12 sign-in">
                <h3>{words.gen_login || 'gen_login'}</h3>
                <Form
                  ref={c => {
                    this.form = c;
                  }}
                >
                  {/* <p>{words.login_description}</p> */}
                  <div className="text-input">
                    <label>{words['gen_email'] || 'gen_email'}</label>
                    <Input
                      onFocus={this.removeApiError}
                      ref={c => {
                        this.userInput = c;
                      }}
                      type="email"
                      name="email"
                      placeholder="example@example.com"
                      value={state.email}
                      // placeholder={words.login_field_email}
                      onChange={e => this.setState({ email: e.target.value })}
                      onKeyPress={e => {
                        this.handleKeyPress(e);
                      }}
                      validations={[required, email]}
                    />
                  </div>
                  <div className="text-input">
                    <label>{words['gen_pwd'] || 'gen_pwd'}</label>
                    <Input
                      onFocus={this.removeApiError}
                      ref={c => {
                        this.userInput = c;
                      }}
                      type="password"
                      name="password"
                      maxLength={16}
                      placeholder="********"
                      // placeholder={words.login_field_password}
                      onChange={e =>
                        this.setState({ password: e.target.value })
                      }
                      onKeyPress={e => {
                        this.handleKeyPress(e);
                      }}
                      validations={[required]}
                    />
                  </div>
                  <div className="buttons-wrp">
                    <div className="forgot" onClick={() => this.toggleForgot()}>
                      <a tabIndex="0" role="button" className="open-modal">
                        {(words.login_pwd_forgotten || 'login_pwd_forgotten')}
                      </a>
                    </div>
                    <div className="submit-input">{buttonLogin}</div>
                  </div>
                </Form>
              </div>
              <div className="col-lg-offset-2 col-lg-5 col-md-6 col-xs-12 sign-up">
                <h3>{words.gen_register}</h3>
                <Form>
                  {/* <p>{words.login_register_description}</p> */}
                  <div className="text-input">
                    <label>{words['gen_email'] || 'gen_email'}</label>
                    <Input
                      type="email"
                      name="emailRegister"
                      placeholder="example@example.com"
                      // placeholder={words.login_field_email}
                      onChange={e => {
                        this.setState({ registerUsername: e.target.value });
                        this.onGrab(e.target.value);
                      }}
                      validations={[required, email]}
                    />
                  </div>
                  <div className="text-input">
                    <label>{words['gen_pwd'] || 'gen_pwd'}</label>
                    <Input
                      type="password"
                      name="passwordRegister"
                      placeholder="********"
                      // placeholder={words.login_field_password}
                      maxLength={16}
                      onChange={e =>
                        this.setState({ registerPassword: e.target.value })
                      }
                      onKeyPress={e => {
                        this.handleKeyPressRegister(e);
                      }}
                      validations={[required]}
                    />
                  </div>
                  <div className="buttons-wrp">
                    <div className="submit-input">{buttonRegister}</div>
                    <div className="forgot">{words.login_register_terms  || 'login_register_terms'}</div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    TokenReducer: state.TokenReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer,
    ActiveLocationReducer: state.ActiveLocationReducer,
    LanguageReducer: state.LanguageReducer
  };
};
const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({
      getUserDetails
    }, dispatch),
    RunRedux: data => {
      dispatch(data);
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);

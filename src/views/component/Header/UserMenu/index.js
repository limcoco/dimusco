import React from 'react';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import UserMenuList from './UserMenuList';
import OrganizationMenuList from './OrganizationMenuList';
import Login from './Login';
import DropDownDynamic from './../../DropDownDynamic';

const Menu = props => {
  const auth = {
    isLogin: props.SessionReducer.is_auth,
    isLoginAsInstitution: props.InstitutionReducer.is_auth,
    isLoginAsPublisher: props.PublisherReducer.is_auth,
    isLoginAsEnsemble: props.EnsembleReducer.is_auth
  };
  const { words } = props.ActiveLanguageReducer;
  const { user } = props.SessionReducer;
  const { name } = props.userDetails;

  const isOrganization =
    auth.isLoginAsInstitution ||
    auth.isLoginAsEnsemble ||
    auth.isLoginAsPublisher;

  let infoTitle = words.gen_user || 'gen_user',
    infoName = user.name,
    isUserNameShown = true;

  if (auth.isLoginAsInstitution) {
    infoTitle = words.gen_institution;
    infoName = props.InstitutionReducer.institution.name;
  } else if (auth.isLoginAsEnsemble) {
    infoTitle = words.gen_ensemble;
    infoName = props.EnsembleReducer.ensemble.name;
  } else if (auth.isLoginAsPublisher) {
    infoTitle = words.gen_publisher;
    infoName = props.PublisherReducer.publisher.name;
  } else {
    isUserNameShown = false;
  }

  return (
    <div>
      {auth.isLogin ? (
        <DropDownDynamic
          toRight
          triger={
            <div className="user-box header__user-box">
              <a
                tabIndex="0"
                role="button"
                className="flex-align-center column-direction"
              >
                <p className="user-info-p">{infoTitle}</p>
                <p className="user-info-p">{name || infoName}</p>
                {isUserNameShown && (
                  <p className="user-info-p">{'(' + user.name + ')'}</p>
                )}
              </a>
            </div>
          }
          closeOnSelect
        >
          <div
            className={classnames('header-dropwdown header-dropdown-custom', {
              'header-dropwdown-active': true
            })}
          >
            {isOrganization ? (
              <OrganizationMenuList
                words={words}
                onLogout={props.onLogout}
                {...auth}
              />
            ) : (
              <UserMenuList words={words} onLogout={props.onLogout} />
            )}
          </div>
        </DropDownDynamic>
      ) : (
        <Login />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    InstitutionReducer: state.InstitutionReducer,
    PublisherReducer: state.PublisherReducer,
    EnsembleReducer: state.EnsembleReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    userDetails: state.userDetails
  };
};

Menu.propTypes = {
  SessionReducer: PropTypes.shape({
    is_auth: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  }),
  InstitutionReducer: PropTypes.shape({
    is_auth: PropTypes.bool.isRequired
  }),
  PublisherReducer: PropTypes.shape({
    is_auth: PropTypes.bool.isRequired
  }),
  EnsembleReducer: PropTypes.shape({
    is_auth: PropTypes.bool.isRequired
  }),
  ActiveLanguageReducer: PropTypes.shape({
    words: PropTypes.object.isRequired
  }),
  userDetails: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Menu)
);
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import DropDownDynamic from './../../DropDownDynamic';

const Menu = props => {
  const auth = {
    isLogin: props.SessionReducer.is_auth,
    isLoginAsInstitution: props.InstitutionReducer.is_auth,
    isLoginAsPublisher: props.PublisherReducer.is_auth,
    isLoginAsEnsemble: props.EnsembleReducer.is_auth
  };
  const { words } = props.ActiveLanguageReducer;
  
  let infoTitle = words.gen_production;

  const production = JSON.parse(localStorage.getItem('production')) || {};
  const { name, prid } = production;

  const closeProduction = () => {
    localStorage.removeItem('production')
  }
  return (
    <div>
      {auth.isLoginAsInstitution && prid &&
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
                <p className="user-info-p">{name}</p>
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
            <span>
              <p>
                <Link to={`/production/${prid}/groups`}>{words.gen_groups}</Link>
              </p>
              <p>
                <Link to={`/production/${prid}/library`}>{words.gen_library}</Link>
              </p>
              <p>
                <Link to={`/production/${prid}/assignment`}>{words.prod_assign_scores || 'prod_assign_scores'}</Link>
              </p>
              <p>
                <Link to={`/production/${prid}/layer`}>{words.prod_assign_layers || 'prod_assign_layers'}</Link>
              </p>
              <p>
                <Link to={`/production/overview`}>{words.gen_administration || 'gen_administration'}</Link>
              </p>
              <p>
                <Link
                  to={`/inst-groups`}
                  onClick={() => closeProduction()}
                >
                  {words.gen_close || 'gen_close'}
                </Link>
              </p>
            </span>
          </div>
        </DropDownDynamic>
      }
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

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Menu)
);

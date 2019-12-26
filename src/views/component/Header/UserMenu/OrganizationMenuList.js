import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

const OrganizationMenuList = props => {
  const {
    words,
    isLoginAsInstitution,
    isLoginAsEnsemble,
    isLoginAsPublisher,
    onLogout
  } = props;
  let linkManage, linkLibrary;

  if (isLoginAsInstitution) {
    linkManage = '/inst-groups';
    linkLibrary = '/library';
  } else if (isLoginAsEnsemble) {
    linkManage = '/ensemble';
    linkLibrary = '/library';
  } else if (isLoginAsPublisher) {
    linkManage = '/pub-groups';
    linkLibrary = '/pub-library';
  }

  return (
    <span>
      <p>
        <Link className="link" to={linkManage}>
          {words.gen_groups || 'gen_groups'}
        </Link>
      </p>
      <p>
        <Link className="link" to={linkLibrary}>
          {words.gen_library}
        </Link>
      </p>
      {isLoginAsPublisher && (
        <p>
          <Link className="link" to="/score-options">
            {words.score_options || 'score_options'}
          </Link>
        </p>
      )}
      {(isLoginAsInstitution || isLoginAsEnsemble) && (
        <p>
          <Link className="link" to="/layers">
            {words.general_layers}
          </Link>
        </p>
      )}
      {isLoginAsPublisher && (
        <Fragment>
          <p>
            <Link className="link" to="/pub-prices">
              {words.score_prices || 'score_prices'}
            </Link>
          </p>
          {/* <p>
            <Link className="link" to="/pub-discount">
              {words.score_discounts || 'score_discounts'}
            </Link>
          </p> */}
        </Fragment>
      )}
      <p>
        <Link className="link" to="/contacts">
          {words['gen_contacts']}
        </Link>
      </p>
      <p>
        <Link className="link" to="/invitation">
          {words.gen_invitation}
        </Link>
      </p>
      <p>
        <Link className="link" to="/profile">
          {words.gen_administration}
        </Link>
      </p>
      <p>
        <Link className="link" to="/upload">
          {words.gen_upload}
        </Link>
      </p>
      {isLoginAsPublisher &&
      <p>
      <Link className="link" to="/import-upload-log">
        {words.gen_import}
      </Link>
    </p>
      }
      <p>
        <Link className="link" to="/productions">
          {words.gen_production}
        </Link>
      </p>
      <p onClick={() => onLogout()}>
        <Link className="link red-i" to="/home">
          {words.gen_logout}
        </Link>
      </p>
    </span>
  );
};

export default withRouter(OrganizationMenuList);

import React from 'react';
import PropTypes from "prop-types";
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserDetails } from "../../../../redux/actions/profilePageActions"

import {
  RemoveEnsembleSession,
  StopEnsembleSession
} from '../../../../redux/account/ensemble/presenter';
import {
  RemoveInstitutionSession,
  StopInstitutionSession
} from '../../../../redux/account/institution/presenter';
import {
  RemovePublisherSession,
  StopPublisherSession
} from '../../../../redux/account/publisher/presenter';

const stopAsActing = props => {
  // Stop from institution
  props.StopInstitutionSession();
  props.RemoveInstitutionSession();

  // Stop from publsiher
  props.StopPublisherSession();
  props.RemovePublisherSession();

  // Stop from ensemble
  props.StopEnsembleSession();
  props.RemoveEnsembleSession();
  props.getUserDetails();
  localStorage.removeItem('production');
};

const getUserModesMenu = words => {
  const items = [
    {
      id: 1,
      isUser: true,
      link: '/home',
      onClick: stopAsActing,
      content: words.gen_user || 'gen_user'
    },
    {
      id: 2,
      link: '/ens-list',
      content: words.gen_ensemble
    },
    {
      id: 3,
      link: '/inst-list',
      content: words.gen_institution
    },
    {
      id: 4,
      link: '/pub-list',
      content: words.gen_publisher
    }
  ];

  return items;
};

class ContextMenu extends React.Component {
  onItemClicked = item => () => {
    item.onClick && item.onClick(this.props);
    this.props.onClick();
  };

  render() {
    const { words, auth } = this.props;

    const isNotUserMenuEnabled =
      auth.isLoginAsEnsemble ||
      auth.isLoginAsInstitution ||
      auth.isLoginAsPublisher;

    return (
      <section
        className={classnames('context-menu-dekstop', {
          'context-show': true
        })}
      >
        <div className="context-menu-inner">
          {getUserModesMenu(words).map(item => {
            const isShown = item.isUser ? isNotUserMenuEnabled : true;

            return (
              isShown && (
                <p key={item.id} onClick={this.onItemClicked(item)}>
                  <Link className="link" to={item.link}>
                    {item.content}
                  </Link>
                </p>
              )
            );
          })}
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      StopInstitutionSession,
      RemoveInstitutionSession,
      StopPublisherSession,
      RemovePublisherSession,
      StopEnsembleSession,
      RemoveEnsembleSession,
      getUserDetails
    },
    dispatch
  )
});

ContextMenu.propTypes = {
// TODO: add propTypes to rest props
}

export default connect(
  null,
  mapDispatchToProps
)(ContextMenu);

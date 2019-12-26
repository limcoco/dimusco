import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import CreatePublisherInstitution from '../../component/CreatePublisherInstitution';

import Presenter from '../../../publisher/presenter';
import RequestMapper from '../../../publisher/utils/request';
import Modal from '../../component/Modal/Info'
import './createPublisher.css';

class CreateInstitution extends Component {
  state = {}
  onSubmit = data => {
    const payload = {
      ...this,
      ...data
    };

    Presenter.Register(
      RequestMapper.Register(payload, this.onSuccess, this.onFailed)
    );
  };

  onSuccess = (params, response) => {
    this.toggleModal()
  };

  onFailed = response => {};

  toggleModal = () => {
    this.setState((state, props) => { return { ...state, isActive: !state.isActive }})
  }

  redirect = () => {
    this.props.history.push('/pub-list');
  }

  render() {
    const { onSubmit, onSuccess, onFailed } = this;
    const {ActiveLanguageReducer: {words}} = this.props;
    return (
      <div className='create-pub-page'>
        <Modal
            toggleModal={this.toggleModal}
            isActive={this.state.isActive}
            small
            action={this.redirect}
            headline={words.popup_create_publisher}
        >
            <a onClick={this.toggleModal} className='close'>X</a>
        </Modal>
        <CreatePublisherInstitution
          type="publisher"
          onSubmit={onSubmit}
          onSuccess={onSuccess}
          onFailed={onFailed}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    TokenReducer: state.TokenReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer
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
)(CreateInstitution);

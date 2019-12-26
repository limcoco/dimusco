import React, { Component } from 'react';
import { connect } from 'react-redux';

import DropDown from '../../component/DropDown';
import { InfoModal } from '../../component/Modal';

import PublisherPresenter from '../../../publisher/presenter';
import PublisherRequest from '../../../publisher/utils/request';
import Request from '../../../utils/Request';

import './styles.css';

class CreateContract extends Component {
  state = {
    page: 1,
    publishers: [],
    publisherId: '',
    contractName: '',
    comment: ''
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      state: { publisherId, contractName, comment },
      props: { InstitutionReducer, TokenReducer }
    } = this;
    const { iid } = InstitutionReducer.institution;
    const payload = {
      institution_id: iid,
      publisher_id: publisherId,
      name: contractName,
      contract_id: '1',
      state: 0,
      comment
    };

    Request(
      'post',
      'create-contract',
      {
        Authorization: `Token ${TokenReducer.tokenInstitution}`
      },
      payload,
      [],
      this.onRegisterSuccess,
      this.onRegisterFailed
    );
  };

  onRegisterSuccess = response => {
    this.props.history.push('/relations');
  };

  onRegisterFailed = (params, response) => {
    this.props.history.push('/relations');
  };

  handleDrop = data => this.setState({ publisherId: data.value });

  getPublishersList = page => {
    PublisherPresenter.ReadAll(
      PublisherRequest.ReadAll(
        this,
        this.onGetPubSuccess,
        this.onGetPubFailed,
        page
      )
    );
  };

  onGetPubSuccess = (params, response) => {
    if(response && response.data && response.data.results.length)
    this.setState({
      publishers: this.state.publishers.concat(response.data.results),
      publisherId: response.data.results[0].pid
    });
  };

  onGetPubFailed = (params, response) => {};

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  componentDidMount() {
    const {
      state: { page },
      getPublishersList
    } = this;
    getPublishersList(page);
  }

  render() {
    const { InstitutionReducer, ActiveLanguageReducer } = this.props;
    const { words } = ActiveLanguageReducer;
    const {
      contractName,
      comment,
      publishers,
      publisherId
    } = this.state;

    if (!InstitutionReducer.is_auth) return null;

    const options = publishers.map(publisher => ({
      value: publisher.pid,
      label: publisher.name
    }));

    return (
      <React.Fragment>
        <div className="create-contract">
          <div className="container">
            <div className="create-contract__title">
              <label>{words.contract_create}</label>
            </div>
            <div className="box">
              <div className="container">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>{words.gen_publisher}</label>
                    <div className="drop-down__wrapper">
                      <DropDown
                        options={options}
                        value={publisherId}
                        onChange={this.handleDrop}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{words.gen_contract}</label>
                    <input
                      type="text"
                      name="contractName"
                      className="form-control"
                      onChange={this.onChange}
                      value={contractName}
                      autocomplete="off"
                    />
                  </div>
                  <div className="form-group textarea">
                    <label>{words.gen_comment}</label>
                    <textarea
                      rows="20"
                      name="comment"
                      className="form-control form__textarea"
                      onChange={this.onChange}
                      value={comment}
                    />
                  </div>
                  <div className="btns-wrapper center-content">
                    <button className="btn black" type="submit">
                      {words.gen_send}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    TokenReducer: state.TokenReducer,
    InstitutionReducer: state.InstitutionReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer
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
)(CreateContract);

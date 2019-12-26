import React, { Component } from 'react';
import PropTypes from "prop-types";
import Auth from '../../../redux/account/authToken';
import Request from "../../../utils/Request";
import { Link } from 'react-router-dom';
import './style.css';
import validator from 'validator';
import DropDown from '../../component/DropDown';
import InfoModal from '../../component/Modal/Info';

class AddContact extends Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    comment: '',
    phone_1: '',
    phone_2: '',
    group: '',
    country: '',
    countries: [],
    countriesData: {},
    msg: ''
  }

  componentDidMount () {
    this.props.getContactsGroups();
    const {id} = this.props;
    this.getCountries(1)
    if (id)
      this.getContact(id);
  }

  getContact = (id) => {
    let headers = {
      Authorization: 'Token ' + Auth.getActiveToken()
    }
    Request(
      'get',
      'update-contact',
      headers,
      {},
      [id],
      this.onGetSuccess,
      this.onGetFailed
    );
  }

  onGetSuccess = (response) => {
    this.setState({
      ...response.data
    })
  }

  onGetFailed = (error) => {
    console.log('error: ', error);
  }

  addContact = (data) => {
    let headers = {
      Authorization: 'Token ' + Auth.getActiveToken()
    }
    data.contact_groups = data.group ? [data.group] : [];
    delete data.group;
    delete data.msg;
    Request(
      'post',
      'account-contacts',
      headers,
      data,
      [],
      this.onAddSuccess,
      this.onAddFailed
    );
  }

  onAddSuccess = () => {
    const { ActiveLanguageReducer: {words} } = this.props;
    this.toggleMsgModal(words.popup_return_good);
    this.setState({
      first_name: '',
      last_name: '',
      email: '',
      comment: '',
      phone_1: '',
      phone_2: '',
      street: '',
      number: '',
      city: '',
      zip: '',
      state: ''
    })
  }

  onAddFailed = (error) => {
    const { ActiveLanguageReducer: {words} } = this.props;
    this.toggleMsgModal(words.popup_return_bad);
  }

  editContact = (id, data) => {
    let headers = {
      Authorization: 'Token ' + Auth.getActiveToken()
    }
    Request(
      'put',
      'update-contact',
      headers,
      data,
      [id],
      this.onEditSuccess,
      this.onEditFailed
    );
  }

  onEditSuccess = (response) => {
    this.setState({
      ...response.data
    }, () => {
      const {getData, toggleModal, toggleMsgModal, ActiveLanguageReducer: {words}} = this.props;
    toggleModal();
    toggleMsgModal(words.popup_return_good);
    getData();
    })
  }

  onEditFailed = (error) => {
    const { ActiveLanguageReducer: {words} } = this.props;
    this.toggleMsgModal(words.popup_return_bad);
  }

  onSumbit = (ev) => {
    ev.preventDefault();
    const {id} = this.props;
    const { ActiveLanguageReducer: {words} } = this.props;
    const {first_name, last_name, email} = this.state;
    if (this.state.email) {
      if(!validator.isEmail(email)) {
        this.setState({
          emailError: 'This is not a valid email'
        })
      } else {
        this.setState({
          emailError: ''
        })
      }
    } else {
      this.setState({
        emailError: words.gen_required_field || 'gen_required_field'
      })
    }

    if (!first_name) {
      this.setState({
        firstNameError: words.gen_required_field || 'gen_required_field'
      })
    } else {
      this.setState({
        firstNameError: ''
      })
    }

    if (email && first_name && validator.isEmail(email)) {
      if (id) {
        this.editContact(id, this.state);
      } else {
        this.addContact(this.state);
      }
    }
  }

  handleInput = (ev) => {
    this.setState({
        [ev.target.name]: ev.target.value
    })
  }

  getCountryName = () => {
    const {
      state: { countries },
      props: { SessionReducer: {user: {country: userCountry}}  }
    } = this;
    const [result] = countries.filter(
      country => country.abbreviation === userCountry
    );

    if (result) {
      if (this.state.country === '') {
        this.setState({ country: result.abbreviation });
      }
      return result.name;
    }
  };

  getCountries = (page) => {
    Request(
      'get',
      'countries',
      {},
      {},
      [],
      this.getCountriesSuccess,
      this.getCountriesFailed,
      undefined,
      undefined,
      `?page=${page}`
    );
  }

  getCountriesSuccess = (response) => {
    if (response.data.current !== this.state.countriesData.current) {
      this.setState({
        countries: this.state.countries.concat(response.data.results),
        countriesData: response.data
      });
      this.getCountries(this.state.countriesData.current + 1);
    }
  }

  getCountriesFailed = (error) => {
    console.log('error: ', error);
  }

  handleDrop = ({ value }) => {
    this.setState({
      country: value
    });
  }

  toggleMsgModal = (msg) => {
    this.setState((state) => ({
        ...state,
        isMsgActive: !state.isMsgActive,
        msg
    }))
}


  render() {
    const { ActiveLanguageReducer: {words}, contactsGroups, SessionReducer: {user: {country}} } = this.props;
    const {id, toggleModal} = this.props;

    const options = [
      ...this.state.countries.map(item => {
        return { value: item.abbreviation, label: item.name };
      })
    ];

    const {msg, isMsgActive} = this.state;

    return (
      <div className='profile-page full-height add-contact'>
        {isMsgActive &&
        <InfoModal
            small
            info={msg}
            toggleModal={this.toggleMsgModal}
            isActive={isMsgActive}
        />
      }
        <div className='container'>
          <div className="edit-address">
            <h2>{id ? words.contacts_edit : words['contacts_add']}</h2>
              <form onSubmit={this.onSumbit} noValidate>
                <div className="box">
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className="form-group col-xs-5">
                          <label>{words['gen_first-name']}</label>
                          <input
                            type="text"
                            name="first_name"
                            className={this.state.firstNameError? "error form-control" : "form-control"}
                            onChange={this.handleInput}
                            value={this.state.first_name}
                            placeholder={words.gen_required_field || 'gen_required_field'}
                          />
                        </div>
                        <div className="form-group col-xs-7">
                          <label>{words['gen_last-name']}</label>
                          <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            onChange={this.handleInput}
                            value={this.state.last_name}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                          <label>{words['gen_email']}</label>
                          {this.state.emailError !== (words.gen_required_field || 'gen_required_field') && <span className='validation__message'>{this.state.emailError}</span>}
                          <input
                              type="email"
                              name="email"
                              className={this.state.emailError? "error form-control" : "form-control"}
                              onChange={this.handleInput}
                              value={this.state.email}
                              placeholder={words.gen_required_field || 'gen_required_field'}
                          />
                      </div>
                      <div className="row">
                          <div className="form-group col-xs-6">
                            <label>{words['gen_phone1']}</label>
                            <input
                              type="text"
                              name="phone_1"
                              className="form-control"
                              onChange={this.handleInput}
                              value={this.state.phone_1}
                            />
                          </div>
                          <div className="form-group col-xs-6">
                            <label>{words['gen_phone2']}</label>
                            <input
                              type="text"
                              name="phone_2"
                              className="form-control"
                              onChange={this.handleInput}
                              value={this.state.phone_2}
                            />
                          </div>
                      </div>
                      <div className="form-group">
                        <label>{words.contacts_group_select || 'contacts_group_select'}</label>
                        <select
                          name="group"
                          className="form-control"
                          onChange={this.handleInput}
                          value={this.state.group}
                        >
                          {contactsGroups.results.map((item) => {
                            return (
                                <option value={item.cgid} key={item.cgid}>
                                    {item.name}
                                </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='row'>
                          <div className="form-group col-xs-8">
                            <label>{words.gen_street || 'gen_street'}</label>
                            <input
                              type="text"
                              name="street"
                              className={"form-control"}
                              onChange={this.handleInput}
                              value={this.state.street}
                            />
                          </div>
                          <div className="form-group col-xs-4">
                            <label>{words.gen_number || 'gen_number'}</label>
                            <input
                              type="text"
                              name="number"
                              className="form-control"
                              onChange={this.handleInput}
                              value={this.state.number}
                            />
                          </div>
                          <div className="form-group col-xs-8">
                            <label>{words.gen_city || 'gen_city'}</label>
                            <input
                              type="text"
                              name="city"
                              className={"form-control"}
                              onChange={this.handleInput}
                              value={this.state.city}
                            />
                          </div>
                          <div className="form-group col-xs-4">
                            <label>{words.gen_zip || 'gen_zip'}</label>
                            <input
                              type="text"
                              name="zip"
                              className="form-control"
                              onChange={this.handleInput}
                              value={this.state.zip}
                            />
                          </div>
                          <div className="form-group col-xs-7">
                            <label>{words.gen_country || 'gen_country'}</label>
                            <DropDown
                                value={this.state.country}
                                defaultValue={this.getCountryName(country)}
                                onChange={this.handleDrop}
                                options={options}
                                className="form-control"
                                label="Choose a country"
                                search
                            />
                          </div>
                          <div className="form-group col-xs-5">
                            <label>{words.gen_state || 'gen_state'}</label>
                            <input
                              type="text"
                              name="state"
                              className="form-control"
                              onChange={this.handleInput}
                              value={this.state.state}
                            />
                          </div>
                        </div>
                    </div>
                  </div>
                      
                  <div className="form-group">
                      <label>{words['gen_comment']}</label>
                      <textarea
                          name="comment"
                          className="form-control"
                          onChange={this.handleInput}
                          value={this.state.comment}
                          rows={4}
                      />
                  </div>
                </div>
              <div className='btns-wrp'>
                  {!id ? 
                    <Link className='btn black' to='/contacts'>{words.gen_back}</Link>
                  :
                    <button className='btn black' onClick={toggleModal}>{words.gen_back}</button>
                  }
                  <button className='btn black' type='submit'>{id ? words.gen_save || 'gen_save' : words.gen_add}</button>
              </div>
              </form>
          </div>
        </div>
      </div>
    );
  }
}

AddContact.propTypes = {
  ActiveLanguageReducer: PropTypes.shape({
    words: PropTypes.object.isRequired
  }),
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
  RunRedux: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userDetails: PropTypes.object.isRequired,
}

export default AddContact;

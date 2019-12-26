import React, {Component, Fragment} from 'react';
import Auth from '../../../redux/account/authToken';
import Request from "../../../utils/Request";
import validator from 'validator';
import { pick } from 'lodash/core';

class Contact extends Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    comment: '',
    phone_1: '',
    phone_2: '',
    captcha: '',
    ticket_ID: '',
    Num1: Math.floor((Math.random() + 0.1)*10),
    Num2: Math.floor((Math.random() + 0.1)*10),
    tickets: []
  }

  componentDidMount () {
    this.getTickets();
  }

  getTickets = () => {
      let headers = {
        Authorization: 'Token ' + Auth.getActiveToken()
      }
      Request(
        'get',
        'ticket',
        headers,
        {},
        [],
        this.onGetTicketsSuccess,
        undefined
      );
  }

  onGetTicketsSuccess = (response) => {
    this.setState({
      tickets: response.data || []
    })
  }

  addContact = (data) => {
    let headers = {
      Authorization: 'Token ' + Auth.getActiveToken()
    }
    Request(
      'post',
      'ticket',
      headers,
      data,
      [],
      this.onAddSuccess,
      this.onAddFailed
    );
  }

  onAddSuccess = () => {
    this.getTickets();
    this.setState({
      first_name: '',
      last_name: '',
      email: '',
      comment: '',
      phone_1: '',
      phone_2: '',
      captcha: '',
      ticket_ID: ''
    })
  }

  onAddFailed = (error) => {
    console.log('error: ', error);
  }


  onSubmit = (ev) => {
    ev.preventDefault();
    const { ActiveLanguageReducer: {words} } = this.props;
    const { email, captcha, Num1, Num2, comment } = this.state;

    if (!validator.isEmail(email)) {
      this.setState({
        emailError: 'This is not a valid email'
      })
    } else {
      this.setState({
        emailError: ''
      })
    }

    if (!comment) {
      this.setState({
        commentError: words.gen_required_field || 'gen_required_field'
      })
    }

    const captchaCorrect = parseInt(captcha) === (Num1 + Num2);
    if (!captcha) {
      this.setState({
        captchaError: words.gen_required_field || 'gen_required_field'
      })
    } else if (!captchaCorrect) {
      this.setState({
          captcha: '',
          Num1: Math.floor(Math.random()*10),
          Num2: Math.floor(Math.random()*10),
          captchaError: 'Try Again'
      })
    } else {
        this.setState({
            captchaError: ''
        })
    }

    if (comment && captchaCorrect && validator.isEmail(email)) {
        const data = pick(this.state, [
            'email', 'ticket_id', 'first_name', 'last_name',
            'phone_1', 'phone_2', 'comment'
        ]);
        this.addContact(data);
    }
  }

  handleInput = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  render() {
    const { ActiveLanguageReducer: {words} } = this.props;
    const { Num1, Num2, tickets } = this.state;
    
    return (
      <div className='profile-page full-height'>
        <div className='container'>
          <div className="edit-address">
            <h2 className="text-center">{words['ticket_title'] || 'ticket_title'}</h2>
            <form onSubmit={this.onSubmit} noValidate>
              <div className="box">
                <div className='row'>
                  <div className="form-group col-xs-5">
                    <label>{words['gen_first-name']}</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      onChange={this.handleInput}
                      value={this.state.first_name}
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
                  {this.state.emailError !== (words.gen_required_field || 'gen_required_field') &&
                  <span className='validation__message'>{this.state.emailError}</span>}
                  <input
                    type="email"
                    name="email"
                    className={this.state.emailError ? "error form-control" : "form-control"}
                    onChange={this.handleInput}
                    value={this.state.email}
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
                  <label>{words['gen_comment']}</label>
                  <textarea
                    name="comment"
                    className={this.state.commentError ? "error form-control" : "form-control"}
                    onChange={this.handleInput}
                    value={this.state.comment}
                    rows={8}
                    placeholder={words.gen_required_field || 'gen_required_field'}
                  />
                </div>
                <div className="form-group">
                  <label>{words['ticket_ID'] || 'ticket_ID'}</label>
                  <select
                    type="text"
                    name="ticket_id"
                    className="form-control"
                    onChange={this.handleInput}
                    value={this.state.ticket_id}
                  >
                    <option value=''>None</option>
                    {tickets.map((item, index) => {
                      return (
                        <option key={item.tid} value={item.ticket_id}>Ticket {index + 1}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="d-flex align-center">
                <div className="form-group col-xs-6 lbl-margin">
                  <div className="captcha-wrap">
                    <div className="col-md-3 text-right">
                      <label className="captcha-lbl">{Num1} + {Num2}</label>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        name="captcha"
                        className={this.state.captchaError ? "error form-control" : "form-control"}
                        onChange={this.handleInput}
                        value={this.state.captcha}
                        placeholder={words.gen_required_field || 'gen_required_field'}
                      />
                    </div>
                  </div>
                </div>
                <div className='btns-wrp'>
                  <button className='btn black' type='submit'>{words.gen_send}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Contact;
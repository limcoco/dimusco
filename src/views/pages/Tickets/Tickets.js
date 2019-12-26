import React, { Component, Fragment } from 'react'
import Modal from '../../component/Modal/Skeleton'
import Table from '../../component/Table/Table.js'
import Request from '../../../utils/Request'
import auth from '../../../redux/account/authToken'
import moment from 'moment'

import config from '../../../config/setting'

class Tickets extends Component {
  state = {
    tickets: [],
  }

  componentDidMount() {
    this.getContacts()
  }

  getContacts = () => {
    const { id } = this.props

    Request(
      'get',
      'single-ticket',
      { Authorization: `Token ${auth.getActiveToken()}` },
      {},
      [id],
      this.onSuccess,
      this.onFailed
    )
  }

  onSuccess = response => {
    this.setState({
      tickets: response.data,
    })
  }

  onFailed = error => {
    console.log('error: ', error)
  }

  render() {
    const { toggleModal, isActive, words } = this.props
    const { tickets } = this.state
    const firstTicket = tickets[0];
    return (
      <div className="remove-modal">
        <Modal toggleModal={toggleModal} isActive={isActive}>
          <a onClick={toggleModal} className="close">
            X
          </a>
            <div className='header-wrp'>
              <div className='p-50'>
                <div className='row'>
                  <div className='col-xs-3'>{words[`gen_email`]}</div>
                  <div className='col-xs-2'>{words['gen_first-name']}</div>
                  <div className='col-xs-2'>{words['gen_last-name']}</div>
                  <div className='col-xs-5'>{words['gen_ticket_id'] || 'gen_ticket_id'}</div>
                </div>
              </div>
              <div className='box'>
                {firstTicket &&
                  <div className='row'>
                    <div className='col-xs-3'>{firstTicket.email}</div>
                    <div className='col-xs-2'>{firstTicket.first_name}</div>
                    <div className='col-xs-2'>{firstTicket.last_name}</div>
                    <div className='col-xs-5'>{firstTicket.ticket_id}</div>
                  </div>
                }
              </div>
            </div>
            <div className='p-50 comments'>
              {tickets.map(rowData => {
                return (
                  <Fragment key={rowData.id}>
                    {moment(rowData.created_at).format(config.DATE_WITH_TIME_FORMAT)}
                    <div className="box">
                      {rowData.comment}
                    </div>
                  </Fragment>
                )
              })}
            </div>
        </Modal>
      </div>
    )
  }
}

export default Tickets;

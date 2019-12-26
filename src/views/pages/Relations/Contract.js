import React, { Component } from 'react'
import Modal from '../../component/Modal/Skeleton'
import Table from '../../component/Table/Table.js'
import Request from '../../../utils/Request'
import auth from '../../../redux/account/authToken'
import moment from 'moment'

import config from '../../../config/setting'

class Contracts extends Component {
  state = {
    contracts: [],
    ordering: ''
  }

  componentWillReceiveProps() {
    this.getContacts()
  }

  getContacts = () => {
    const { contract_id } = this.props

    Request(
      'get',
      'get-contacts',
      { Authorization: `Token ${auth.getActiveToken()}` },
      { contract_id, ordering: this.state.ordering },
      [],
      this.onSuccess,
      this.onFailed
    )
  }

  onSuccess = response => {
    this.setState({
      contracts: response.data.contracts,
    })
  }

  onFailed = error => {
    console.log('error: ', error)
  }

  onTableHeaderItemClick = (e, data) => {
    let fields = data.data.sort.split(',')
    for (let i = 0; i < fields.length; i++) {
      if (!data.ascending) {
        fields[i] = '-' + fields[i]
      }
    }
    this.setState({
      ordering: fields.join(',')
    }, () => {
      this.getContacts()
    })
  }

  render() {
    const { toggleModal, isActive, words, type } = this.props
    const { contracts } = this.state
    let tableColumns = [words[`gen_${type}`], words['gen_state'], words['gen_created'], words['gen_changed']]

    let tableColumnExtras = {}
    tableColumnExtras[words[`gen_${type}`]] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: `${type}__name`,
      },
    }
    tableColumnExtras[words['gen_state']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'state',
      },
    }
    tableColumnExtras[words['gen_created']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'created_at',
      },
    }
    tableColumnExtras[words['gen_changed']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'created_at',
      },
    }

    return (
      <div className="remove-modal">
        <Modal toggleModal={toggleModal} isActive={isActive}>
          <a onClick={toggleModal} className="close">
            X
          </a>
          <Table
            columns={tableColumns}
            columnsExtras={tableColumnExtras}
            onHeaderItemClick={this.onTableHeaderItemClick}
            noDataDesc={words.library_empty}
          >
            {contracts.map(rowData => {
              const getState = () => {
                let state = ''
                if (rowData.latest_state.id === 0) state = 'state_requested'
                else if (rowData.latest_state.id === 1) state = 'state_accepted'
                else if (rowData.latest_state.id === 2) state = 'state_rejected'
                else if (rowData.latest_state.id === 3) state = 'state_removed'
                else if (rowData.latest_state.id === 4) state = 'state_changed'
                return state
              }

              return (
                <li className="standard-container transition-all">
                  <div className="pointer no-margin row full-width" type="button" onClick={this.toggleModal}>
                    <div className="col-content col-body col-md-3 col-sm-3 col-xs-12">
                      {rowData.publisher_name || rowData.institution_name}
                    </div>
                    <div className="col-content col-body col-md-3 col-sm-3 col-xs-12">
                      {words[getState()] || getState()}
                    </div>
                    <div className="col-content col-body col-md-3 col-sm-3 col-xs-12">
                      {moment(rowData.created_timestamp).format(config.DATE_WITH_TIME_FORMAT)}
                    </div>
                    <div className="col-content col-body col-md-3 col-sm-3 col-xs-12">
                      {moment(rowData.latest_timestamp).format(config.DATE_WITH_TIME_FORMAT)}
                    </div>
                    <div className="col-content col-body col-md-3 col-sm-3 col-xs-12 more" />
                  </div>
                </li>
              )
            })}
          </Table>
        </Modal>
      </div>
    )
  }
}

export default Contracts

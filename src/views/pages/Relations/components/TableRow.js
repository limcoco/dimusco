import React, { Component, Fragment } from 'react'
import moment from 'moment'
import _ from 'lodash/core'
import Request from '../../../../utils/Request'
import Contract from '../Contract'
import auth from '../../../../redux/account/authToken'
import config from '../../../../config/setting'

class RelationsRow extends Component {
  state = {
    showList: false,
  }

  toggleList = () => this.setState({ showList: !this.state.showList })

  changeState = (data, state) => {
    const payload = {
      existing_contract_id: data.contract_id,
      name: data.contract_name,
      publisher_id: data.publisher_id,
      institution_id: data.institution_id,
      comment: '',
      state,
    }

    Request(
      'post',
      'create-contract',
      {
        Authorization: `Token ${auth.getActiveToken()}`,
      },
      payload,
      [],
      this.onChangeStateSuccess,
      this.onChangeStateFailed
    )
  }

  onChangeStateSuccess = () => {
    this.props.getRelations()
    this.toggleList()
  }

  onChangeStateFailed = error => {
    console.log('error: ', error)
  }

  toggleModal = (contract_id = '') => {
    const { isActive } = this.state
    this.setState({
      contract_id,
      isActive: !isActive,
    })
  }

  render() {
    const {
      props: { rowData, words, type },
      state: { showList, isActive },
    } = this

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
      <Fragment>
        <Contract
          isActive={isActive}
          contract_id={rowData.contract_id}
          toggleModal={this.toggleModal}
          type={type}
          words={words}
        />
        <li className="standard-container transition-all">
          <div className="pointer no-margin row full-width" type="button" onClick={this.toggleModal}>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">
              {rowData.publisher_name || rowData.institution_name}
            </div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">{rowData.contract_name}</div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">{words[getState()] || getState()}</div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">
                {moment(rowData.created_timestamp).format(config.DATE_WITH_TIME_FORMAT)}
            </div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">
                {moment(rowData.latest_timestamp).format(config.DATE_WITH_TIME_FORMAT)}
            </div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12 more" />
          </div>
          <div className="col-content col-body col-md-2 col-sm-2 col-xs-12 more">
            <a onClick={this.toggleList}>...</a>
            {showList && (
              <ul className="sub-menu">
                {type === 'publisher' && (
                  <React.Fragment>
                    <li className="submenu__item" onClick={() => this.changeState(rowData, 1)}>
                      {words['gen_accept'] || 'gen_accept'}
                    </li>
                    <li className="submenu__item" onClick={() => this.changeState(rowData, 2)}>
                      {words['gen_reject'] || 'gen_reject'}
                    </li>
                  </React.Fragment>
                )}
                <li className="submenu__item" onClick={() => this.changeState(rowData, 3)}>
                  {words['gen_delete'] || 'gen_delete'}
                </li>
                <li className="submenu__item" onClick={() => this.changeState(rowData, 4)}>
                  {words['gen_change'] || 'gen_change'}
                </li>
                <li className="submenu__item" onClick={this.toggleModal}>
                  {words['gen_history'] || 'gen_history'}
                </li>
              </ul>
            )}
          </div>
        </li>
      </Fragment>
    )
  }
}

export default RelationsRow

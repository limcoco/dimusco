import React, { Component, Fragment } from 'react'
import moment from 'moment'
import _ from 'lodash/core'
import Request from '../../../../utils/Request'
import Tickets from '../Tickets'
import auth from '../../../../redux/account/authToken'
import config from '../../../../config/setting'

class RelationsRow extends Component {
  state = {
    showList: false,
  }

  toggleList = () => this.setState({ showList: !this.state.showList })

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


    return (
      <Fragment>
        {isActive &&
          <Tickets
            isActive={isActive}
            id={rowData.ticket_id}
            toggleModal={this.toggleModal}
            type={type}
            words={words}
          />
        }
        <li className="standard-container transition-all">
          <div className="pointer no-margin row full-width" type="button" onClick={this.toggleModal}>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">
              {rowData.email}
            </div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">{rowData.first_name}</div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">{rowData.last_name}</div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">
                {moment(rowData.created_at).format(config.DATE_WITH_TIME_FORMAT)}
            </div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">
                {moment(rowData.created_at).format(config.DATE_WITH_TIME_FORMAT)}
            </div>
            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12 more" />
          </div>
          <div className="col-content col-body col-md-2 col-sm-2 col-xs-12 more">
            <a onClick={this.toggleList}>...</a>
            {showList && (
              <ul className="sub-menu">
              </ul>
            )}
          </div>
        </li>
      </Fragment>
    )
  }
}

export default RelationsRow

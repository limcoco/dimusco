import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Table from '../../../component/Table/Table.js'
import LibrariesRow from '../../../component/Row/LibrariesRow.js'
import { Link } from 'react-router-dom'
import './styles.css'
import RemoveModal from '../RemoveModal'
import ChangeModal from '../ChangeModal'
import config from '../../../../config/setting'

class BookList extends Component {
  constructor(props) {
    super(props)
    this.onTableHeaderItemClick = this.onTableHeaderItemClick.bind(this)
    this.onDeleteOptionClick = this.onDeleteOptionClick.bind(this)
    // this.onDeleteSuccess = this.onDeleteSuccess.bind(this);
    // this.onDeleteFailed = this.onDeleteFailed.bind(this);
    this.state = {
      data: {},
      isChangeActive: false,
      aid: null,
    }
  }

  onTableHeaderItemClick(e, data) {
    let fields = data.data.sort.split(',')
    for (let i = 0; i < fields.length; i++) {
      if (!data.ascending) {
        fields[i] = '-' + fields[i]
      }
    }
    this.props.makeSortRequest({order: fields.join(',')})
  }

  onDeleteOptionClick(data, text) {
    this.props.onDeleteScore(data)
    this.toggleRemoveModal()
  }

  toggleList = () => {
    const { showList } = this.state
    this.setState({
      showList: !showList,
    })
  }

  toggleRemoveModal = () => {
    const { isRemoveActive } = this.state
    this.setState({
      isRemoveActive: !isRemoveActive,
    })
  }

  toggleChangeModal = () => {
    this.setState(prevState => {
      return {
        isChangeActive: !prevState.isChangeActive,
      }
    })
  }

  changeLibraryScope = aid => () => {
    const { changeLibraryScope, history } = this.props
    changeLibraryScope({ assignment: aid }, this.toggleChangeModal, history)
  }

  generateRows() {
    const {
      words,
      items,
      changeLibraryScoreStatus: { original },
    } = this.props
    const { showList } = this.state

    return items.map((value, index) => {
      let score = {
        sid: value.sid,
        composer: value.composer,
        title: value.title,
        icon: value.icon,
        pages: value.pages,
        category: value.category,
        edition: value.edition,
        instrument: value.instrument,
        original: value.original,
        originalSid: value.original_sid,
        expire: moment(value.expire).format(config.DATE_FORMAT),
      }
      const data = {
        score: value.sid,
        assigment: value.aid,
        index: index,
      }
      return (
        <LibrariesRow
          index={index}
          score={score}
          composer={value.composer}
          key={index}
          options={
            <ul className="dropdown member-menu dropdown-popup-content">
              <li className="submenu__item">
                <Link
                  to={{
                    pathname: score.original ? `/library` : `/mod_page/${value.aid}/`,
                    state: { ...score },
                  }}
                  onClick={
                    score.original
                      ? () => {
                          this.setState({
                            aid: value.aid,
                          })
                          this.toggleChangeModal()
                        }
                      : () => {}
                  }
                >
                  {words.gen_change || 'gen_change'}
                </Link>
              </li>
              <li className="submenu__item">
                <a
                  onClick={() => {
                    this.toggleRemoveModal()
                    this.setState({
                      data,
                    })
                  }}
                  href="javascript:;"
                >
                  {words.gen_remove}
                </a>
              </li>
            </ul>
          }
          words={words}
        />
      )
    })
  }

  render() {
    const { words } = this.props
    const { isChangeActive, aid } = this.state

    let tableColumns = [
      words.gen_title,
      words.gen_composer,
      words.gen_edition,
      words.gen_instrument,
      words.gen_original || 'Original',
      words['gen_auto-cancel_at'],
      words.gen_action || 'Action',
    ]
    let tableColumnExtras = {}
    tableColumnExtras[words.gen_title] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'score__ssid__original_title',
      },
    }
    tableColumnExtras[words.gen_composer] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'score__ssid__original_composer',
      },
    }
    tableColumnExtras[words.gen_edition] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'score__original_edition',
      },
    }
    tableColumnExtras[words.gen_instrument] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'score__original_instrument',
      },
    }
    tableColumnExtras[words.gen_original] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-1 col-sm-1 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'original',
      },
    }
    tableColumnExtras[words['gen_auto-cancel_at']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'expire',
      },
    }
    tableColumnExtras[words.gen_action] = {
      disabled: true,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-1 col-sm-1 col-xs-12 ',
      canSort: false,
      data: {
        sort: 'order__ordered_by',
      },
    }

    const { data } = this.state

    return (
      <div className="full-width">
        {isChangeActive && (
          <ChangeModal
            words={words}
            toggleModal={this.toggleChangeModal}
            isActive={isChangeActive}
            changeLibraryScope={this.changeLibraryScope(aid)}
          />
        )}
        <RemoveModal
          toggleModal={this.toggleRemoveModal}
          onDeleteOptionClick={() => this.onDeleteOptionClick(data)}
          words={words}
          isActive={this.state.isRemoveActive}
        />
        <Table
          columns={tableColumns}
          columnsExtras={tableColumnExtras}
          onHeaderItemClick={this.onTableHeaderItemClick}
          noDataDesc={words.library_empty}
        >
          {this.generateRows()}
        </Table>
      </div>
    )
  }
}

BookList.propTypes = {
  items: PropTypes.array.isRequired,
  onDeleteScore: PropTypes.func.isRequired,
  makeSortRequest: PropTypes.func.isRequired,
  words: PropTypes.object.isRequired,
}

export default BookList

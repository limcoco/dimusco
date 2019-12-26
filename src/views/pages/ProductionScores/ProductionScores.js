import React, { Component, Fragment } from 'react'
import Request from '../../../utils/Request'
import auth from '../../../redux/account/authToken'
import Table from '../../component/Table/Table'
import moment from 'moment'
import SearchInput from '../../component/SearchInput'
import AssignScore from './AssignScore';
import PopoverExampleAnimation from '../../component/Row/Popover';
import RemoveModal from '../dashboard/RemoveModal'
import ChangeModal from '../dashboard/ChangeModal'
import {Link} from 'react-router-dom';

class ProductionScores extends Component {
  state = {
    items: [],
    searchQuery: '',
    ordering: ''
  }

  componentDidMount() {
    this.getProductionScores()
  }

  getProductionScores = () => {
    const {
      match: {
        params: { prid },
      },
    } = this.props
    const {
      ordering,
      searchQuery
    } = this.state;
    
    const headers = {
      Authorization: 'Token ' + auth.getActiveToken(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    Request(
      'get',
      'production-library',
      headers,
      { production: prid, ordering, search: searchQuery  },
      [],
      this.getProductionScoresSuccess,
      this.getProductionScoresFailure
    )
  }

  getProductionScoresSuccess = response => {
    this.setState(state => {
      return { ...state, items: response.data }
    })
  }

  getProductionScoresFailure = error => {
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
      this.getProductionScores()
    })
  }

  handleSearchQueryChange = searchQuery => {
    this.setState({ searchQuery })
  }

  handleSearchQueryClear = () => {
    this.setState({ searchQuery: '' })
  }

  handleSearchSubmit = () => {
    this.getProductionScores()
  }

  onDeleteScore = (data, text) => {
    this.props.deleteLibraryScore(data, this.onDeleteSuccess, this.onDeleteFailed)
    // this.toggleModal('Deleting score')
  }

  onDeleteSuccess = () => {
    this.getProductionScores()
    // this.toggleModal()
  }

  onDeleteFailed = error => {
    console.log({ error }, 'delete score')
  }



  onDeleteOptionClick(data, text) {
    this.onDeleteScore(data)
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

  changeLibraryScope = aid => () => {
    const { changeLibraryScope, history } = this.props
    changeLibraryScope({ assignment: aid }, this.toggleChangeModal, history)
  }


  toggleChangeModal = () => {
    this.setState(prevState => {
      return {
        isChangeActive: !prevState.isChangeActive,
      }
    })
  }

  changeLibraryScope = aid => () => {
    const {
      changeLibraryScope,
      history,
      match: {
        params: { prid },
      }
    } = this.props
    changeLibraryScope({ assignment: aid }, this.toggleChangeModal, history, prid)
  }

    render() {
        const { ActiveLanguageReducer: {words}, match: {params: {prid}} } = this.props
        const { items } = this.state;
        const { isChangeActive, aid, data } = this.state
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
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-1 col-sm-1 col-xs-12 ',
            canSort: false,
            data: {
                sort: 'order__ordered_by',
            },
        }
        
        return (
          <div className='library-page set-price' style={{paddingBottom: '30px'}}>
            <div className='container'>
            <h2>{words.prod_library}</h2>
            <section className="search-area container" style={{ maxWidth: '1180px', paddingBottom: '25px' }}>
                <div className="row search-form-box">
                <div className="col-xs-12 col-sm-12 col-md-12">
                    <SearchInput
                      searchQuery={this.state.searchQuery}
                      words={words}
                      onSubmit={this.handleSearchSubmit}
                      onChange={this.handleSearchQueryChange}
                      onClear={this.handleSearchQueryClear}
                    />
                </div>
                </div>
            </section>
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
            <div className="full-width">
                <Table
                columns={tableColumns}
                columnsExtras={tableColumnExtras}
                onHeaderItemClick={this.onTableHeaderItemClick}
                noDataDesc={words.library_empty}
                >
                    {items.map((item, index) => {
                      const sid = item.original ? item.sid : item.original_sid;
                      return (
                            <li class="standart-container transition-all" key={item.sid}>
                                <a target="_blank" class="no-margin row full-width" href={`/product/copy/${sid}`}>
                                    <div class="col-content col-md-3 col-sm-3 col-xs-12" style={{textDecoration: 'none'}}>
                                        <div class="">
                                            <div class="book-title">{item.title}</div>
                                        </div>
                                    </div>
                                    <div class="col-content col-md-2 col-sm-2 col-xs-12">
                                        <div class="book-title">{item.composer.value}</div>
                                    </div>
                                    <div class="col-content col-md-2 col-sm-2 col-xs-12">
                                        <div class="book-title">{item.edition}</div>
                                    </div>
                                    <div class="col-content col-md-2 col-sm-2 col-xs-12">
                                        <div class="book-title">{item.instrument}</div>
                                    </div>
                                    <div class="col-content col-md-1 col-sm-1 col-xs-12">{item.original ? 'yes' : 'no'}</div>
                                    <div class="col-content col-md-2 col-sm-2 col-xs-12">
                                        <div class="book-title">{moment(item.expire).format('MM.DD.YYYY')}</div>
                                    </div>
                                </a>
                                <div class="dropdown member-menu">
                                    <PopoverExampleAnimation
                                      renderOptions={
                                        <ul className="dropdown member-menu dropdown-popup-content">
                                          <li className="submenu__item">
                                            <Link
                                              to={{
                                                pathname: item.original ? `/production/${prid}/library` : `/mod_page/${item.aid}/`,
                                                state: { ...item, prid }
                                              }}
                                              onClick={
                                                item.original
                                                  ? () => {
                                                      this.setState({
                                                        aid: item.aid,
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
                                                   data: {
                                                     score: item.sid,
                                                     assigment: item.aid,
                                                     index: index,
                                                   },
                                                 })
                                              }}
                                              href="javascript:;"
                                            >
                                              {words.gen_remove}
                                            </a>
                                          </li>
                                        </ul>
                                      }
                                    />
                                </div>
                            </li>
                        )
                    })}
                </Table>
                <div className='buttons-wrp'>
                    <AssignScore
                      prid={prid}
                      words={words}
                      getProductionScores={this.getProductionScores}
                    />
                </div>
            </div>
          </div>
          </div>
        )
      }
}

export default ProductionScores

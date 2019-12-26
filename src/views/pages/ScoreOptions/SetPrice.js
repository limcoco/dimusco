import React from 'react'
import _ from 'lodash/core'
import 'react-datepicker/dist/react-datepicker.css'

import checkSession from '../../../utils/check_session.js'

import PaginationHeader from './components/PaginationHeader'

import Request from '../../../utils/Request.js'
import Table from '../../component/Table/Table.js'
// import Modal from '../../component/Modal/Info';
import SearchInput from '../../component/SearchInput'
import HomeFilters from '../../pages/home/HomeFilters'
import './style.css'
import {Link} from 'react-router-dom';

class SetPriceScreen extends React.Component {
  constructor(props) {
    super(props)

    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)
    this.loggedInPublisher = checkSession.isLoggedIn(props.history, props.PublisherReducer.is_auth)

    this.state = {
      searchQuery: '',
      searchFilterPopupIndex: 0,
      raw_data: [],
      loading: false,
      sid: '',
      // Register
      selected_items: {},
      check_all: false,

      //pagination
      count: null,
      currentPage: 0,
      number_page: 0,
      number_result: 0,
      nextLink: null,
      prevLink: null,
      rpp: 25,

      ordering: null,
      all: false,
      selectedValue: "0",
      score_type: 'preview-state',
      'preview-state': [{value: "0", label: 'state_never'}, {value: "1", label: 'state_logged_in'}],
      'visibility-state': [{value: "0", label: 'state_preliminary'}, {value: "1", label: 'state_active'}, {value: "2", label: 'state_deactivated'}, {value: "3", label: 'state_replaced'}, {value: "4", label: 'state_removed'}]
    }

    this._mounted = false
    this.searchInput = null
  }

  toggleSearchFilterPopup = (index = null) => {
    if (!index || this.state.searchFilterPopupIndex === index) {
      this.setState({
        searchFilterPopupIndex: 0,
      })
    } else {
      this.setState({
        searchFilterPopupIndex: index,
      })
    }
  }


  renderCheckBoxAll = () => {
    const { check_all } = this.state

    return (
      <label className="control control--checkbox ">
        <input type="checkbox" checked={check_all} onChange={this.checkAll} />
        <div className="control__indicator" />
      </label>
    )
  }

  onReadScore = (data, onSuccess) => {
    let payload = {
      // pid : this.props.PublisherReducer.publisher.pid,
      rpp: data && data.rpp ? data.rpp : this.state.rpp,
      search: this.state.searchQuery,
      ordering: data && data.ordering ? data.ordering : 'original_title',
      page: data && data.page ? data.page : 1,
    }
    Request(
      'get',
      'read-score-price',
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      onSuccess || this.onReadScoreSuccess,
      this.onReadScoreFailed
    )
    this.setState({
      loading: true,
    })
  }

  onReadScoreSuccess = response => {
    this.setState({
      isActive: false,
      raw_data: response.data.results,
      count: response.data.count,
      nextLink: response.data.next_url,
      prevLink: response.data.before_url,
      currentPage: response.data.current_page,
      number_page: response.data.number_page,
      number_result: response.data.number_result,
      rpp: response.data.rpp,
      loading: false,
    })
  }

  onReadScoreFailed = err => {
    this.setState({
      loading: false,
    })
  }

  onReadAllscores = () => {
    const {number_result} = this.state;
    this.onReadScore({rpp: number_result}, this.onReadAllScoresSuccess)
  }

  onReadAllScoresSuccess = (response) => {
    const {score_type, selectedValue} = this.state;
    let payload = {}
    // all_scores
    if (score_type === 'preview-state') {
      payload = {preview_options: selectedValue}
    } else if (score_type === 'visibility-state') {
      payload = {state: selectedValue}
    }
    this.setState({
      loading: true,
    })
    Request(
      'patch',
      'update-score-bulk',
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      response.data.results.map((item) => {
        return {
          sid: item.sid,
          state: payload.state ? payload.state : item.state,
          preview_options: payload.preview_options ? payload.preview_options : item.preview_options}
        }),
      [],
      this.onUpadteScoreSuccess,
      this.onUpadteScoreFailed
    )
  }

  hasMount = () => {
    if (this._mounted) {
      this.onReadScore()
    }
  }

  componentDidMount() {
    this._mounted = true
    this.hasMount()
  }

  componentWillUnmount() {
    this._mounted = false
  }

  handleSearchQueryChange = searchQuery => {
    this.setState({ searchQuery })
  }

  handleSearchQueryClear = () => {
    this.setState({ searchQuery: '' })
  }

  handleSearchSubmit = () => {
    this.onReadScore()
  }

  handleComposerClick = data => {
    let { searchQuery } = this.state
    if (data.name.trim() !== '') {
      if (searchQuery.trim() && !searchQuery.endsWith(' ')) {
        searchQuery += ' '
      }
      searchQuery += data.name
      this.setState({ searchQuery: searchQuery })
    }
    this.toggleSearchFilterPopup(0)
    window.scrollTo(0, 0)
  }

  onTableHeaderItemClick = (e, data) => {
    if (data.data === null) return

    let fields = data.data.sort.split(',')
    for (let i = 0; i < fields.length; i++) {
      if (!data.ascending) {
        fields[i] = '-' + fields[i]
      }
    }
    this.setState({ ordering: fields.join(',') })
    let resData = {
      ordering: fields.join(','),
      rpp: this.state.rpp,
    }
    this.onReadScore(resData)
  }

  pagination = page => {
    this.setState({
      rpp: this.state.rpp,
    })
    let resData = {
      order: this.state.sort,
      page: page,
      rpp: this.state.rpp,
    }
    this.onReadScore(resData)
  }

  handlePageClick = data => {
    let selected = data.selected + 1
    this.pagination(selected)
  }

  changeRPP = event => {
    if (event.target.value < 1000 && event.target.value > 0) this.setState({ rpp: event.target.value })
    else if (event.target.value >= 1000) this.setState({ rpp: 999 })
    else if (event.target.value < 1) this.setState({ rpp: 1 })
  }

  callScoresWithRPP = () => {
    let resData = {
      order: this.state.sort,
      page: 1,
      rpp: this.state.rpp,
    }

    this.onReadScore(resData)
  }

  handleAllScores = ({ target: { checked } }) => {
    this.setState({ all: checked })
  }


  handleChangeType = ({target: {value}}) => {
    this.setState({
      score_type: value,
      selectedValue: "0"
    })
  }

  onUpadteScore = () => {
    const {raw_data, score_type, selectedValue, all} = this.state;
    let payload = {}
    // all_scores
    if (score_type === 'preview-state') {
      payload = {preview_options: selectedValue}
    } else if (score_type === 'visibility-state') {
      payload = {state: selectedValue}
    }
    const data = raw_data.filter((item) => item.checked);
    this.setState({
      loading: true,
    })
    if (all) {
      this.onReadAllscores()
    } else {
      if (data.length === 1) {
        Request(
          'patch',
          'update-score',
          { Authorization: 'Token ' + this.props.Token.tokenPublisher },
          payload,
          [data[0].sid],
          this.onUpadteScoreSuccess,
          this.onUpadteScoreFailed
        )
      } else {
        Request(
          'patch',
          'update-score-bulk',
          { Authorization: 'Token ' + this.props.Token.tokenPublisher },
          data.map((item) => {
            return {sid: item.sid, state: payload.state || item.state, preview_options: payload.preview_options || item.preview_options}
          }),
          [],
          this.onUpadteScoreSuccess,
          this.onUpadteScoreFailed
        )
      }
    }
  }

  onUpadteScoreSuccess = () => {
    this.onReadScore()
  }

  onUpadteScoreFailed = err => {
    // this.setState({
    //   source  : "search",
    // })
  }

  chooseScore = ({target: {checked}}, sid) => {
    this.setState((state) => ({
      ...state,
      raw_data: state.raw_data.map((item) => {
        if (item.sid === sid)
        item.checked = checked
        return item
      })
    }))
  }

  selectValue = ({target: {value}}) => {
    this.setState({
      selectedValue: value
    })
  }

  checkAll = ({target: {checked}}) => {
    this.setState((state) => ({
      ...state,
      raw_data: state.raw_data.map((item) => {
        item.checked = checked;
        return item;
      }),
      check_all: checked
    }))
  }

  renderCheckBoxAll = () => {
    const { raw_data } = this.state;
    const checkedArr = raw_data.filter(({checked}) => checked);

    return (
      <label className="control control--checkbox ">
        <input type="checkbox" checked={checkedArr.length === raw_data.length} onChange={this.checkAll} />
        <div className="control__indicator" />
      </label>
    )
  }
  

  render() {
    // Check if login session null or not login
    if (!this.loggedIn) return null

    // Check if session isntitution or not swith to insitution
    if (!this.loggedInPublisher) return null

    const { words, lang } = this.props.ActiveLanguageReducer
    const { count, currentPage, number_page, number_result, rpp } = this.state


    let tableColumns = [
      this.renderCheckBoxAll(),
      words.gen_title,
      words.gen_composer,
      words.gen_instrument,
      words['preview-state'] || 'preview-state',
      words['visibility-state'] || 'visibility-state'
    ]

    let tableColumnExtras = {}
    tableColumnExtras[this.renderCheckBoxAll()] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-1 col-sm-1 col-xs-12 ',
      canSort: false,
    }
    tableColumnExtras[words.gen_title] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'original_title',
      },
    }
    tableColumnExtras[words.gen_composer] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'original_composer',
      },
    }
    tableColumnExtras[words.gen_instrument] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'original_instrument',
      },
    }
    tableColumnExtras[words['preview-state'] || 'preview-state'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12',
      canSort: true,
      data: {
        sort: 'preview_options',
      },
    }
    tableColumnExtras[words['visibility-state'] || 'visibility-state'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12',
      canSort: true,
      data: {
        sort: 'state',
      },
    }


    return (
      <div className={`set-price ${this.state.isActive || (this.state.loading && 'progress')}`}>
        <div className="container">
          <h2>{words.score_options_title || 'score_options_title'}</h2>
          <section className="search-area container-setprice filters-as-popup">
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
            <HomeFilters
              props={this.props}
              activeTabIndex={this.state.searchFilterPopupIndex}
              toggleTab={this.toggleSearchFilterPopup}
              words={words}
              lang={lang}
              handleComposerClick={this.handleComposerClick}
            />
          </section>

          <PaginationHeader
            currentPage={currentPage}
            number_page={number_page}
            handlePageClick={this.handlePageClick}
            words={words}
            number_result={number_result}
            rpp={rpp}
            changeRPP={this.changeRPP}
            callScoresWithRPP={this.callScoresWithRPP}
            marginDisplay={1}
            page_range={2}
            navNull={true}
          />

          <section className="container-setprice">
              <div className="row" style={{ paddingLeft: '3em' }}>
                  <div className="col-md-2">
                    <label className="control control--checkbox">
                      All {number_result}
                      <input type="checkbox" onClick={this.handleAllScores} />
                      <div className="control__indicator" />
                    </label>
                  </div>
                  <div className="col-md-2">
                    <label className="control control--checkbox">
                      {words['preview-state'] || 'preview-state'}
                      <input
                        type="checkbox"
                        value="preview-state"
                        onChange={this.handleChangeType}
                        checked={this.state.score_type === 'preview-state'}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                  <div className="col-md-2">
                    <label className="control control--checkbox">
                      {words['visibility-state'] || 'visibility-state'}
                      <input
                        type="checkbox"
                        value="visibility-state"
                        onChange={this.handleChangeType}
                        checked={this.state.score_type === 'visibility-state'}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                  <div className="col-md-4">
                    <select className='form-control' style={{height: '33px'}} onChange={this.selectValue} value={this.state.selectedValue}>
                      {this.state[this.state.score_type].filter((item) => item.label !== 'state_preliminary')
                      .map((item) => {
                        return (
                          <option key={item.label} value={item.value}>{words[item.label] || item.label}</option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button className='btn black small' onClick={this.onUpadteScore}>{words.gen_change}</button>
                  </div>
              </div>
          </section>


          <section className="container-setprice">
            <div className="row setPrice">
              <Table
                columns={tableColumns}
                columnsExtras={tableColumnExtras}
                onHeaderItemClick={this.onTableHeaderItemClick}
              >
                {this.state.raw_data.map((item) => {
                  const previewState = this.state["visibility-state"].find(({value}) => parseInt(value) === parseInt(item.state)).label;
                  const visibilityState = this.state["preview-state"].find(({value}) => parseInt(value) === parseInt(item.preview_options)).label;
                  return (
                    <li class="transition-all">
                      <div class="pointer no-margin row full-width">
                          <div class="col-content col-body col-md-1 col-sm-1 col-xs-12">
                              <label class="control control--checkbox">
                                  <input
                                    type="checkbox"
                                    onChange={(ev) => this.chooseScore(ev, item.sid)}
                                    checked={item.checked}
                                  />
                                  <div class="control__indicator"></div>
                              </label>
                          </div>
                          <div class="col-content col-body col-md-3 col-sm-3 col-xs-12"><Link target="_blank" to={`/product/${item.sid}`}>{item.play.title}</Link></div>
                          <div class="col-content col-body col-md-3 col-sm-3 col-xs-12">{item.play.composer}</div>
                          <div class="col-content col-body col-md-3 col-sm-3 col-xs-12">{item.instrument}</div>
                          <div class="col-content col-body col-md-3 col-sm-3 col-xs-12">{words[visibilityState] || item.preview_options}</div>
                          <div class="col-content col-body col-md-3 col-sm-3 col-xs-12">{words[previewState] || item.state}</div>
                      </div>
                    </li>
                  )
                })}
              </Table>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default SetPriceScreen

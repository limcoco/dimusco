import React from 'react'
import _ from 'lodash/core'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import checkSession from '../../../utils/check_session.js'

import SetPriceRow from './components/SetPriceRow'
import PaginationHeader from './components/PaginationHeader'

import Request from '../../../utils/Request.js'
import Table from '../../component/Table/Table.js'
import Modal from '../../component/Modal/Info';
import SearchInput from '../../component/SearchInput'
import HomeFilters from '../../pages/home/HomeFilters'
import './style.css'
import config from '../../../config/setting'
import { runInThisContext } from 'vm'

class SetPriceScreen extends React.Component {
  constructor(props) {
    super(props)

    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)
    this.loggedInPublisher = checkSession.isLoggedIn(props.history, props.PublisherReducer.is_auth)

    this.state = {
      searchQuery: '',
      searchFilterPopupIndex: 0,
      from: moment(),
      to: moment('12/31/2099'),
      min_date: moment(),
      type_price: 'otp',
      action: 'add',
      raw_data: [],
      active_id: null,
      active_sub_index: null,
      loading: false,

      // Register
      price: 0,
      currency: 'EUR',
      score: '',
      pid: '',
      spid: '',
      selected_items: {},
      check_all: false,
      bulk_mode: false,

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

  dateChange = date => {
    this.setState({
      from: date,
      to: date,
      min_date: moment(date),
    })
  }

  currencyChange = e => {
    this.setState({ currency: e.target.value })
  }

  handleChangeType = e => {
    this.setState({
      type_price: e.target.value,
      active_id: null,
      action: 'add',
      selected_items: {},
      check_all: false,
    })
    this.onReadScore()
  }

  handleChangeAction = e => {
    this.setState({ action: e.target.value })
  }

  handleAllScores = ({ target: { checked } }) => {
    this.setState({ all: checked })
  }

  validateDate = (date, param = null) => {
    if (date === '') {
      if (param === 'to') {
        return moment('12/31/2099')
      } else if (param === 'from') {
        return moment()
      }
    } else {
      return moment(date)
    }
  }

  singleSelected = (have_price, active_id, data) => {
    if (active_id !== this.state.active_id) {
      this.setState({
        active_id: active_id,
        to: this.validateDate(data.to_date, 'to'),
        from: this.validateDate(data.from_date, 'from'),
        price: data.price,
        score: data.sid,
        pid: data.pid,
      })
    } else {
      this.setState({
        active_id: null,
        price: '',
        score: '',
        pid: '',
      })
    }
  }

  multipleSelected = (checked, selected, data) => {
    const { selected_items } = this.state

    if (checked) {
      selected_items[selected] = data
    } else {
      delete selected_items[selected]
    }
    this.setState({
      selected_items: selected_items,
    })
  }

  checkAll = e => {
    const { raw_data, type_price } = this.state
    let check_all, selected

    if (e.target.checked) {
      check_all = true
      selected = {}

      if (!_.isEmpty(raw_data)) {
        for (let i = 0; i < raw_data.length; i++) {
          if (_.has(raw_data[i], type_price)) {
            for (let j = 0; j < raw_data[i][type_price].length; j++) {
              selected[raw_data[i][type_price][j].pid] = {
                title: raw_data[i].title,
                sid: raw_data[i].sid,
                ...raw_data[i][type_price][j],
              }
            }
          }

          // Exlude sid if have price
          if (raw_data[i][type_price].length === 0) {
            selected[raw_data[i].sid] = raw_data[i]
          }
        }
      }
    } else {
      check_all = false
      selected = {}
    }

    this.setState({
      check_all: check_all,
      selected_items: selected,
    })
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

  generateRow = row => {
    var element = row.map((val, index) => {
      return (
        <SetPriceRow
          index={index}
          key={index}
          activeId={this.state.active_id}
          selectedItems={this.state.selected_items}
          multipleSelected={this.multipleSelected}
          rowData={val}
          singleSelected={this.singleSelected}
          typePrice={this.state.type_price}
        />
      )
    })
    return element
  }

  getGenericID = type => {
    if (type === 'dr' || type === 'otp') {
      if (this.state.pid !== '') {
        return this.state.pid
      } else {
        return this.props.PublisherReducer.publisher.pid
      }
    } else if (type === 'institution') {
      return this.state.spid
    } else if (type === 'so') {
      return this.state.oid
    }
  }

  getUrl = (mode, type) => {
    if (mode === 'read') {
      if (type === 'dr') {
        return 'read-price-dr'
      } else if (type === 'otp') {
        return 'read-price-otp'
      }
    } else if (mode === 'create') {
      if (type === 'dr') {
        return 'create-price-dr'
      } else if (type === 'otp') {
        return 'create-price-otp'
      }
    } else if (mode === 'update') {
      if (type === 'dr') {
        return 'update-price-dr'
      } else if (type === 'otp') {
        return 'update-price-otp'
      }
    } else if (mode === 'delete') {
      if (type === 'dr') {
        return 'delete-price-dr'
      } else if (type === 'otp') {
        return 'delete-price-otp'
      }
    } else if (mode === 'bulk') {
      if (type === 'dr') {
        return 'dr-bulk'
      } else if (type === 'otp') {
        return 'otp-bulk'
      }
    }
  }

  onReadScore = data => {
    let payload = {
      // pid : this.props.PublisherReducer.publisher.pid,
      rpp: data && data.rpp ? data.rpp : this.state.rpp,
      search: this.state.searchQuery,
      ordering: data && data.order ? data.order : 'title',
      page: data && data.page ? data.page : 1,
    }
    this.setState({
      loading: true
    })
    Request(
      'get',
      'read-score-price',
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onReadScoreSuccess,
      this.onReadScoreFailed
    )
  }

  onReadScoreSuccess = response => {
    this.setState({
      loading: false,
      raw_data: response.data.results,
      count: response.data.count,
      nextLink: response.data.next_url,
      prevLink: response.data.before_url,
      currentPage: response.data.current_page,
      number_page: response.data.number_page,
      number_result: response.data.number_result,
      rpp: response.data.rpp,
    })
  }

  onReadScoreFailed = err => {
    // this.setState({
    //   source  : "search",
    // })
  }

  onReadAllScoresAndRegister = data => {
    const {number_result} = this.state;
    let payload = {
      rpp: data && data.rpp ? data.rpp : number_result,
      search: this.state.searchQuery,
      ordering: data && data.order ? data.order : 'title',
      page: data && data.page ? data.page : 1,
    }
    Request(
      'get',
      'read-score-price',
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onReadAllScoresAndRegisterSuccess,
      this.onReadScoreFailed
    )
    this.setState({
      loading: true,
    })
  }

  onReadAllScoresAndRegisterSuccess = response => {
    let payload, url, method
    url = this.getUrl('create', this.state.type_price)
    method = 'post'
    payload = {
      to_date: moment(this.state.to).format(config.DATE_FORMAT),
      from_date: moment(this.state.from).format(config.DATE_FORMAT),
      currency: this.state.currency,
      price: parseFloat(this.state.price),
      score_ids: Object.keys(response.data.results).map(item => {
        return response.data.results[item].sid
      }),
      all_scores: this.state.all,
    }
    this.setState({ loading: true })
    Request(
      method,
      url,
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onRegisterSuccess,
      this.onRegisterFailed
    )
  }

  getScoreIds = () => {
    const { selected_items } = this.state
    return Object.keys(selected_items).map(item => {
      return selected_items[item].sid
    })
  }

  onRegister = (generic_id, type) => {
    const { selected_items } = this.state
    if (this.state.all) {
      this.onReadAllScoresAndRegister()
      return
    }
    let payload, url, method
    url = this.getUrl('create', type)
    method = 'post'
    payload = {
      to_date: moment(this.state.to).format(config.DATE_FORMAT),
      from_date: moment(this.state.from).format(config.DATE_FORMAT),
      currency: this.state.currency,
      price: parseFloat(this.state.price),
      score_ids: this.getScoreIds(),
      all_scores: this.state.all,
    }
    this.setState({ loading: true })
    Request(
      method,
      url,
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onRegisterSuccess,
      this.onRegisterFailed
    )
  }

  onRegisterSuccess = () => {
    this.setState({
      loading: false,
      active_id: null,
      price: '',
      score: '',
      selected_items: {},
      check_all: false,
    })
    let data = {
      page: this.state.currentPage,
    }
    this.onReadScore(data)
  }

  onRegisterFailed = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        this.toggleModal()
      }
    }
    this.setState({ loading: false })
  }

  onReadAllScoresAndUpdate = data => {
    const {number_result} = this.state;
    let payload = {
      rpp: data && data.rpp ? data.rpp : number_result,
      search: this.state.searchQuery,
      ordering: data && data.order ? data.order : 'title',
      page: data && data.page ? data.page : 1,
    }
    Request(
      'get',
      'read-score-price',
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onReadAllScoresAndUpdateSuccess,
      this.onReadScoreFailed
    )
    this.setState({
      loading: true,
    })
  }

  onReadAllScoresAndUpdateSuccess = response => {
    const { selected_items } = this.state

    let payload, url, method
    method = 'put'
    url = this.getUrl('update', this.state.type_price)

    payload = {
      to_date: moment(this.state.to).format(config.DATE_FORMAT),
      from_date: moment(this.state.from).format(config.DATE_FORMAT),
      currency: this.state.currency,
      price: parseFloat(this.state.price),
      score_ids: Object.keys(response.data.results).map(item => {
        return response.data.results[item].sid
      }),
      all_scores: this.state.all,
    }

    this.setState({ loading: true })
    Request(
      method,
      url,
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [this.getGenericID(this.state.type_price)],
      this.onUpdateSuccess,
      this.onUpdateFailed
    )
  }

  onUpdate = (generic_id, type) => {
    const { selected_items } = this.state
    if (this.state.all) {
      this.onReadAllScoresAndUpdate()
      return
    }
    let payload, url, method
    method = 'put'
    url = this.getUrl('update', type)

    payload = {
      to_date: moment(this.state.to).format(config.DATE_FORMAT),
      from_date: moment(this.state.from).format(config.DATE_FORMAT),
      currency: this.state.currency,
      price: parseFloat(this.state.price),
      score_ids: this.getScoreIds(),
      all_scores: this.state.all,
    }

    this.setState({ loading: true })
    Request(
      method,
      url,
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [generic_id],
      this.onUpdateSuccess,
      this.onUpdateFailed
    )
  }

  onUpdateSuccess = () => {
    this.setState({
      loading: false,
      active_id: null,
      score: '',
      price: '',
      selected_items: {},
      check_all: false,
    })

    let data = {
      page: this.state.currentPage,
    }
    this.onReadScore(data)
  }

  onUpdateFailed = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        this.toggleModal()
      }
    }
    this.setState({ loading: false })
  }

  onReadAllScoresAndDelete = data => {
    const {number_result} = this.state;
    let payload = {
      rpp: data && data.rpp ? data.rpp : number_result,
      search: this.state.searchQuery,
      ordering: data && data.order ? data.order : 'title',
      page: data && data.page ? data.page : 1,
    }
    Request(
      'get',
      'read-score-price',
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onReadAllScoresAndDeleteSuccess,
      this.onReadScoreFailed
    )
    this.setState({
      loading: true,
    })
  }

  onReadAllScoresAndDeleteSuccess = response => {
    const { selected_items } = this.state

    let method, payload, url
    method = 'patch'
    url = this.getUrl('delete', this.state.type_price)
    payload = {
      to_date: moment(this.state.to).format(config.DATE_FORMAT),
      from_date: moment(this.state.from).format(config.DATE_FORMAT),
      currency: this.state.currency,
      price: parseFloat(this.state.price),
      score_ids: Object.keys(response.data.results).map(item => {
        return response.data.results[item].sid
      }),
      all_scores: this.state.all,
    }
    this.setState({ loading: true })

    Request(
      method,
      url,
      {
        Authorization: 'Token ' + this.props.Token.tokenPublisher,
        'Content-Type': 'application/json',
      },
      payload,
      [],
      this.onDeleteSuccess,
      this.onDeleteFailed
    )
  }

  onDelete = (generic_id, type) => {
    const { selected_items } = this.state
    if (this.state.all) {
      this.onReadAllScoresAndDelete()
      return
    }
    let method, payload, url
    method = 'patch'
    url = this.getUrl('delete', type)
    payload = {
      to_date: moment(this.state.to).format(config.DATE_FORMAT),
      from_date: moment(this.state.from).format(config.DATE_FORMAT),
      currency: this.state.currency,
      price: parseFloat(this.state.price),
      score_ids: this.getScoreIds(),
      all_scores: this.state.all,
    }
    this.setState({ loading: true })

    Request(
      method,
      url,
      {
        Authorization: 'Token ' + this.props.Token.tokenPublisher,
        'Content-Type': 'application/json',
      },
      payload,
      [],
      this.onDeleteSuccess,
      this.onDeleteFailed
    )
  }

  onDeleteSuccess = () => {
    this.setState({
      loading: false,
      active_id: null,
      score: '',
      selected_items: {},
      check_all: false,
    })

    let data = {
      page: this.state.currentPage,
    }

    this.onReadScore(data)
  }

  onDeleteFailed = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        this.toggleModal()
      }
    }
    this.setState({ loading: false })
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

  delete = event => {
    event.preventDefault()
    this.setState({ searchQuery: '' })
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

  renderRow = () => {
    const { raw_data } = this.state

    if (raw_data.length) return this.generateRow(raw_data)

    return (
      <tr>
        <td colSpan={100}>
          <p className="grey text-center">Data Empty</p>
        </td>
      </tr>
    )
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
      order: fields.join(','),
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

  toggleModal = () => {
    this.setState({
      isActive: !this.state.isActive,
    })
  }

  render() {
    // Check if login session null or not login
    if (!this.loggedIn) return null

    // Check if session isntitution or not swith to insitution
    if (!this.loggedInPublisher) return null

    const { words, lang } = this.props.ActiveLanguageReducer
    const { code } = this.props.ActiveCurrencyReducer
    const { action, type_price, loading } = this.state
    const { count, currentPage, number_page, number_result, rpp } = this.state

    let button

    const { data } = this.props.LanguageReducer
    let currencies = []
    if (data) {
      currencies = data.currencies
    }

    if (action === 'add') {
      button = (
        <button
          className="btn black"
          onClick={() => this.onRegister(this.getGenericID(type_price), type_price)}
          disabled={loading}
        >
          {words.gen_add}
        </button>
      )
    } else if (action === 'replace') {
      button = (
        <button
          className="btn black"
          onClick={() => this.onUpdate(this.getGenericID(type_price), type_price)}
          disabled={loading}
        >
          {words.gen_replace}
        </button>
      )
    } else if (action === 'remove') {
      button = (
        <button
          className="btn black"
          onClick={() => this.onDelete(this.getGenericID(type_price), type_price)}
          disabled={loading}
        >
          {words.gen_remove}
        </button>
      )
    } else {
      button = (
        <button className="btn black" disabled>
          {words.setprice_change}
        </button>
      )
    }

    let tableColumns = [
      this.renderCheckBoxAll(),
      words.gen_title,
      words.gen_composer,
      words.gen_instrument,
      words.gen_from,
      words.gen_to,
      words.gen_price,
      words.gen_currency,
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
    tableColumnExtras[words.gen_from] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
      canSort: true,
      data: {
        sort: 'from',
      },
    }
    tableColumnExtras[words.gen_to] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
      canSort: true,
      data: {
        sort: 'to',
      },
    }
    tableColumnExtras[words.gen_price] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
      canSort: true,
      data: {
        sort: 'price',
      },
    }
    tableColumnExtras[words.gen_currency] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
      canSort: true,
      data: {
        sort: 'currency',
      },
    }

    return (
      <div className={`set-price ${this.state.loading && 'progress'}`}>
        <div className="container">
          <h2>{words.general_prices}</h2>
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
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-6">
                <div className="row" style={{ paddingLeft: '3em' }}>
                  <div className="col-md-4">
                    <label className="control control--checkbox">
                      All {number_result}
                      <input type="checkbox" onClick={this.handleAllScores} />
                      <div className="control__indicator" />
                    </label>
                  </div>
                  <div className="col-md-4">
                    <label className="control control--checkbox">
                      {words.gen_ot}
                      <input
                        type="checkbox"
                        value="otp"
                        onChange={this.handleChangeType}
                        checked={this.state.type_price === 'otp'}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                  <div className="col-md-4">
                    <label className="control control--checkbox">
                      {words.gen_dr}
                      <input
                        type="checkbox"
                        value="dr"
                        onChange={this.handleChangeType}
                        checked={this.state.type_price === 'dr'}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6">
                <div className="row" style={{ paddingLeft: '3em' }}>
                  <div className="col-md-4">
                    <label className="control control--checkbox">
                      {words.gen_add}
                      <input
                        type="checkbox"
                        value="add"
                        onClick={this.handleChangeAction}
                        checked={this.state.action === 'add'}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                  <div className="col-md-4">
                    <label className="control control--checkbox">
                      {words.gen_replace}
                      <input
                        type="checkbox"
                        value="replace"
                        onClick={this.handleChangeAction}
                        checked={this.state.action === 'replace'}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                  <div className="col-md-4">
                    <label className="control control--checkbox">
                      {words.gen_remove}
                      <input
                        type="checkbox"
                        value="remove"
                        onClick={this.handleChangeAction}
                        checked={this.state.action === 'remove'}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container-setprice">
            <div className="row setPrice">
              <Modal
                info={words.gen_no_rights || 'gen_no_rights'}
                small
                toggleModal={this.toggleModal}
                isActive={this.state.isActive}
              />
              <Table
                columns={tableColumns}
                columnsExtras={tableColumnExtras}
                onHeaderItemClick={this.onTableHeaderItemClick}
              >
                {this.renderRow()}
              </Table>
            </div>
          </section>

          <section className="container-setprice">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-10" key="xp">
                <div className="contain-check contain-type-from-to">
                  <div className="form-ft">
                    <label>{words.setprice_label_from}</label>
                    <DatePicker
                      selected={this.state.from}
                      onChange={this.dateChange}
                      minDate={moment()}
                      disabled={this.state.action === 'remove'}
                    />
                  </div>
                  <div className="form-ft">
                    <label>{words.setprice_label_to}</label>
                    <DatePicker
                      selected={this.state.to}
                      onChange={date => this.setState({ to: date })}
                      minDate={this.state.min_date}
                      disabled={this.state.action === 'remove'}
                    />
                  </div>
                  <div className="form-ft">
                    <label>{words.setprice_label_currency}</label>
                    <div className="select">
                      <select
                        className="color-black"
                        onChange={this.currencyChange}
                        disabled={this.state.action === 'remove'}
                        value={this.state.currency}
                      >
                        {currencies.length > 0
                          ? currencies.map(data => <option value={data.code}>{data.code}</option>)
                          : ''}
                      </select>
                      <div className="select__arrow" />
                    </div>
                  </div>
                  <div className="form-ft">
                    <label className="mr-8-i">{words.setprice_label_price}</label>
                    <input
                      type="number"
                      max={99999}
                      min={0}
                      className="max-150 padding-input"
                      value={this.state.price || ''}
                      onChange={e => this.setState({ price: e.target.value })}
                      disabled={this.state.action === 'remove'}
                    />
                  </div>
                </div>
              </div>
              <div className="center-content no-padding col-xs-12 col-sm-6 col-md-2">{button}</div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default SetPriceScreen

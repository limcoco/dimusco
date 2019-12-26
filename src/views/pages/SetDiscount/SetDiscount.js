import React from 'react'
import _ from 'lodash/core'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import checkSession from '../../../utils/check_session.js'

import SetDiscountRow from '../product/component/SetDiscountRow.js'
import DiscountRow from '../product/component/DiscountRow.js'

import Request from '../../../utils/Request.js'
import Table from '../../component/Table/Table.js'
import './style.css'
import SearchInput from '../../component/SearchInput'
import HomeFilters from '../../pages/home/HomeFilters'

class SetDiscountScreen extends React.Component {
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
      type_price: 'so',
      action: 'add',
      raw_data: '',
      active_id: null,
      active_sub_index: null,
      loading: false,

      // Register
      price: 0,
      score: '',
      pid: '',
      oid: '',
      spid: '',
      selected_items: {},
      check_all: false,
      bulk_mode: false,

      //pagination
      count: null,
      currentPage: 0,
      number_page: 0,
      nextLink: null,
      prevLink: null,
      rpp: 999,

      sort: null,
    }

    this._mounted = false
    this.searchInput = null
  }

  dateChange = date => {
    this.setState({
      from: date,
      to: date,
      min_date: moment(date),
    })
  }

  handleChangeType = e => {
    this.setState({
      type_price: e.target.value,
      active_id: null,
      action: null,
      selected_items: {},
      check_all: false,
    })
    this.onReadScore()
  }

  handleChangeAction = e => {
    this.setState({ action: e.target.value })
  }

  validateDate = date => {
    if (date === '') {
      return moment()
    } else {
      return moment(date)
    }
  }

  singleSelected = (have_price, active_id, data) => {
    if (active_id !== this.state.active_id) {
      this.setState({
        active_id: active_id,
        to: this.validateDate(data.to_date),
        from: this.validateDate(data.from_date),
        price: data.price,
        score: data.score,
        oid: data.oid,
      })
    } else {
      this.setState({
        active_id: null,
        price: '',
        score: '',
        oid: '',
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
              selected[raw_data[i][type_price][j].oid] = {
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
        <SetDiscountRow
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

  getUrl = mode => {
    if (mode === 'read') {
      return 'read-score-price'
    } else if (mode === 'create') {
      return 'create-price-so'
    } else if (mode === 'update') {
      return 'update-price-so'
    } else if (mode === 'delete') {
      return 'delete-price-so'
    } else if (mode === 'bulk') {
      return 'so-bulk'
    }
  }

  onReadScore = data => {
    let payload = {
      // pid : this.props.PublisherReducer.publisher.pid,
      rpp: data && data.rpp ? data.rpp : this.state.rpp,
      q: this.state.searchQuery,
      sort: data && data.order ? data.order : '',
      // page: data && data.page ? data.page : 1
    }

    Request(
      'get',
      this.getUrl('read'),
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onReadScoreSuccess,
      this.onReadScoreFailed
    )
  }

  onReadScoreSuccess = response => {
    this.setState({
      raw_data: response.data.results,
      count: response.data.number_result,
      nextLink: response.data.next_url,
      prevLink: response.data.before_url,
      currentPage: response.data.current_page,
      number_page: response.data.number_page,
      rpp: response.data.rpp,
    })
  }

  onReadScoreFailed = err => {
    // this.setState({
    //   source  : "search",
    // })
  }

  getPayloadBulk = () => {
    const { selected_items } = this.state
    let tmp = []
    for (let i in selected_items) {
      if (this.state.check_all) {
        // If have PID
        if (selected_items[i].hasOwnProperty('oid') && this.state.action != 'add') {
          tmp.push({
            oid: selected_items[i].oid,
            title: selected_items[i].title,
            to_date: moment(this.state.to).format('YYYY-MM-DD'),
            from_date: moment(this.state.from).format('YYYY-MM-DD'),
            currency: this.state.currency,
            discount: this.state.price,
          })
        } else {
          tmp.push({
            score: selected_items[i].sid,
            title: selected_items[i].title,
            to_date: moment(this.state.to).format('YYYY-MM-DD'),
            from_date: moment(this.state.from).format('YYYY-MM-DD'),
            currency: this.state.currency,
            discount: this.state.price,
          })
        }
      } else {
        // If have PID
        if (selected_items[i]['oid'] !== '' && this.state.action != 'add') {
          tmp.push({
            oid: selected_items[i].oid,
            title: selected_items[i].title,
            to_date: moment(this.state.to).format('YYYY-MM-DD'),
            from_date: moment(this.state.from).format('YYYY-MM-DD'),
            currency: this.state.currency,
            discount: this.state.price,
          })
        } else {
          tmp.push({
            score: selected_items[i].sid,
            title: selected_items[i].title,
            to_date: moment(this.state.to).format('YYYY-MM-DD'),
            from_date: moment(this.state.from).format('YYYY-MM-DD'),
            currency: this.state.currency,
            discount: this.state.price,
          })
        }
      }
    }
    return tmp
  }

  onRegister = (generic_id, type) => {
    const { selected_items } = this.state
    let payload, url

    if (_.isEmpty(selected_items)) {
      if (this.state.score === '') {
        return
      } else if (this.state.price < 1 || this.state.price === '' || this.state.price === undefined) {
        return
      }

      url = this.getUrl('create')
      payload = {
        to_date: moment(this.state.to).format('YYYY-MM-DD'),
        from_date: moment(this.state.from).format('YYYY-MM-DD'),
        price: this.state.price,
        score: this.state.score,
      }
    } else {
      url = this.getUrl('bulk')

      payload = {
        so: JSON.stringify(this.getPayloadBulk()),
      }
    }

    this.setState({ loading: true })

    Request(
      'post',
      url,
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [generic_id],
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
    })
    this.onReadScore()
  }

  onRegisterFailed = err => {
    this.setState({ loading: false })
  }

  // UPDATE
  onUpdate = (generic_id, type) => {
    const { selected_items } = this.state

    let payload, url, method

    if (_.isEmpty(selected_items)) {
      if (this.state.score === '') {
        return
      } else if (this.state.price < 1 || this.state.price === '' || this.state.price === undefined) {
        return
      }

      method = 'patch'
      url = this.getUrl('update')

      payload = {
        to_date: moment(this.state.to).format('YYYY-MM-DD'),
        from_date: moment(this.state.from).format('YYYY-MM-DD'),
        price: this.state.price,
      }
    } else {
      method = 'post'
      url = this.getUrl('bulk')
      payload = {
        so: JSON.stringify(this.getPayloadBulk()),
      }
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
    this.onReadScore()
    this.setState({
      loading: false,
      active_id: null,
      score: '',
      price: '',
      selected_items: {},
    })
  }

  onUpdateFailed = () => {
    this.setState({ loading: false })
  }

  onDelete = (generic_id, type) => {
    const { selected_items } = this.state

    let payload, url, gid

    if (_.isEmpty(selected_items)) {
      if (this.state.score === '') {
        return
      }

      url = this.getUrl('delete')
      gid = generic_id
      payload = {}
    } else {
      url = this.getUrl('bulk')
      gid = ''
      payload = {
        so: JSON.stringify(this.getPayloadBulk()),
      }
    }

    this.setState({ loading: true })
    Request(
      'delete',
      url,
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [gid],
      this.onDeleteSuccess,
      this.onDeleteFailed
    )
  }

  onDeleteSuccess = () => {
    this.setState({
      loading: false,
      active_id: null,
      score: '',
    })
    this.onReadScore()
  }

  onDeleteFailed = () => {
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
    this.toggleSearchFilterPopup()
    window.scrollTo(0, 0)
  }

  renderRow = () => {
    const { raw_data } = this.state

    if (typeof raw_data === 'undefined') {
      return (
        <tr>
          <td colSpan={100}>
            <p className="grey text-center">Data Empty</p>
          </td>
        </tr>
      )
    } else {
      if (raw_data.length === 0) {
        return (
          <tr>
            <td colSpan={100}>
              <p className="grey text-center">Data Empty</p>
            </td>
          </tr>
        )
      } else {
        return this.generateRow(raw_data)
      }
    }
  }

  newgenerateRow = () => {
    const { raw_data } = this.state

    if (typeof raw_data === 'undefined') {
      return (
        <tr>
          <td colSpan={100}>
            <p className="grey text-center">Data Empty</p>
          </td>
        </tr>
      )
    } else {
      if (raw_data.length === 0) {
        return (
          <tr>
            <td colSpan={100}>
              <p className="grey text-center">Data Empty</p>
            </td>
          </tr>
        )
      } else {
        var element = raw_data.map((val, index) => {
          return (
            <DiscountRow
              index={index}
              key={index}
              activeId={this.state.active_id}
              selectedItems={this.state.selected_items}
              rowData={val}
              typePrice={this.state.type_price}
            />
          )
        })
        return element
      }
    }
  }

  onTableHeaderItemClick = (e, data) => {
    if (data.data === null) return

    let fields = data.data.sort.split(',')
    for (let i = 0; i < fields.length; i++) {
      if (!data.ascending) {
        fields[i] = '-' + fields[i]
      }
    }
    this.setState({ sort: fields.join(',') })
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
    this.setState({ rpp: event.target.value })
    let resData = {
      order: this.state.sort,
      page: 1,
      rpp: event.target.value,
    }

    this.onReadScore(resData)
  }

  delete = event => {
    event.preventDefault()
    this.setState({ searchQuery: '' })
  }

  render() {
    // Check if login session null or not login
    if (!this.loggedIn) return null

    // Check if session isntitution or not swith to insitution
    if (!this.loggedInPublisher) return null

    const { words, lang } = this.props.ActiveLanguageReducer
    const { action, type_price, loading } = this.state
    const { count, currentPage, nextLink, prevLink, number_page } = this.state

    let button

    if (action === 'add') {
      button = (
        <button
          className="btn-change-price"
          onClick={() => this.onRegister(this.getGenericID(type_price), type_price)}
          disabled={loading}
        >
          Add
        </button>
      )
    } else if (action === 'replace') {
      button = (
        <button
          className="btn-change-price"
          onClick={() => this.onUpdate(this.getGenericID(type_price), type_price)}
          disabled={loading}
        >
          Replace
        </button>
      )
    } else if (action === 'remove') {
      button = (
        <button
          className="btn-change-price"
          onClick={() => this.onDelete(this.getGenericID(type_price), type_price)}
          disabled={loading}
        >
          Remove
        </button>
      )
    } else {
      button = (
        <button className="btn-change-price" disabled>
          {words.gen_change}
        </button>
      )
    }

    let tableColumns = [
      this.renderCheckBoxAll(),
      words.setdiscount_table_title,
      words.setdiscount_table_composer,
      words.setdiscount_table_instrument,
      words.setdiscount_table_from,
      words.setdiscount_table_to,
      words.setdiscount_table_discount,
    ]

    let tableColumnExtras = {}
    tableColumnExtras[this.renderCheckBoxAll()] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-1 col-sm-1 col-xs-12 ',
      canSort: false,
    }
    tableColumnExtras[words.setdiscount_table_title] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'title',
      },
    }
    tableColumnExtras[words.setdiscount_table_composer] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'composer',
      },
    }
    tableColumnExtras[words.setdiscount_table_instrument] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'instrument',
      },
    }
    tableColumnExtras[words.setdiscount_table_from] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
      canSort: true,
      data: {
        sort: 'from',
      },
    }
    tableColumnExtras[words.setdiscount_table_to] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
      canSort: true,
      data: {
        sort: 'to',
      },
    }
    tableColumnExtras[words.setdiscount_table_discount] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
      canSort: true,
      data: {
        sort: 'discount',
      },
    }

    let tableColumns1 = [
      words.setdiscount_table_title,
      'OT / DR',
      words.setdiscount_table_from,
      words.setdiscount_table_to,
      words.setdiscount_table_discount,
    ]

    let tableColumnExtras1 = {}
    tableColumnExtras1[words.setdiscount_table_title] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-7 col-sm-7 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'title',
      },
    }
    tableColumnExtras1['OT / DR'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width',
      canSort: false,
      data: {
        sort: 'ot',
      },
    }
    tableColumnExtras1[words.setdiscount_table_from] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width',
      canSort: true,
      data: {
        sort: 'from',
      },
    }
    tableColumnExtras1[words.setdiscount_table_to] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width',
      canSort: true,
      data: {
        sort: 'to',
      },
    }
    tableColumnExtras1[words.setdiscount_table_discount] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width',
      canSort: true,
      data: {
        sort: 'discount',
      },
    }

    return (
      <div className="set-price">
        <div className="container">
          <section className="search-area">
            <div className="row title">{words.header_set_discount}</div>
          </section>
          <section className="container-setdiscount">
            <div className="row discountTable setDiscount">
              <Table
                columns={tableColumns1}
                columnsExtras={tableColumnExtras1}
                onHeaderItemClick={this.onTableHeaderItemClick1}
              >
                {this.newgenerateRow()}
              </Table>
            </div>
          </section>

          <section className="container-setdiscount">
            <div className="row discount-form">
              <div className="col-xs-12 col-sm-6 col-md-12" key="xp">
                <div className="contain-check contain-type-from-to">
                  <div className="custom-form">
                    <label>{words.setdiscount_label_title}</label>
                    <input
                      type="text"
                      className="padding-input textbox-input"
                      value={this.state.title || ''}
                      onChange={e => this.setState({ title: e.target.value })}
                      disabled={this.state.action === 'remove'}
                    />
                  </div>
                  <div className="custom-form">
                    <label>OT / DR</label>
                    <input
                      type="text"
                      className="padding-input"
                      style={{ width: '80px' }}
                      value={this.state.ot || ''}
                      onChange={e => this.setState({ ot: e.target.value })}
                      disabled={this.state.action === 'remove'}
                    />
                  </div>
                  <div className="custom-form">
                    <label>{words.setdiscount_label_from}</label>
                    <DatePicker
                      selected={this.state.from}
                      onChange={this.dateChange}
                      minDate={moment()}
                      disabled={this.state.action === 'remove'}
                    />
                  </div>
                  <div className="custom-form">
                    <label>{words.setdiscount_label_to}</label>
                    <DatePicker
                      selected={this.state.to}
                      onChange={date => this.setState({ to: date })}
                      minDate={this.state.min_date}
                      disabled={this.state.action === 'remove'}
                    />
                  </div>
                  <div className="custom-form">
                    <label className="mr-8-i">{words.setdiscount_label_discount}</label>
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
                  <div className="text-right">
                    <button className="btn black small">{words.setdiscount_button_delete}</button>
                    <button className="btn black small">{words.setdiscount_button_create}</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container-setdiscount">
            <div className="row setDiscount">
              <Table
                columns={tableColumns}
                columnsExtras={tableColumnExtras}
                onHeaderItemClick={this.onTableHeaderItemClick}
              >
                {this.renderRow()}
              </Table>
            </div>
            <div className="row discount-form">
              <div className="col-xs-12 col-sm-6 col-md-12 text-right">
                <button
                  className="btn black small"
                  onClick={() => this.onDelete(this.getGenericID(type_price), type_price)}
                  disabled={loading}
                >
                  {words.setdiscount_button_delete}
                </button>
                <button
                  className="btn black small"
                  onClick={() => this.onUpdate(this.getGenericID(type_price), type_price)}
                  disabled={loading}
                >
                  {words.setdiscount_button_update}
                </button>
              </div>
            </div>
          </section>

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

          <section className="container-setdiscount">
            <div className="row setDiscount">
              <Table
                columns={tableColumns}
                columnsExtras={tableColumnExtras}
                onHeaderItemClick={this.onTableHeaderItemClick}
              >
                {this.renderRow()}
              </Table>
            </div>
            <div className="row discount-form">
              <div className="col-xs-12 col-sm-6 col-md-12 text-right">
                <button
                  className="btn black"
                  onClick={() => this.onRegister(this.getGenericID(type_price), type_price)}
                  disabled={loading}
                >
                  {words.setdiscount_button_add}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default SetDiscountScreen

import React from 'react'
import _ from 'lodash/core'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import PubLibraryRow from '../product/component/PubLibraryRow.js'
import Table from '../../component/Table/Table.js'
import SearchInput from '../../component/SearchInput'
import HomeFilters from '../../pages/home/HomeFilters'
import PaginationHeader from '../../pages/SetPrice/components/PaginationHeader'

import checkSession from '../../../utils/check_session.js'
import Request from '../../../utils/Request.js'

class PubLibraryScreen extends React.Component {
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
      showModal: false,

      // Register
      price: 0,
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
      nextLink: null,
      prevLink: null,
      rpp: 25,
      number_result: 0,
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

  toggleModal = infoMsg => this.setState({ showModal: !this.state.showModal, infoMsg })

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
          selected[raw_data[i].sid] = raw_data[i]
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
        <PubLibraryRow
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

  onReadScore = data => {
    let payload = {
      // pid : this.props.PublisherReducer.publisher.pid,
      rpp: data && data.rpp ? data.rpp : this.state.rpp,
      q: this.state.searchQuery,
      sort: data && data.order ? data.order : '',
      page: data && data.page ? data.page : 1,
    }
    Request(
      'get',
      'read-pub-library',
      { Authorization: 'Token ' + this.props.Token.tokenPublisher },
      payload,
      [],
      this.onReadScoreSuccess,
      this.onReadScoreFailed
    )
    this.toggleModal()
  }

  onReadScoreSuccess = response => {
    this.setState({
      raw_data: response.data.results,
      number_result: response.data.number_result,
      nextLink: response.data.next_url,
      prevLink: response.data.before_url,
      currentPage: response.data.current_page,
      number_page: response.data.number_page,
      rpp: response.data.rpp,
      showModal: false,
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
      tmp.push({
        score: selected_items[i].sid,
        title: selected_items[i].title,
        pid: selected_items[i].pid,
        to_date: moment(this.state.to).format('YYYY-MM-DD'),
        from_date: moment(this.state.from).format('YYYY-MM-DD'),
        price: this.state.price,
      })
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

      url = this.getUrl('create', type)
      payload = {
        to_date: moment(this.state.to).format('YYYY-MM-DD'),
        from_date: moment(this.state.from).format('YYYY-MM-DD'),
        price: this.state.price,
        score: this.state.score,
      }
    } else {
      url = this.getUrl('bulk', type)

      payload = {
        prices: JSON.stringify(this.getPayloadBulk()),
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
    let data = {
      page: this.state.currentPage,
    }
    this.onReadScore(data)
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
      url = this.getUrl('update', type)

      payload = {
        to_date: moment(this.state.to).format('YYYY-MM-DD'),
        from_date: moment(this.state.from).format('YYYY-MM-DD'),
        price: this.state.price,
      }
    } else {
      method = 'post'
      url = this.getUrl('bulk', type)
      payload = {
        prices: JSON.stringify(this.getPayloadBulk()),
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
    this.setState({
      loading: false,
      active_id: null,
      score: '',
      price: '',
      selected_items: {},
    })

    let data = {
      page: this.state.currentPage,
    }
    this.onReadScore(data)
  }

  onUpdateFailed = () => {
    this.setState({ loading: false })
  }

  onDelete = (generic_id, type) => {
    const { selected_items } = this.state

    let method, payload, url, gid

    if (_.isEmpty(selected_items)) {
      if (this.state.score === '') {
        return
      }
      method = 'delete'
      url = this.getUrl('delete', type)
      gid = generic_id
      payload = {}
    } else {
      method = 'post'
      url = this.getUrl('bulk', type)
      gid = ''
      payload = {
        prices: JSON.stringify(this.getPayloadBulk()),
      }
    }

    this.setState({ loading: true })
    Request(
      method,
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

    let data = {
      page: this.state.currentPage,
    }

    this.onReadScore(data)
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

  keyPress = event => {
    if (event.key === 'Enter') {
      this.handleSubmit(event)
    }
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
    this.toggleSearchFilterPopup()
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

  callScoresWithRPP = () => {
    let resData = {
      order: this.state.sort,
      page: 1,
      rpp: this.state.rpp,
    }

    this.onReadScore(resData)
  }

  render() {
    // Check if login session null or not login
    if (!this.loggedIn) return null

    // Check if session isntitution or not swith to insitution
    if (!this.loggedInPublisher) return null

    const { words, lang } = this.props.ActiveLanguageReducer
    const { currentPage, number_page, number_result, rpp } = this.state

    let tableColumns = [
      words.gen_title,
      words.gen_composer,
      words.gen_instrument,
      words.gen_edition,
      words.gen_category,
      words['gen_uploaded-by'],
    ]

    let tableColumnExtras = {}
    tableColumnExtras[words.gen_title] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'title',
      },
    }
    tableColumnExtras[words.gen_composer] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'composer',
      },
    }
    tableColumnExtras[words.gen_instrument] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'instrument',
      },
    }
    tableColumnExtras[words.gen_edition] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12',
      canSort: true,
      data: {
        sort: 'edition',
      },
    }
    tableColumnExtras[words.gen_category] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12',
      canSort: true,
      data: {
        sort: 'category',
      },
    }
    tableColumnExtras[words['gen_uploaded-by']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12',
      canSort: true,
      data: {
        sort: '',
      },
    }

    return (
      <div className={`set-price ${this.state.showModal && 'progress'}`}>
        <div className="container">
          <h2>{words.gen_library}</h2>
          <section className="search-area filters-as-popup">
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
          </section>

          <section className="container-publibrary">
            <div className="row pubLibrary">
              {/* <InfoModal
                small
                toggleModal={this.toggleModal}
                isActive={this.state.showModal}
              >
                <img
                  src="media/images/icon/loading.gif"
                  width="80"
                  height="80"
                  style={{ marginBottom: '30px' }}
                />
              </InfoModal> */}
              <Table
                columns={tableColumns}
                columnsExtras={tableColumnExtras}
                onHeaderItemClick={this.onTableHeaderItemClick}
              >
                {this.renderRow()}
              </Table>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default PubLibraryScreen

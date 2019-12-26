import React, { Component } from 'react'

import auth from '../../../redux/account/authToken.js'
import Request from '../../../utils/Request.js'

import SearchInput from '../../component/SearchInput'
import ListView from '../../component/Listview/List.js'
import ScoreRow from '../../component/Row/PurchasedScoreRow.js'
// import { InfoModal } from '../../component/Modal';
import Radio from '../../component/Radio'
import RightContent from './component/RightContent'

class InstitutionLibrary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],

      groups: [],
      unregisteredGroups: [],

      members: [],
      unregisteredMembers: [],

      loadingRegistered: false,
      loadingUnregistered: false,

      showAddGroup: false,
      showAddMember: false,
      activeScoreIndex: -1,

      upload_toggle: true,
      showModal: false,
      screen: 'scores',

      searchQuery: '',
    }

    this.token = auth.getActiveToken()
  }

  toggleModal = infoMsg => this.setState({ showModal: !this.state.showModal, infoMsg })

  componentDidMount() {
    this.toggleModal()
    this.onReadPurchased('', '')
  }

  gotoSetPrice = () => {
    this.props.history.push('/pub-prices')
  }

  gotoSetDiscount = () => {
    this.props.history.push('/pub-discount')
  }

  gotoPubLibrary = () => {
    this.props.history.push('/pub-library')
  }

  handleSearchQueryChange = searchQuery => {
    this.setState({ searchQuery })
  }

  handleSearchQueryClear = () => {
    this.setState({ searchQuery: '' })
  }

  handleSearchSubmit = () => {
    this.setState({
      activeScoreIndex: -1,
      groups: [],
      unregisteredGroups: [],
      members: [],
      unregisteredMembers: [],
    })
    this.onReadPurchased(this.state.searchQuery)
    this.toggleModal()
  }

  toggle = (key, value) => {
    let nextVal = this.state[key]

    if (nextVal === undefined) {
      return
    }

    if (typeof nextVal !== 'boolean') {
      return
    }

    if (value === undefined) {
      nextVal = !nextVal
    }

    if (typeof value !== 'boolean') {
      return
    } else {
      nextVal = value
    }

    let incomingState = {}
    incomingState[key] = nextVal
    this.setState(incomingState)
  }

  onRequestFailed = error => {
    if (error && error.response && error.response.data && error.response.data.details) {
      this.toggleModal(error.response.data.details)
    }
    // console.error(error.message)
  }

  onReadPurchased = (search = '', order = '') => {
    this.toggleModal()
    Request(
      'get',
      'library-read',
      { Authorization: 'Token ' + this.token },
      { ordering: order, search: search },
      [],
      this.onReadPurchasedSuccess,
      this.onRequestFailed
    )
  }

  onReadPurchasedSuccess = response => {
    this.setState({
      items: response.data.results,
    })
    this.toggleModal()
    if (response.data.results.length > 0) {
      this.handleScoreClick(undefined, response.data)
    }
  }

  onReadPurchasedFailed = error => {
    if (error && error.response && error.response.data && error.response.data.details) {
      this.toggleModal(error.response.data.details)
    }
  }

  onReadAssignment = (data, search, order) => {
    let assignment_id = data.aid

    Request(
      'get',
      'purchase-assigned-read',
      { Authorization: 'Token ' + this.token },
      { ordering: order, search: search },
      [assignment_id],
      this.onReadAssignmentSuccess,
      this.onRequestFailed
    )
  }

  onReadAssignmentSuccess = response => {
    console.log(response.data)
    this.setState({
      groups: response.data.groups,
      members: response.data.users,
    })
  }

  onReadAssignmentFailed = error => {}

  onReadUnregistered = data => {
    Request(
      'get',
      'purchase-assign',
      { Authorization: 'Token ' + this.token },
      { assignment: data.aid },
      [],
      this.onReadUnregisteredSuccess,
      this.onRequestFailed
    )
  }

  onReadUnregisteredSuccess = response => {
    this.setState({
      unregisteredGroups: response.data.groups,
      unregisteredMembers: response.data.users,
    })
  }

  onReadUnregisteredFailed = error => {}

  onAssign = (index, data) => {
    const { activeScoreIndex, items } = this.state
    let payload = {
      assignment: items[activeScoreIndex].aid,
    }

    payload[data.type] = data.id

    Request(
      'post',
      'purchase-assign',
      { Authorization: 'Token ' + this.token },
      payload,
      [],
      this.onAssignSuccess,
      this.onRequestFailed,
      { requested: data, index: index }
    )
  }

  onAssignSuccess = (response, extra) => {
    let { unregisteredGroups, groups, unregisteredMembers, members } = this.state
    if (extra.requested.type === 'group') {
      let tmp = unregisteredGroups.splice(extra.index, 1)
      tmp[0].aid = response.data.aid
      groups = groups.concat(tmp)
    } else {
      let tmp = unregisteredMembers.splice(extra.index, 1)
      tmp[0].aid = response.data.aid
      members = members.concat(tmp)
    }

    this.setState({
      groups: this.sortData(groups),
      unregisteredGroups: this.sortData(unregisteredGroups),
      members: this.sortData(members),
      unregisteredMembers: this.sortData(unregisteredMembers),
    })
  }

  onUnassign = (index, data) => {
    const { groups, members } = this.state
    let aid = null

    if (data.type === 'group') {
      aid = groups[index].aid
    } else {
      aid = members[index].aid
    }

    Request(
      'patch',
      'purchase-unassign',
      { Authorization: 'Token ' + this.token },
      {},
      [aid],
      this.onUnassignSuccess,
      this.onRequestFailed,
      { requested: data, index: index }
    )
  }

  onUnassignSuccess = (response, extra) => {
    let { unregisteredGroups, groups, unregisteredMembers, members } = this.state
    if (extra.requested.type === 'group') {
      let tmp = groups.splice(extra.index, 1)
      delete tmp[0].aid
      unregisteredGroups = unregisteredGroups.concat(tmp)
    } else {
      let tmp = members.splice(extra.index, 1)
      delete tmp[0].aid
      unregisteredMembers = unregisteredMembers.concat(tmp)
    }

    this.setState({
      groups: this.sortData(groups),
      unregisteredGroups: this.sortData(unregisteredGroups),
      members: this.sortData(members),
      unregisteredMembers: this.sortData(unregisteredMembers),
    })
  }

  onAssignError = error => {}

  handleScoreClick = (index, extra) => {
    const { words } = this.props.ActiveLanguageReducer

    let data = null
    if (index === undefined) {
      index = 0
      data = extra[index]
    } else {
      const { items } = this.state
      data = items[index]
    }

    const { activeScoreIndex } = this.state
    if (index !== activeScoreIndex) {
      this.onReadAssignment(data)
      this.onReadUnregistered(data)

      this.setState({
        activeScoreIndex: index,
      })
    }
  }

  sortData = data => {
    console.log(data)
    if (data.length > 0) {
      data.sort(function(a, b) {
        var nameA = a.name.toLowerCase()
        var nameB = b.name.toLowerCase()

        if (nameA < nameB)
          //sort string ascending
          return -1
        if (nameA > nameB) return 1
        return 0 //default return value (no sorting)
      })
    }
    return data
  }

  generateRow = row => {
    var element = row.map((val, index) => {
      return (
        <ScoreRow
          key={index}
          index={index}
          data={val}
          load={this.onReadPurchased}
          active={this.state.activeScoreIndex === index}
          onClick={this.handleScoreClick}
          words={this.props.ActiveLanguageReducer.words}
        />
      )
    })
    return element
  }

  renderRow = () => {
    const { items } = this.state
    if (items.length >= 0) {
      return this.generateRow(items)
    }
  }

  handleScreen = ({ value, name }) => {
    this.setState({
      [name]: value,
    })
  }

  render() {
    const {
      groups,
      unregisteredGroups,
      members,
      unregisteredMembers,
      activeScoreIndex,
      showModal,
      infoMsg,
    } = this.state

    const { words } = this.props.ActiveLanguageReducer

    return (
      <React.Fragment>
        {/* <InfoModal
          small
          headline={words.gen_library}
          info={infoMsg}
          toggleModal={this.toggleModal}
          isActive={showModal}
        >
          <img
            src="media/images/icon/loading.gif"
            width="80"
            height="80"
            style={{ marginBottom: '30px' }}
          />
        </InfoModal> */}
        <section className={`product-content institution-library ${showModal && 'progress'}`}>
          <div className="container-fluid">
            {/* TITLE */}
            <div className="musinote-center institution-name-header">
              <h3 className="no-margin no-padding full-width library-title">{words.gen_library}</h3>
            </div>

            {/* END TITLE */}
            {/* SEARCH */}
            <div className="container e-i-search-input-wrapper">
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
            </div>
            {/* </div> */}
            {/* END SEARCH */}

            {/* CONTENT */}
            <div className="container">
              <div className="row library-border">
                <div className="col-md-5 col-sm-12 col-xs-12">
                  <div className="radios-wrp">
                    <Radio
                      label={words.library_scores}
                      name="screen"
                      checked={this.state.screen === 'scores'}
                      value="scores"
                      onChange={this.handleScreen}
                    />
                    <Radio
                      label="Plays"
                      name="screen"
                      checked={this.state.screen === 'plays'}
                      value="plays"
                      onChange={this.handleScreen}
                      disabled
                    />
                  </div>
                  <div className="row">
                    <ListView emptyMessage={words.library_score_empty} className="no-margin no-padding col-xs-12">
                      {this.renderRow()}
                    </ListView>
                  </div>
                </div>
                <RightContent
                  groups={groups}
                  unregisteredGroups={unregisteredGroups}
                  members={members}
                  unregisteredMembers={unregisteredMembers}
                  activeScoreIndex={activeScoreIndex}
                  onAssign={this.onAssign}
                  onUnassign={this.onUnassign}
                  words={words}
                />
              </div>
            </div>
          </div>

          {/*<Uplaod
        toggle = {this.state.toggle_upload}
        toggleAction = {this.toggleUplaod}
      />*/}
        </section>
      </React.Fragment>
    )
  }
}

export default InstitutionLibrary

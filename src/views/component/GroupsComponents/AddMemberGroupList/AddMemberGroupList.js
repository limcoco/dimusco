import React, { Fragment } from "react"
import classnames from "classnames"

import Presenter from "../../../../institution/presenter"
import Request from "../../../../institution/utils/request.js"

import PubPresenter from "../../../../publisher/presenter.js"
import PubRequest from "../../../../publisher/utils/request.js"

import EnsPresenter from "../../../../ensemble/presenter.js"
import EnsRequest from "../../../../ensemble/utils/request.js"

import PresenterGroup from "../../../../group/presenter.js"
import RequestGroup from "../../../../group/utils/request.js"

import checkSession from "../../../../utils/check_session.js"

import AddMemberGroupRow from "./AddMemberGroupRow"

import UserSearch from "../../userSearch.js"
import Animated from "../../animated.js"
import { UserList } from "../../animation.js"
import InfoModal from '../../Modal/Info';

export default class AddMemberGroupList extends React.Component {
  constructor(props) {
    super(props)

    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)

    this.state = {
      isLoading: true,
      isLoadingLoadMore: false,
      isError: false,
      rowElement: null,
      count: 0,
      toggleSearch: false,
      expanded: false,
      groupID: this.props.groupID,
      groupName: this.props.groupName,
      mode: this.props.mode,
      activeMember: {},
      rawData: [],
      presenter: this.props.type === 'institution' ? Presenter :
        this.props.type === 'publisher' ? PubPresenter :
        this.props.type === 'ensemble' ? EnsPresenter : Presenter,
      request: this.props.type === 'institution' ? Request :
        this.props.type === 'publisher' ? PubRequest :
        this.props.type === 'ensemble' ? EnsRequest : Request 
    }

    // Pagination
    this.limit = 0
    this.currentPage = 0
    this.nextLink = null
    this.prevLink = null
    this.processing = true

    // Read Member to Add
    this.onReadMember = this.onReadMember.bind(this)
    this.onReadMemberSuccess = this.onReadMemberSuccess.bind(this)
    this.onReadMemberFailed = this.onReadMemberFailed.bind(this)

    // Read Administrator
    this.onReadAdministratorSuccess = this.onReadAdministratorSuccess.bind(this)
    this.onReadAdministratorFailed = this.onReadAdministratorFailed.bind(this)

    // Read member from group
    this.onReadMemberGroup = this.onReadMemberGroup.bind(this)
    this.onReadMemberGroupSuccess = this.onReadMemberGroupSuccess.bind(this)
    this.onReadMemberGroupFailed = this.onReadMemberGroupFailed.bind(this)

    // Add member to group
    this.onAddMemberToGroup = this.onAddMemberToGroup.bind(this)
    this.onAddMemberToGroupSuccess = this.onAddMemberToGroupSuccess.bind(this)
    this.onAddMemberToGroupFailed = this.onAddMemberToGroupFailed.bind(this)

    // Add member to administator
    this.onAddAdministratorSuccess = this.onAddAdministratorSuccess.bind(this)
    this.onAddAdministratorFailed = this.onAddAdministratorFailed.bind(this)

    // Remove member from group
    this.onRemoveMember = this.onRemoveMember.bind(this)
    this.onRemoveMemberSuccess = this.onRemoveMemberSuccess.bind(this)
    this.onRemoveMemberFailed = this.onRemoveMemberFailed.bind(this)

    this.onRemoveAdministratorSuccess = this.onRemoveAdministratorSuccess.bind(this)
    this.onRemoveAdministratorFailed = this.onRemoveAdministratorFailed.bind(this)

    this.onChange = this.onChange.bind(this)

    this.toggleSearch = this.toggleSearch.bind(this)
    this.reloadMember = this.reloadMember.bind(this)

    this.expand = this.expand.bind(this)
    this.collapse = this.collapse.bind(this)

    this.close = this.close.bind(this)

  }

  toggleSearch() {
    this.setState({ toggleSearch: !this.state.toggleSearch })
  }

  reloadMember() {
    this.onReadMember()
  }

  expand(e) {
    this.setState({ expanded: true })
  }

  collapse(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      this.setState({ expanded: false })
    } else {
      this.timer = setTimeout(() => {
        this.setState({ expanded: false })
      }, 200)
    }
  }

  // Add member to group
  onAddMemberToGroup(uid) {
    const { groupID } = this.props
    const { presenter, request } = this.state;

    if (groupID === "administrator") {

      // add member to group administartor
      presenter.MakeAdministrator(
        request.MakeAdministrator(uid, this, this.onAddAdministratorSuccess, this.onAddAdministratorFailed)
      )

    } else {

      // add member to other group
      presenter.AddMemberToGroup(
        request.AddMemberToGroup(uid, this, this.onAddMemberToGroupSuccess, this.onAddMemberToGroupFailed)
      )
    }

  }

  onAddAdministratorSuccess(params, response) {
    this.props.setCounterFor("administrator_increment")
  }

  onAddAdministratorFailed(error) {
    this.toggleMsgModal(false)
  }

  onAddMemberToGroupSuccess(params, response) {
    this.onReadMember("", 1, this.state.groupID)
    this.props.onRecounterOtherGroup("increment")
    this.props.setIsUpdate(true)
  }

  onAddMemberToGroupFailed(error) {
    this.toggleMsgModal(false)
  }

  // Read member from group all to added on group
  onReadMember(search, page, gid) {
    const { presenter, request } = this.state;
    presenter.ReadMemberGroup(
      request.ReadMemberGroup(search, page, gid, this, this.onReadMemberSuccess, this.onReadMemberFailed)
    )
  }

  onReadMemberSuccess(params, response) {
    response.data.results = this.sortData(response.data.results);

    if (response.data.current === 1) {
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: response.data.count,
        rowElement: this.generateRow(response.data.results),
        rawData: response.data.results,
        search: ""
      })
    } else {
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: response.data.count,
        rawData: response.data.results,
        rowElement: [...this.state.rowElement, ...this.generateRow(response.data.results)],
        search: ""
      })
    }

    // Pagination
    this.limit = response.data.results.length
    this.currentPage = response.data.current
    this.nextLink = response.data.next
    this.prevLink = response.data.previous
    this.processing = false
  }

  onReadMemberFailed(error) {
    this.toggleMsgModal(false)
  }

  generateRow(row) {
    const { words } = this.props
    var element = row.map((val, index) => {
      return (
        <AddMemberGroupRow
          rowData={val}
          key={val.uid + index}
          history={this.props.history}
          addMemberToGroup={this.onAddMemberToGroup}
          groupID={this.props.groupID}
          mode={this.props.mode}
          removeMember={this.onRemoveMember}
          index={index}
          InstitutionReducer={this.props.InstitutionReducer}
          words={words}
          onReadMemberGroup={() => this.onReadMemberGroup(this.state.search, this.currentPage, this.state.groupID)}
          setActiveMember={this.setActiveMember}
          active={this.state.activeMember.uid}
        />
      )
    })
    return element
  }

  // Read Members from group And Administrator
  onReadMemberGroup(search, page, gid) {
    const { presenter, request } = this.state;
    if (gid === "administrator") {
      presenter.ReadAdministrator(
        request.ReadAdministrator(search, page, this, this.onReadAdministratorSuccess, this.onReadAdministratorFailed)
      )
    } else {

      PresenterGroup.ReadMember(
        RequestGroup.ReadMember(search, page, gid, this, this.onReadMemberGroupSuccess, this.onReadMemberGroupFailed)
      )

    }
  }

  // Read member from group Administrator
  onReadAdministratorSuccess(params, response) {

    response.data.results = this.sortData(response.data.results);

    if (response.data.current === 1) {
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: response.data.count,
        rowElement: this.generateRow(response.data.results),
        rawData: response.data.results,
        search: ""
      })
    } else {
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: response.data.count,
        rawData: response.data.results,
        rowElement: [...this.state.rowElement, ...this.generateRow(response.data.results)],
        search: ""
      })
    }

    // Pagination
    this.limit = response.data.results.length
    this.currentPage = response.data.current
    this.nextLink = response.data.next
    this.prevLink = response.data.previous
    this.processing = false
  }

  onReadAdministratorFailed() {
    this.toggleMsgModal(false)
  }

  // Read member from group other
  onReadMemberGroupSuccess(params, response) {
    let count = response.data.count

    response.data.results = this.sortData(response.data.results);

    if (response.data.current === 1) {
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: count,
        rowElement: this.generateRow(response.data.results),
        rawData: response.data.results,
        search: ""
      })
    } else {
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: count,
        rawData: response.data.results,
        rowElement: [...this.state.rowElement, ...this.generateRow(response.data.results)],
        search: ""
      })
    }
    // Pagination

    this.limit = response.data.results.length
    this.currentPage = response.data.current
    this.nextLink = response.data.next
    this.prevLink = response.data.previous
    this.processing = false
  }

  onReadMemberGroupFailed(error) {
    this.toggleMsgModal(false)
    this.setState({
      isLoading: false,
      isError: true,
    })
  }

  // Remove member and administator from group
  onRemoveMember(uid) {
    const { groupID } = this.state
    const { presenter, request } = this.state;

    if (groupID === "administrator") {
      this.props.setCounterFor("administrator")

      presenter.RemoveAdministrator(
        request.RemoveAdministrator(uid, this, this.onRemoveAdministratorSuccess, this.onRemoveAdministratorFailed)
      )
    } else {

      PresenterGroup.RemoveMember(
        RequestGroup.RemoveMember(uid, this, this.onRemoveMemberSuccess, this.onRemoveMemberFailed)
      )
    }
  }

  // remove member
  onRemoveMemberSuccess(params, response) {
    this.onReadMemberGroup(this.state.search, this.currentPage, this.state.groupID)

    this.props.onRecounterOtherGroup("decrement")
    this.props.setIsUpdate(true)
  }

  onRemoveMemberFailed(error) {
    this.toggleMsgModal(false)
  }

  // remove administator
  onRemoveAdministratorSuccess(params, response) {
    this.onReadMemberGroup(this.state.search, this.currentPage, this.state.groupID)
    // Decrement counter
    this.props.setCounterFor("administrator_decrement")
  }

  // remove administator
  onRemoveAdministratorFailed(error) {
    this.toggleMsgModal(false)
  }

  loadingLoadMore() {
    const { words } = this.props
    if (this.state.isLoadingLoadMore) {
      return (
        <div className="text-center loading-text">
          <span>{words.loading}...</span>
        </div>
      )
    } else {
      return (null)
    }
  }

  handleScroll = (event) => {
    let offset = event.currentTarget.scrollTop
    let height = event.currentTarget.offsetHeight + (window.innerHeight - 500)

    if (this.processing)
      return false

    if (offset >= height) {
      this.processing = true
      if (this.nextLink !== null) {
        let nextPage = this.currentPage + 1
        this.setState({
          isLoadingLoadMore: true
        })

        if (this.props.groupID === "administrator") {

          if (this.props.mode === "add") {
            // read member to add
            this.onReadMember("", nextPage, "administrator")
          }

          if (this.props.mode === "show") {
            // read member from group
            this.onReadMemberGroup("", nextPage, this.props.groupID)
          }

        } else {

          if (this.props.mode === "add") {
            // read member to add
            this.onReadMember("", nextPage, this.props.groupID)
          }

          if (this.props.mode === "show") {
            // read member from group
            this.onReadMemberGroup("", nextPage, this.props.groupID)
          }

        }
      }
      return
    }
  }

  sortData(data) {
    if (data.length > 0) {
      data.sort(function (a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();

        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      });
    }

    return data;
  }

  onChange(search) {
    this.setState({
      isLoading: true,
      search: search
    })

    if (this.props.groupID === "administrator") {
      this.onReadMemberGroup(search, 1, "administrator")
    } else {
      this.onReadMemberGroup(search, 1, this.props.groupID)
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupID !== null && nextProps.groupID !== undefined) {

      if (nextProps.mode === "add") {

        this.onReadMember("", 1, nextProps.groupID)

        this.setState({
          // isLoading: true,
          groupID: nextProps.groupID,
          groupName: nextProps.groupName
        })

      }

      if (nextProps.mode === "show") {
        this.onReadMemberGroup("", 1, nextProps.groupID)

        this.setState({
          // isLoading: true,
          groupID: nextProps.groupID,
          groupName: nextProps.groupName
        })
      }
    }
  }

  close() {
    this.props.close()
  }

  componentDidMount() {
    clearTimeout(this.timer)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  renderMenu() {
    const { words } = this.props
    return (
      <div className="dropdown-content">
        <span className="caret-black" style={{ "right": "20px" }}></span>
        <a tabIndex="0" role="button" onClick={() => this.props.setMode("add")}>{words['gen_group_add-member']}</a>
      </div>
    )
  }

  addMember = (e) => {
    e.stopPropagation()
    this.props.openAddMemberToGroup()
  }

  setActiveMember = (activeMember) => {
    this.setState({
      activeMember
    })
  }

  toggleMsgModal = (isSuccessful) => {
    this.setState((state) => ({
      ...state,
      msgActive: !state.msgActive,
      isSuccessful
    }))
  }

  render() {
    if (!this.loggedIn) return (null)

    const {
      isLoading,
      isError,
      rowElement,
      count,
      groupName,
      activeMember,
      msgActive,
      isSuccessful
    } = this.state

    const { show, mode, words } = this.props

    return (
      <Fragment>
        <InfoModal
            small
            headline={''}
            info={isSuccessful? words.popup_return_good : words.popup_return_bad}
            toggleModal={this.toggleMsgModal}
            isActive={msgActive}
        />
        <div className={classnames("hide", { "show": show })}>
          <div className="gi-header">
            <div className="gi-title">{words.gen_members}</div>
            <div className='action-buttons'>
              {/* <a tabIndex="0" role="button"><img src='/media/images/edit.png' width='18' height='18' /></a> */}
              <a tabIndex="0" role="button" onClick={this.addMember}><img src='/media/images/add.png' width='15' height='15' /></a>
              <a onClick={()=>this.onRemoveMember(activeMember.uid)}><img src='/media/images/remove.png' width='15' height='15' /></a>
            </div>
          </div>
          {mode === "add" ?
            <div className="add-member-to-group">
              {/*<span>{words['gen_group_add-member']} <a className="gname">{groupName}</a></span> */}
              <span>{words['gen_group_add-member']}</span>
              <i className="material-icons" onClick={this.close}>close</i>
            </div>
            : null}
          <div className="row center-xs">
            <div className="col-xs-12">
              <div className="box">
                <UserSearch
                  className="search-member"
                  onChange={this.onChange}
                  placeholder={words.institution_field_member_name}
                  toggle={this.state.toggleSearch}
                  rtl={true}
                />
                <ul className={classnames("member-list")} onScroll={this.handleScroll}>
                  <Animated total={5} loading={isLoading} error={isError} count={count} text={words.institution_member_empty} animation={<UserList />}>
                    {this.generateRow(this.state.rawData)}
                  </Animated>
                  {this.loadingLoadMore()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

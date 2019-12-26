import React from "react"
import classnames from "classnames"

import Presenter from "../../../../institution/presenter.js"
import Request from "../../../../institution/utils/request.js"

import checkSession from "../../../../utils/check_session.js"

import MemberRow from "./MemberRow"
import AddMember from "./AddMember.js"

import UserSearch from "../../../component/userSearch.js"
import Animated from "../../../component/animated.js"
import { UserList } from "../../../component/animation.js"

export default class MemberList extends React.Component {
  constructor(props) {
    super(props)

    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)

    this.state = {
      isLoading: true,
      isLoadingLoadMore: false,
      isError: false,
      rowElement: null,
      rawData: [],
      count: 0,
      toggleSearch: false,
      toggleAddMember: false,
      expanded: false,
      activeMember: {}
    }

    // Pagination
    this.limit = 0
    this.currentPage = 0
    this.nextLink = null
    this.prevLink = null
    this.processing = true

    this.onReadMemberSuccess = this.onReadMemberSuccess.bind(this)
    this.onReadMemberFailed = this.onReadMemberFailed.bind(this)

    this.onChange = this.onChange.bind(this)

    this.onRemoveMember = this.onRemoveMember.bind(this)
    this.onRemoveMemberSuccess = this.onRemoveMemberSuccess.bind(this)
    this.onRemoveMemberFailed = this.onRemoveMemberFailed.bind(this)

    this.toggleSearch = this.toggleSearch.bind(this)
    this.toggleAddMember = this.toggleAddMember.bind(this)
    this.reloadMember = this.reloadMember.bind(this)

    this.expand = this.expand.bind(this)
    this.collapse = this.collapse.bind(this)

  }

  toggleSearch = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch })
  }

  toggleAddMember = () => {
    this.setState({ toggleAddMember: !this.state.toggleAddMember })
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

  // Read
  onReadMember(search, page) {
    Presenter.ReadMember(
      Request.ReadMember(search, page, this, this.onReadMemberSuccess, this.onReadMemberFailed)
    )
  }

  onReadMemberSuccess(params, response) {

    if (response.data.results.length > 0) {
      response.data.results.sort(function (a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();

        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      });
    }

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
      let { rawData } = this.state
      rawData = rawData.concat(response.data.results)
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: response.data.count,
        rowElement: [...this.state.rowElement, ...this.generateRow(response.data.results)],
        rawData: rawData,
        search: ""
      })
    }

    // Pagination
    this.limit = response.data.results.length
    this.currentPage = response.data.current
    this.nextLink = response.data.next
    this.prevLink = response.data.previous
    this.processing = false

    // update counter
    this.props.updateMemberCount(response.data.count)
    // this.props.reloadMember(false) 
  }

  onReadMemberFailed(error) {
  }

  // Remove
  onRemoveMember(email) {
    Presenter.RemoveMember(
      Request.RemoveMember(email, this, this.onRemoveMemberSuccess, this.onRemoveMemberFailed)
    )
  }

  onRemoveMemberSuccess(params, response) {
    const { words } = this.props
    this.onReadMember()
  }

  onRemoveMemberFailed(error) {
  }

  generateRow(row) {
    const { words, groupID } = this.props
    var element = row.map((val, index) => {
      return (
        <MemberRow
          rowData={val}
          groupID={groupID}
          key={val.uid + index}
          history={this.props.history}
          removeMember={this.onRemoveMember}
          InstitutionReducer={this.props.InstitutionReducer}
          words={words}
          onReadMember={() => this.onReadMember()}
          setActiveMember={this.setActiveMember}
          active={this.state.activeMember.uid}
        />
      )
    })
    return element
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

        this.onReadMember("", nextPage)
      }
      return
    }
  }

  onChange(search) {
    this.setState({
      isLoading: true,
      search: search
    })
    this.onReadMember(search)
  }

  componentDidMount() {
    clearTimeout(this.timer)
    this.onReadMember()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  renderMenu() {
    const { words } = this.props
    return (
      <div className="dropdown-content">
        <span className="caret-black" style={{ "right": "20px" }}></span>
        {/*<a tabIndex="0" role="button" onClick={()=>this.props.toggle()}>{words['gen_group_add-member']}</a>*/}
        <a tabIndex="0" role="button" onClick={() => this.toggleAddMember()}>{words['gen_group_add-member']}</a>
      </div>
    )
  }

  addMember = (e) => {
    e.stopPropagation()

    this.props.closeAddMemberGroup()
    this.props.toggle()
  }

  setActiveMember = (activeMember) => {
    this.setState({
      activeMember
    })
  }

  render() {
    if (!this.loggedIn) return (null)

    const {
      isLoading,
      count,
      activeMember
    } = this.state

    const { showAddMemberGroup, words } = this.props
    return (
      <div className={classnames("hide", { "show": !showAddMemberGroup })}>
        <div className="gi-header">
          <div className="gi-title">{words.gen_members}</div>
          <div className='action-buttons'>
            {/* <a tabIndex="0" role="button"><img src='/media/images/edit.png' width='18' height='18' /></a> */}
            <a tabIndex="0" role="button" onClick={this.addMember}><img src='/media/images/add.png' width='15' height='15' /></a>
            <a onClick={()=>this.onRemoveMember(activeMember.email)}><img src='/media/images/remove.png' width='15' height='15' /></a>
          </div>
        </div>
        <div className="row center-xs">
          <div className="col-xs-12">
            <div className="box">
              <UserSearch
                className="search-member"
                onChange={this.onChange}
                placeholder="Type member name..."
                toggle={this.state.toggleSearch}
                rtl={true}
                words={words}
              />
              <AddMember
                {...this.props}
                show={this.props.open}
                toggle={this.props.toggle}
                reloadMember={this.reloadMember}
                Presenter={Presenter}
                Request={Request}
                words={words}
              />
              <ul className={classnames("member-list", { "hide": this.props.show })} onScroll={this.handleScroll}>
                <Animated total={5} loading={isLoading} count={count} text={words.institution_member_empty} animation={<UserList />}>
                  {this.generateRow(this.state.rawData)}
                </Animated>
                {this.loadingLoadMore()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

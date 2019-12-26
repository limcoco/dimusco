import React, { Fragment } from "react";

import Presenter from "../../../../group/presenter.js";
import Request from "../../../../group/utils/request.js";
import checkSession from "../../../../utils/check_session.js";

import GroupRow from "./GroupRow.js";

import AdministratorGroup from "./AdministratorGroup.js";
import AllGroup from "./AllGroup.js";

import Animated from "../../animated.js";
import UserSearch from "../../userSearch.js";
import { UserList } from "../../animation.js";
import InfoModal from '../../Modal/Info';

export default class GroupList extends React.Component {
  constructor(props) {
    super(props)

    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)

    this.state = {
      isLoading: true,
      isLoadingLoadMore: false,
      isError: false,
      rowElement: [],
      rawData: [],
      count: 0,
      memberCount: 0,
      toggleSearch: false,
      toggleAddGroup: false,
      expanded: false,

      key: null,
      name_group: "",
      active: "all",
      newAdded: '',
      name: this.props.words['gen_group_new-group'],
      is_loading: false,
      in_update: false,
      setActiveGroup: {}
    }

    // Pagination
    this.limit = 0
    this.currentPage = 0
    this.nextLink = null
    this.prevLink = null
    this.processing = true
    this.is_proses = true

    this.onReadSuccess = this.onReadSuccess.bind(this)
    this.onReadFailed = this.onReadFailed.bind(this)

    this.onChange = this.onChange.bind(this)

    this.onRemoveGroup = this.onRemoveGroup.bind(this)
    this.onRemoveGroupSuccess = this.onRemoveGroupSuccess.bind(this)
    this.onRemoveGroupFailed = this.onRemoveGroupFailed.bind(this)

    this.toggleSearch = this.toggleSearch.bind(this)
    this.toggleAddGroup = this.toggleAddGroup.bind(this)
    this.reloadGroup = this.reloadGroup.bind(this)

    this.expand = this.expand.bind(this)
    this.collapse = this.collapse.bind(this)
    this.generateRow = this.generateRow.bind(this)

    this.onAddMemberGroup = this.onAddMemberGroup.bind(this)

    this.onRegister = this.onRegister.bind(this)
    this.onRegisterSuccess = this.onRegisterSuccess.bind(this)
    this.onRegisterFailed = this.onRegisterFailed.bind(this)

    this.sortData = this.sortData.bind(this)

  }

  toggleSearch = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch })
  }

  toggleAddGroup = (gid) => {

    this.setState({ toggleAddGroup: !this.state.toggleAddGroup, in_update: true })
    this.onRegister(gid)


  }

  closeUpdate = () => {
    this.setState({
      in_update: false
    })
  }

  reloadGroup() {
    this.onRead()
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

  // Read List Group
  onRead(search, page) {
    Presenter.Read(
      Request.Read(search, page, this, this.onReadSuccess, this.onReadFailed)
    )
  }

  onReadSuccess(params, response) {
    if (response.data.current === 1) {
      this.setState({
        isLoading: false,
        isError: false,
        isLoadingLoadMore: false,
        count: response.data.count,
        rowElement: this.displayGroups(response.data.results),
        rawData: response.data.results,
        search: ""
      })
    } else {
      let { rawData } = this.state
      rawData = rawData.concat(response.data.results)
      this.setState({
        isLoading: false,
        isLoadingLoadMore: false,
        isError: false,
        count: response.data.count,
        rowElement: [...this.state.rowElement, ...this.displayGroups(response.data.results)],
        rawData: rawData,
        search: "",
      })
    }

    // Pagination
    this.limit = response.data.results.length
    this.currentPage = response.data.current
    this.nextLink = response.data.next
    this.prevLink = response.data.previous
    this.processing = false

    this.sortData();
  }

  onReadFailed(error) {
  }

  // Remove Group
  onRemoveGroup(gid) {
    Presenter.RemoveGroup(
      Request.RemoveGroup(gid, this, this.onRemoveGroupSuccess, this.onRemoveGroupFailed)
    )
  }

  onRemoveGroupSuccess(params, response) {
    this.onRead()
    this.closeUpdate()
  }

  onRemoveGroupFailed(error) {
    this.toggleMsgModal(false)
  }

  onRegister(gid) {
    // const {Presenter, Request} = this.props

    this.handleDuplicate = false

    this.setState({
      is_loading: true
    })

    Presenter.Register(
      Request.Register(gid ? {gid, ...this} : this, this.onRegisterSuccess, this.onRegisterFailed)
    )
  }

  onRegisterSuccess(params, response) {
    this.setState({
      name: this.props.words['gen_group_new-group'],
      is_loading: false,
      active: response.data.gid,
      newAdded: response.data.gid,
      setActiveGroup: response.data
    })
    this.is_proses = true
    this.reloadGroup()
    this.scrollToBottom()

    // comment this, for add new group it will acutofocus
    // this.props.toggle()

    // after create group success, automatic will show member of new group
    this.onAddMemberGroup(response.data.gid)
    this.props.setGroupName(response.data.name)
    this.props.setMode("show")
  }

  onRegisterFailed(error) {
    this.toggleMsgModal(false)
    this.setState({
      is_loading: false
    })
    this.is_proses = true
  }

  onAddMemberGroup(gid, defaultGroup = false) {
    let allElement = this.state.rowElement
    let selectedElement = null

    for (let index in allElement) {
      let item = allElement[index]
      if (item.key === this.state.active) {
        allElement[index] = this.renewElement(item, gid)
      }

      if (item.key === gid) {
        allElement[index] = this.renewElement(item, gid)
        selectedElement = allElement[index]
      }
    }

    this.setState({ active: gid, rowElement: allElement })

    if (defaultGroup) {
      this.props.openAddMemberGroup(gid, selectedElement)
    }
  }

  renewElement(data, gid) {
    const { words } = this.props
    if (data.key === "all") {
      return <AllGroup {...this.props}
        show={this.props.show}
        toggle={this.props.toggle}
        count={this.props.memberCount}
        onAddMemberGroup={this.onAddMemberGroup}
        key={"all"}
        active={gid}
        words={words}
      />
    } else if (data.key === "administrator") {
      return <AdministratorGroup {...this.props}
        onAddMemberGroup={this.onAddMemberGroup}
        active={gid}
        key={"administrator"}
        words={words}
      />
    } else {
      return <GroupRow {...this.props}
        rowData={data.props.rowData}
        key={data.props.rowData.gid}
        history={this.props.history}
        removeGroup={this.onRemoveGroup}
        setGroupName={this.props.setGroupName}
        setMode={this.props.setMode}
        countMember={data.props.rowData.number_of_members}
        onAddMemberGroup={this.onAddMemberGroup}
        counterFor={this.props.counterFor}
        active={gid}
        InstitutionReducer={this.props.InstitutionReducer}
        openGroupRight={this.props.onOpenPermission}
        words={words}
        in_update={this.state.in_update}
        sortData={this.sortData}
        toggleAddGroup={this.toggleAddGroup}
        allowDrop={this.allowDrop}
        drag={this.drag}
        drop={this.drop}
      />
    }
  }

  generateRow(val) {
    const { words } = this.props
    return (
      <Fragment>
        <GroupRow {...this.props}
          rowData={val}
          key={val.gid}
          history={this.props.history}
          removeGroup={this.onRemoveGroup}
          setGroupName={this.props.setGroupName}
          setMode={this.props.setMode}
          countMember={val.number_of_members}
          onAddMemberGroup={this.onAddMemberGroup}
          counterFor={this.props.counterFor}
          active={this.state.active}
          memberCounterGroup={this.props.memberCounterGroup}
          InstitutionReducer={this.props.InstitutionReducer}
          openGroupRight={this.props.onOpenPermission}
          words={words}
          sortData={this.sortData}
          toggleAddGroup={this.toggleAddGroup}
          allowDrop={this.allowDrop}
          drag={this.drag}
          drop={this.drop}
          setActiveGroup={this.setActiveGroup}
          toggleMsgModal={this.toggleMsgModal}
        />
      </Fragment>
    )
  }

  sortData() {
    if (this.state.rawData.length > 0) {
      this.state.rawData.sort(function (a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();

        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      });
      this.forceUpdate();
    }
  }

  onChange(search) {
    this.setState({
      isLoading: true,
      search: search
    })
    this.onRead(search)
  }

  loadingLoadMore() {
    if (this.state.isLoadingLoadMore) {
      const { words } = this.props;
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
    let height = event.currentTarget.offsetHeight + (window.innerHeight - 300)

    if (this.processing)
      return false

    if (offset >= height) {
      this.processing = true
      if (this.nextLink !== null) {
        let nextPage = this.currentPage + 1
        this.setState({
          isLoadingLoadMore: true
        })

        this.onRead("", nextPage)
      }
      return
    }
  }

  scrollToBottom = () => {
    this.groupEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.toggleAddMemberGroup) {
      this.onAddMemberGroup("all", false)
    }

    if (this.state.active !== "all" || this.state.active !== "administrator") {
      if (nextProps.isUpdate) {
        this.onAddMemberGroup(this.state.active, false)
        this.props.setIsUpdate(false)
      }
    }

    if (this.state.memberCount === 0) {
      this.setState({
        memberCount: nextProps.memberCount
      })
    }
  }

  componentDidMount() {
    clearTimeout(this.timer)
    this.onRead()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  renderMenu() {
    const { words } = this.props
    return (
      <div className="dropdown-content" style={{ "right": "20px" }}>
        <span className="caret-black" ></span>
        <a tabIndex="0" id="add_group" role="button" onClick={() => this.toggleAddGroup()}>{words['gen_group_add-group']}</a>
      </div>
    )
  }

  displayGroups = (data) => {
    return data.map((val, index) => {
      return (
        <Fragment>
          {this.generateRow(val)}
          <ul className='group-wrp'>
            {val.children.length > 0 && this.displayGroups(val.children)}
          </ul>
        </Fragment>
        )
    })
  }

  allowDrop = (ev) => {
    ev.preventDefault();
  }
  
  drag = (ev, group) => {
    ev.dataTransfer.setData('text', 'foo');
    this.setState({dragged: group})
  }
  
  drop = (ev, group) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.setState({dropped: group})
    this.toggleConfirmationModal()
  }

  orderGroup = () => {
    this.props.reorderGroup(this.state.dragged, this.state.dropped, this.onOrderGroupSuccess, this.onOrderGroupFailrue)
  }

  onOrderGroupSuccess = (response) => {
    this.onRead()
  }

  onOrderGroupFailrue = () => {
    this.toggleMsgModal(false)
  }

  toggleConfirmationModal = () => {
    this.setState((state) => ({...state, showConfirmationModal: !state.showConfirmationModal }))
  }

  setActiveGroup = (activeGroupData) => {
    this.setState({
      activeGroupData,
      active: activeGroupData.gid
    })
  }

  groupRightsClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { onOpenPermission } = this.props;
    const {activeGroupData} = this.state;
    onOpenPermission(activeGroupData, true)
  }

  toggleMsgModal = (isSuccessful) => {
    this.setState((state) => ({
      ...state,
      msgActive: !state.msgActive,
      isSuccessful
    }))
  }

  types = ['all', 'administrator'];

  render() {
    if (!this.loggedIn) return (null)
    const { words } = this.props
    const {
      isLoading,
      rowElement,
      count,
      showConfirmationModal,
      active,
      msgActive,
      isSuccessful
    } = this.state;

    return (
      <div className="animated fadeIn">
        <InfoModal
            small
            headline={''}
            info={words['popup_group_move_g&m']|| 'popup_group_move_g&m'}
            toggleModal={this.toggleConfirmationModal}
            isActive={showConfirmationModal}
            action={this.orderGroup}
            yesBtn={words.gen_yes}
            noBtn={words.gen_no}
        />

        <InfoModal
            small
            headline={''}
            info={isSuccessful? words.popup_return_good : words.popup_return_bad}
            toggleModal={this.toggleMsgModal}
            isActive={msgActive}
        />

        <div
          className="gi-header"
          onDrop={(ev) => this.drop(ev, '')}
          onDragOver={this.allowDrop}
        >
          <div className="gi-title cursor">{words.gen_groups}</div>
          <div className='action-buttons'>
            {/* <a tabIndex="0" role="button" onClick={this.groupRightsClick}><img src='/media/images/edit.png' width='18' height='18' /></a> */}
            <a tabIndex="0" id="add_group" role="button" onClick={() => this.toggleAddGroup(!this.types.includes(active) && active)}><img src='/media/images/add.png' width='15' height='15' /></a>
            <a tabIndex="0" role="button" className="red-i" onClick={() => this.onRemoveGroup(active)}><img src='/media/images/remove.png' width='15' height='15' /></a>
          </div>
        </div>
        <div className="row center-xs">
          <div className="col-xs-12">
            <div className="box">
              <UserSearch
                onChange={this.onChange}
                placeholder={words.institution_field_group_name}
                toggle={this.state.toggleSearch}
                words={words}
              />

              <ul className="member-list" onScroll={this.handleScroll}>
                <AllGroup {...this.props}
                  show={this.props.show}
                  toggle={this.props.open}
                  count={this.props.memberCount}
                  onAddMemberGroup={this.onAddMemberGroup}
                  key={"all"}
                  active={this.state.active}
                  words={words}
                />
                <AdministratorGroup {...this.props}
                  onAddMemberGroup={this.onAddMemberGroup}
                  active={this.state.active}
                  key={"administrator"}
                  words={words}
                  type={this.props.type}
                />
                {Object.keys(this.state.rawData).length > 0 &&
                  <Animated total={5} loading={isLoading} count={count} text={null} animation={<UserList />}>
                    {this.displayGroups(this.state.rawData)}
                  </Animated>
                }
                <li ref={(el) => { this.groupEnd = el; }}></li>
              </ul>
              {this.loadingLoadMore()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

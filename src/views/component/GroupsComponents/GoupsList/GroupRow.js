import React from "react"
import classnames from "classnames"
import UpdateGroup from "./UpdateGroup"

export default class GroupRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      in_update: false,
      target: null,
      name_group: this.props.rowData.name,
      count_member: this.props.countMember,
      hideChildren: true,
      draggable: true
    }

    this.expand = this.expand.bind(this)
    this.collapse = this.collapse.bind(this)
    this.changeName = this.changeName.bind(this)
    this.cancel = this.cancel.bind(this)
    this.closeUpdate = this.closeUpdate.bind(this)
    this.removeGroup = this.removeGroup.bind(this)
    this.addMember = this.addMember.bind(this)
    this.setTarget = this.setTarget.bind(this)
    this.showGroupMember = this.showGroupMember.bind(this)
    this.groupRightsClick = this.groupRightsClick.bind(this)
    this.selectGroup = this.selectGroup.bind(this)
  }

  changeName(name, updated) {
    let new_name = name
    if(updated) {
      this.setState({
        name_group: new_name
      })

      this.props.rowData.name = new_name;
      this.props.sortData();
    }
  }

  expand(e) {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    this.setState({expanded: true})
  }

  collapse(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      this.setState({expanded: false})
    } else {
      this.timer = setTimeout(() => {
        this.setState({expanded: false})
      }, 200)
    }
  }

  setTarget(e) {
    const {rowData} = this.props
    e.stopPropagation()

    this.setState({
      target: rowData.gid,
      in_update: true
    })
  }

  cancel(e) {
    e.stopPropagation()
    this.setState({in_update: false})
  }

  closeUpdate() {
    if (this.state.in_update) {
      this.setState({in_update: false})
    }
  }

  removeGroup(e) {
    e.stopPropagation()
    this.props.removeGroup(this.props.rowData.gid)
  }

  showGroupMember(e) {
    const {rowData} = this.props

    this.props.onAddMemberGroup(rowData.gid, true)
    this.props.setGroupName(rowData.name)

    // Set mode to show group member
    this.props.setMode("show")
  }

  componentWillMount() {
    clearTimeout(this.timer)
    if (this.props.in_update == true) {
      this.setState({
        target: this.props.rowData.gid,
        in_update: true
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  addMember(e) {
    const {rowData} = this.props

    e.stopPropagation()

    this.props.onAddMemberGroup(rowData.gid, true)
    this.props.setGroupName(rowData.name)

    // Set mode to add member
    this.props.setMode("add")
  }

  selectGroup(e) {
    const { rowData } = this.props
    this.props.setActiveGroup(rowData);
    this.showGroupMember(e)
    this.groupRightsClick(e, false)
  }

  groupRightsClick(e, open) {
    e.preventDefault()
    e.stopPropagation()
    const {rowData, openGroupRight} = this.props
    this.showGroupMember()
    openGroupRight(rowData, open)
  }

  toggleChildren = () => {
    this.setState((state) => ({...state, hideChildren: !state.hideChildren}))
  }

  handleDraggable = () => {
    this.setState((state) => ({
        ...state,
        draggable: !state.draggable
    }))
  }

  render() {
    const {rowData, active, countMember, toggleMsgModal, words} = this.props
    const {name_group, in_update, target, hideChildren, draggable} = this.state

    return (
      <li
        onClick={this.selectGroup}
        role="button"
        className={classnames("member transition-all", {"member-active" : active === rowData.gid }, {'hide-children': hideChildren})}
        draggable={draggable}
        onDragOver={this.props.allowDrop}
        onDragStart={(ev) => this.props.drag(ev, rowData.gid)}
        onDrop={(ev) => this.props.drop(ev, rowData.gid)}
        onDoubleClick={this.toggleChildren}
      >
        {in_update ?
          <UpdateGroup {...this.props}
            name={name_group}
            id={target}
            changeName={this.changeName}
            cancel={this.cancel}
            closeUpdate={this.closeUpdate}
            words={words}
            handleDraggable={this.handleDraggable}
            toggleMsgModal={toggleMsgModal}
          />
          :
          <div
            className="member-name"
            onDoubleClick={this.setTarget}
          >
            <div
              role="button"
              style={{textDecoration: rowData.children.length > 0 ? 'underline' : 'none'}}
            >
              {name_group}
            </div>
            <div className="member-email-info">
              <a className="member-email link-member">({countMember})</a>
            </div>
          </div>
        }
      </li>
    )
  }
}

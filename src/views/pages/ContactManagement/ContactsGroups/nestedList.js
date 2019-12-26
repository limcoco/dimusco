import React, { Fragment } from "react"
import classnames from "classnames"
import UpdateContactGroup from "./UpdateContactGroup";


export default class NestedList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            expanded: false,
            name_group: JSON.parse(JSON.stringify(this.props.rowData.name)),
            hideChildren:false,
            in_update: false,
            target: null,
            addGroup:false,
            parent:'',
            isMouseInside: false,
            draggable: true
        }

        this.expand = this.expand.bind(this);
        this.collapse = this.collapse.bind(this);
        this.editMethod = this.editMethod.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.setActiveGroup = this.setActiveGroup.bind(this);
        this.setTarget = this.setTarget.bind(this);
        this.closeUpdate = this.closeUpdate.bind(this);
        this.changeName = this.changeName.bind(this);
    }

    componentWillMount() {
        clearTimeout(this.timer)
        if (this.state.in_update == true) {
            this.setState({
                target: this.props.rowData.cgid,
                in_update: true
            })
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

    editMethod(e){
        e.stopPropagation();
        const { rowData } = this.props;
        this.props.setContactsToAddMode(rowData)
    }

    deleteGroup(e){
        e.stopPropagation();
        const { rowData } = this.props;
        this.props.deleteGroup(rowData.cgid);
    }

    addGroup(e){

        const { rowData } = this.props;
        this.setState({
            addGroup:true,
            parent:rowData.cgid
        });
    }

    changeName(name, updated) {
        let new_name = name;
        if(updated) {
            this.setState({
                name_group: new_name
            })
            this.props.rowData.name = new_name;
            this.props.getData();
        }
    }

    closeUpdate(e) {
        e.stopPropagation();
        if (this.state.in_update) {
            this.setState({in_update: false})
        }
    }
    setTarget(e) {
        const {rowData} = this.props;
        e.stopPropagation();

        this.setState({
            target: rowData.cgid,
            in_update: true
        });
    }
    cancel(e) {
        e.stopPropagation()
        this.setState({in_update: false})
    }


    renderMenu() {
        const {words,  rowData} = this.props
        return (
            <div className="dropdown-content">
                <span className="caret-black"></span>
                <a tabIndex="0" role="button" onClick={() => this.addGroup(rowData.gid)}>{words['gen_group_add-group']}</a>
                <a tabIndex="0" role="button" className="red-i" onClick={this.deleteGroup}>{words.gen_group_remove}</a>
                <a tabIndex="0" role="button"  onClick={this.editMethod}>Add Member</a>
            </div>
        )
    }


    setActiveGroup(e){
        const { rowData } = this.props;
        this.props.setActiveGroup(rowData);
    }

    handleDraggable = () => {
        this.setState((state) => ({
            ...state,
            draggable: !state.draggable
        }))
    }


    render() {
        const {rowData,activeGroup,active, words, invitations, dropped, handleDropedChildren, toggleMsgModal } = this.props;
        const { name_group, in_update, target, draggable } = this.state;
        const styles = {display:"flex",textAlign:"center"};
        const activeMember = invitations ? rowData.selected : (active === activeGroup.cgid);
        const group = rowData.name === "My Contacts"? rowData.name : rowData.cgid;
        const groupsName = rowData.state === 1 ? words.contacts_U_all : rowData.state === 3 ? words.contacts_EIP_all : rowData.state === 5 ? words['contacts_my_contacts'] : name_group === 'New Group' ? words['gen_group_new-group'] : name_group;
        return (
            <li
                onClick={this.setActiveGroup}
                role="button"
                className={classnames("member transition-all", {"member-active" : activeMember}, {'hide-children': !(dropped.includes(group) || rowData.children.map(({cgid}) => cgid).includes(activeGroup.cgid))})}
                draggable={draggable}
                onDragOver={(rowData.state === 1 || rowData.state === 3) && !rowData.parent?null:this.props.allowDrop}
                onDragStart={(rowData.state === 1 || rowData.state === 3) && !rowData.parent?null: (ev) => this.props.drag(ev, rowData.cgid)}
                onDrop={(rowData.state === 1 || rowData.state === 3) && !rowData.parent?null:(ev) => this.props.drop(ev, rowData.cgid)}
                onDoubleClick={() => handleDropedChildren(group)}
            >
                <div style={styles}>
                    {in_update?
                        <UpdateContactGroup
                            {...this.props}
                             name={groupsName}
                             id={target}
                             changeName={this.changeName}
                             cancel={this.cancel}
                             closeUpdate={this.closeUpdate}
                             handleDraggable={this.handleDraggable}
                             toggleMsgModal={toggleMsgModal}
                        />
                        :
                        <Fragment>
                            <div
                                className="member-name"
                                onDoubleClick={(rowData.state !== 1 && rowData.state !== 3) && this.setTarget}
                            >
                                <div role="button"  style={{textDecoration: rowData.children.length > 0 ? 'underline' : 'none'}}>{groupsName}</div>
                            </div>
                            <div class="member-email-info"><small class="member-email">({rowData.number_of_members})</small></div>
                        </Fragment>
                    }
                </div>
            </li>
        )
    }
}

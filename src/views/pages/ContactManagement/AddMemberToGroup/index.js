import React, { Component } from 'react'
import Members from './Members';

export class AddMemberToGroup extends Component {
    addContactToGroup = (contact) => {
        const {addContactToGroup} = this.props;
        addContactToGroup({contact_group: this.props.groupID, contact}, this.addContactToGroupSuccess, this.addContactToGroupFailure)
    }

    addContactToGroupSuccess = () => {
        const { toggleMsgModal, getData, words } = this.props;
        getData();
        toggleMsgModal(words.popup_return_good)
    }

    addContactToGroupFailure = () => {
        const { toggleMsgModal, words } = this.props;
        toggleMsgModal(words.popup_return_bad)
    }

    removeContactFromGroup = (contact) => {
        const {removeContactFromGroup} = this.props;
        removeContactFromGroup({contact_group: this.props.groupID, contact}, this.removeContactFromGroupSuccess, this.removeContactFromGroupFailure)
    }

    removeContactFromGroupSuccess = () => {
        const {getData, toggleMsgModal, words} = this.props;
        toggleMsgModal(words.popup_return_good)
        getData();
    }

    removeContactFromGroupFailure = () => {
        const {toggleMsgModal, words} = this.props;
        toggleMsgModal(words.popup_return_bad)
    }
    
    render() {
        const {words, groupName, openAddMemberToGroup, groupID} = this.props;
        
        return (
            <div className='row'>
                <Members
                members={this.props.groupContacts}
                words={words}
                title={groupName}
                onAddMemberToGroup={this.removeContactFromGroup}
                openAddMemberToGroup={openAddMemberToGroup}
                showBack
                />
                <Members
                members={this.props.contacts.filter((item) => {
                    return !item.groups.includes(groupID);
                })}
                words={words}
                title={words.gen_contacts}
                onAddMemberToGroup={this.addContactToGroup}
                openAddMemberToGroup={openAddMemberToGroup}
                />
            </div>
        )
    }
}

export default AddMemberToGroup;

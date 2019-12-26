import React, { Component, Fragment } from 'react'
import Members from './Members';

import Presenter from "../../../institution/presenter"
import Request from "../../../institution/utils/request.js"

import PresenterGroup from "../../../group/presenter.js"
import RequestGroup from "../../../group/utils/request.js"

import PubPresenter from "../../../publisher/presenter.js"
import PubRequest from "../../../publisher/utils/request.js"

import EnsPresenter from "../../../ensemble/presenter.js"
import EnsRequest from "../../../ensemble/utils/request.js"
import InfoModal from '../Modal/Info';

export class AddMemberToGroup extends Component {
    state = {
        groupID: this.props.groupID,
        groupsMember: [],
        allMembers: [],
        presenter: this.props.type === 'institution' ? Presenter :
        this.props.type === 'publisher' ? PubPresenter :
        this.props.type === 'ensemble' ? EnsPresenter : Presenter,
        request: this.props.type === 'institution' ? Request :
        this.props.type === 'publisher' ? PubRequest :
        this.props.type === 'ensemble' ? EnsRequest : Request 
    }
    componentDidMount () {
        this.onReadMemberGroup()
    }

    onReadMemberGroup () {
        const { groupID } = this.props;
        const { presenter, request } = this.state;
        if (groupID === "administrator") {
            presenter.ReadAdministrator(
                request.ReadAdministrator('', '1', this, this.onReadAdministratorSuccess, this.onReadAdministratorFailed)
            )
        } else {
            PresenterGroup.ReadMember(
                RequestGroup.ReadMember('', '1', groupID, this, this.onReadMemberGroupSuccess, this.onReadMemberGroupFailed)
            )
        }
    }

    onReadAdministratorSuccess = (_, response) => {
        this.setState({
            groupsMember: response.data.results || []
        }, () => {
            this.onReadAllMembers()
        })
    }

    onReadAdministratorFailed = (error) => {
      this.toggleMsgModal(false)
    }

    onReadMemberGroupSuccess = (_, response) => {
        this.setState({
            groupsMember: response.data.results || []
        }, () => {
            this.onReadAllMembers()
        })
    }

    onReadMemberGroupFailed = (error) => {
      this.toggleMsgModal(false)
    }


    onReadAllMembers() {
        const { presenter, request } = this.state;
        presenter.ReadMember(
            request.ReadMember('', '1', this, this.onReadMemberSuccess, this.onReadMemberFailed)
        )
    }


    onReadMemberSuccess = (_, response) => {
        this.setState({
            allMembers: response.data.results || []
        })

        const data = response.data.results;

        const {groupsMember} = this.state;
        const uids = groupsMember.map((item) => item.uid)
        this.setState((state) => ({
            ...state,
            allMembers: data.filter((item) => {
                return !uids.includes(item.uid);
            })
        }))
        
    }
    
    onReadMemberFailed = (error) => {
      this.toggleMsgModal(false)
    }

    onAddMemberToGroup = (uid) => {
        const { groupID } = this.props;
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
    
      onAddAdministratorSuccess = (params, response) => {
        this.onReadMemberGroup()
        this.onReadAllMembers()
      }
    
      onAddAdministratorFailed = (error) => {
        this.toggleMsgModal(false)
      }
    
      onAddMemberToGroupSuccess = (params, response) => {
        this.onReadMemberGroup()
        this.onReadAllMembers()
      }
    
      onAddMemberToGroupFailed = (error) => {
        this.toggleMsgModal(false)
      }


      // Remove member and administator from group
  onRemoveMember = (uid) => {
    const { groupID } = this.props
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
  onRemoveMemberSuccess = (params, response) => {
    this.onReadMemberGroup()
    this.onReadAllMembers()
  }

  onRemoveMemberFailed = (error) => {
    this.toggleMsgModal(false)
  }

  onRemoveAdministratorFailed = () => {
    this.toggleMsgModal(false)
  }
    
  onRemoveAdministratorSuccess = () => {
    this.onReadMemberGroup()
    this.onReadAllMembers() 
  }

  toggleMsgModal = (isSuccessful) => {
    this.setState((state) => ({
      ...state,
      msgActive: !state.msgActive,
      isSuccessful
    }))
  }
    
  render() {
      const { groupsMember, allMembers, msgActive, isSuccessful } = this.state;
      const {words, groupName, openAddMemberToGroup} = this.props;
      return (
        <Fragment>
          <InfoModal
            small
            headline={''}
            info={isSuccessful? words.popup_return_good : words.popup_return_bad}
            toggleModal={this.toggleMsgModal}
            isActive={msgActive}
          /> 
          <div className='row'>
              <Members
              members={groupsMember}
              words={words}
              title={groupName}
              onAddMemberToGroup={this.onRemoveMember}
              openAddMemberToGroup={openAddMemberToGroup}
              showBack
              />
              <Members
              members={allMembers}
              words={words}
              title={words.gen_all}
              onAddMemberToGroup={this.onAddMemberToGroup}
              openAddMemberToGroup={openAddMemberToGroup}
              />
          </div>
        </Fragment>
      )
  }
}

export default AddMemberToGroup;

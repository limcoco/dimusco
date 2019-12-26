import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Animated from "../../../component/animated";
import {UserList} from "../../../component/animation";
import NestedList from "./nestedList";
import InfoModal from "../../../component/Modal/Info";

class ContactGroups extends Component {
    state = {
        open: true,
        showConfirmationModal:false,
        rawData:[],
        rowElement: [],
        droppedLists: []
    };



    componentWillReceiveProps(nextProps){
        if(this.state.rawData !== nextProps.contactsGroups){
            this.setState({rawData:[]},()=>{
                this.setState({rawData:nextProps.contactsGroups});
            })
        }
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
    };

    generateRow = (val) => {
    return (
        <Fragment>
            <NestedList
                {...this.props}
                rowData={val}
                active={val.cgid}
                countMember={0}
                allowDrop={this.allowDrop}
                drag={this.drag}
                drop={this.drop}
                dropped={this.state.droppedLists}
                handleDropedChildren={this.handleDropedChildren}
                toggleMsgModal={this.props.toggleMsgModal}
            />
        </Fragment>
    )
}
    toggleConfirmationModal = () => {
        this.setState((state) => ({...state, showConfirmationModal: !state.showConfirmationModal }))
    }

    orderGroup = () => {
        this.props.reorderContactGroup(this.state.dragged, this.state.dropped, this.onOrderGroupSuccess, this.onOrderGroupFailure)
    }

    onOrderGroupSuccess = (response) => {
        const {toggleMsgModal, words} = this.props;
        toggleMsgModal(words.popup_return_good)
        this.props.getData();
    }

    onOrderGroupFailure = () => {
        const {toggleMsgModal, words} = this.props;
        toggleMsgModal(words.popup_return_bad)
    }

    handleDropedChildren = (cgid) => {
        const {droppedLists} = this.state;
        const index = droppedLists.indexOf(cgid);
        if (index > -1) {
            droppedLists.splice(index, 1);
        } else {
            droppedLists.push(cgid);
        }
        this.setState({
            droppedLists
        })
    }

    render() {
        const { words, createGroup, deleteGroup } = this.props;
        const { showConfirmationModal,rawData} = this.state;
      
        return (
            <div>
                <div
                    className="gi-header"
                    onDrop={(ev) => this.drop(ev, '')}
                    onDragOver={this.allowDrop}
                >
                    <div className="gi-title cursor">{words.contacts_groups}</div>
                    <div className='action-buttons'>
                        <a tabIndex="0" id="add_group" role="button" onClick={createGroup}><img src='/media/images/add.png' width='15' height='15' /></a>
                        <a tabIndex="0" role="button" className="red-i" onClick={deleteGroup}><img src='/media/images/remove.png' width='15' height='15' /></a>
                    </div>
                </div>
                <InfoModal
                    small
                    headline={''}
                    info={words.popup_group_move_contacts || 'popup_group_move_contacts'}
                    toggleModal={this.toggleConfirmationModal}
                    isActive={showConfirmationModal}
                    action={this.orderGroup}
                    yesBtn={words.gen_yes}
                    noBtn={words.gen_no}
                />
                <div>
                    <ul className="member-list">
                        <Animated total={5} loading={false} count={rawData.length} text={null} animation={<UserList />}>
                            {this.displayGroups(rawData)}
                        </Animated>
                    </ul>
                </div>
            </div>
        )
    }
}

ContactGroups.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default ContactGroups;


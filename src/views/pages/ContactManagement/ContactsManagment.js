import React, { Component } from 'react';
import PropTypes from "prop-types";

import Contacts from './Contacts';
import ContactsGroups from './ContactsGroups';

import './style.css';

import AddMemberToGroup from './AddMemberToGroup';

import Request from "../../../utils/Request";
import Auth from '../../../redux/account/authToken';

import PaginationNumber from '../../component/PaginationNumber';
import InfoModal from '../../component/Modal/Info';

class ContactsComponent extends Component {
    state = {
        contacts: [],
        groups: [],
        contactData: { edit: false},
        activeGroup: {name: 'All', state: this.props.userDetails.uid ? 1 : 3},
        addGroup:false,
        parentId:'',
        activeContact: {},
        search: '',
        page: 1,
        count: '',
        current: 1,
        gc_page: 1,
        gc_count: '',
        gc_current: 1,
        loading: false,
        allGroup: {},
        msg: ''
    };

    componentDidMount () {
        this.getData();
    }

    getData = () => {
        this.getContactsData();
        this.props.getContactsGroups(this.getContactsGroupsSuccess);
        if (this.state.activeGroup.cgid)
        this.getGroupContacts();
    }

    getContactsGroupsSuccess = (response) => {
        const {activeGroup} = this.state;
        let activeGroupRes = {};
        if (activeGroup.cgid){
            activeGroupRes = response.results.find((item) => {
                return item.cgid === activeGroup.cgid;
            });
        } else {
            if (this.props.userDetails.uid) {
                activeGroupRes = response.results.find((item) => {
                    return item.state === 1;
                });
            } else {
                activeGroupRes = response.results.find((item) => {
                    return item.state === 3;
                });
            }
            this.setState({
                allGroup: activeGroupRes
            })
        }
        this.setState((state) => ({...state, activeGroup: {...state.activeGroup, ...activeGroupRes}}))
    }

    getContactsData = () => {
        const payload = {
            search: this.state.search,
            page: this.state.page
        }
        this.props.getContacts(this.getContactsSuccess, this.getContactsFailed, payload);
    }

    getContactsSuccess = (response) => {
        this.setState({
            count: response.count,
            current: response.current
        })
    }


    getGroupContacts = (cgid = this.state.activeGroup.cgid) => {
        const payload = {
            page: this.state.gc_page
        }

        this.props.getGroupContacts(cgid, payload, this.getGroupContactsSuccess);
    }

    getGroupContactsSuccess = (response) => {
        this.selectGroupContact(this.state.activeGroup);
        this.setState({
            gc_count: response.count,
            gc_current: response.current || this.state.gc_page
        })
    }
        
    
    getContactsFailed = (error) => {
        console.log('error: ', error);
    }

    addMember = () => {
       const { history } = this.props;
       history.push("/addContact");
    }

    createGroup = () => {
        const {activeGroup: {cgid, state, parent}} = this.state;
        const data = {
            name: 'New Group',
            parent: cgid
        }
        if ((state === 1 || state === 3) && !parent)
        delete data.parent;
        this.props.createContactsGroup(data, this.onCreateGroupSuccess, this.onCreateGroupFailure)
    }

    onCreateGroupSuccess = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_good)
        this.getData();
    }

    onCreateGroupFailure = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_bad)
    }
    
    deleteGroup = () => {
        const {activeGroup: {cgid, state}} = this.state;
        if (state !== 0)
        this.props.deleteContactsGroup(cgid, this.onDeleteGroupSuccess, this.onDeleteGroupFailure);
    }

    onDeleteGroupSuccess = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_good)
        this.getData();
    }

    onDeleteGroupFailure = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_bad)
    }
    
    importCsv = (event) => {
        this.setState({
            file: event.target.files[0]
        }, () => {
            this.toggleModal()
        })
    }

    wipe = () => {
        this.setState({
            loading: true
        })
        this.props.importCsv({file: this.state.file, wipe: 1}, this.importCsvSuccess, this.importCsvFailure)
    }

    dontWipe = () => {
        this.setState({
            loading: true
        })
        this.props.importCsv({file: this.state.file, wipe: 0}, this.importCsvSuccess, this.importCsvFailure)
    }

    toggleModal = () => {
        this.setState((state) => ({
            ...state,
            isActive: !state.isActive
        }))
    }

    importCsvSuccess = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_good)
        this.getData()
        this.setState({
            loading: false
        })
    }

    importCsvFailure = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_bad)
        this.setState({
            loading: false
        })
    }

    exportCsv = () => {
        this.setState({
            loading: true
        })
        this.props.exportCsv(this.onExpoirtSuccess, this.exportCsvFailure);
    }

    onExpoirtSuccess = (data) => {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(data);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Groups.csv';
        document.getElementById('container').appendChild(hiddenElement);
        hiddenElement.click();
        this.setState({
            loading: false
        })
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_good)
    }

    exportCsvFailure = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_bad)
        this.setState({
            loading: false
        })
    }

    setActiveGroup = (activeGroup) => {
        this.setState((state) => ({
            ...state,
            gc_page: 1,
            activeGroup: {...state.activeGroup, ...activeGroup, addMode: false}
        }), () => {
            this.getGroupContacts(activeGroup.cgid)
        })
    }
    

    setContactsToAddMode = (activeGroup) => {
        this.setState((state) => ({...state, activeGroup: {...state.activeGroup, ...activeGroup, addMode: true}}))
    }

    openAddMemberToGroup = () => {
        this.setState((state) => ({...state, addMemberToGroup: !state.addMemberToGroup}))
      }

      setActiveCotnact = (activeContact) => {
          const {invitations} = this.props;
        if (invitations) {
            this.selectContact(activeContact)
        } else {
            this.setState({
                activeContact
            })
        }
      }

    removeContactFromGroup = () => {
        const {removeContactFromGroup} = this.props;
        const {activeGroup, activeContact} = this.state;
        removeContactFromGroup({contact_group: activeGroup.cgid, contact: activeContact.cid}, this.onSuccess, this.onRemoveContactFromGroupFailure)
    }

    onSuccess = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_good)
        this.getData();
    }

    onRemoveContactFromGroupFailure = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_bad)
    }

    deleteContact = () => {
        let headers = {
            Authorization: "Token " + Auth.getActiveToken(),
        }
        const { activeContact } = this.state;
        Request(
            "delete",
            "delete-contact",
            headers,
            {},
            [activeContact.cid],
            this.deleteContactSuccess,
            this.deleteContactFailed,
        )
    }


    deleteContactSuccess = () => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_good)
        this.getData();
    }

    deleteContactFailed = (error) => {
        const {ActiveLanguageReducer: {words}} = this.props;
        this.toggleMsgModal(words.popup_return_bad)
    }

    handleSubmitSearch = (ev) => {
        ev.preventDefault();
        this.getContactsData();
        if (!this.state.addMemberToGroup) {
            this.setState({
                activeGroup: this.props.contactsGroups.results[0] ? this.props.contactsGroups.results[0] : {name: 'All', state: 0}
            })
        }
    }

    handleSearch = (ev) => {
        this.setState({
            search: ev.target.value
        })
    }

    selectContact = (contact) => {
        const cids = this.state.contacts.map(({cid}) => cid);
        let newContacts = []
        if (cids.includes(contact.cid)) {
            newContacts = this.state.contacts.filter(({cid}) => cid !== contact.cid)
        } else {
            newContacts = [...this.state.contacts, contact]
        }

        this.setState({
            contacts: newContacts
        })
    }

    selectGroupContact = (group) => {
        const cids = this.props.groupContacts.map(({cid}) => cid);
        let newContacts = [];
        const cgids = this.state.groups.map(({cgid}) => cgid);
        let newGroups = []
        if (cgids.includes(group.cgid)) {
            newGroups = this.state.groups.filter(({cgid}) => cgid !== group.cgid)
            newContacts = this.state.contacts.filter(({cid}) => !cids.includes(cid))
        } else {
            newGroups = [...this.state.groups, group]
            newContacts = [...this.state.contacts, ...this.props.groupContacts]
        }
        this.setState({
            contacts: newContacts,
            groups: newGroups
        })
    }

    handlePageClick = ({selected}) => {
        const {activeGroup, addMemberToGroup} = this.state
        if ((activeGroup.state === 1 || activeGroup.state === 3) && !activeGroup.parent || addMemberToGroup || this.props.invitations) {
            this.setState((state) => ({
                ...state,
                page: selected + 1
            }), () => {
                this.getContactsData();
            })
        } else {
            this.setState((state) => ({
                ...state,
                gc_page: selected + 1
            }), () => {
                this.getGroupContacts();
            })
        }
        
    }

    setActiveGroupID = (cgid) => {
        Request(
            'get',
            'contacts-group',
            { Authorization: 'Token ' + Auth.getActiveToken() },
            {},
            [cgid],
            this.getContactsGroupSuccess
          );
    }

    getContactsGroupSuccess = (response) => {
        this.setState({
            gc_page: 1,
            activeGroup: response.data
        }, () => {
            this.getGroupContacts()
        })
    }

    toggleMsgModal = (msg) => {
        this.setState((state) => ({
            ...state,
            isMsgActive: !state.isMsgActive,
            msg
        }))
    }
  
    render () {
        const {
            ActiveLanguageReducer: {words},
            contacts,
            contactsGroups,
            invitations,
            addContactToGroup,
            removeContactFromGroup,
            groupContacts
        } = this.props;

        const {
            activeGroup,
            activeContact,
            count,
            current,
            gc_current,
            gc_count,
            isActive,
            isMsgActive,
            msg
        } = this.state;
        let newContacts = [];
        let newGroups = [];
        if (invitations) {
            const cids = this.state.contacts.map(({cid}) => cid);
            newContacts = contacts.map((item) => {
                if(cids.includes(item.cid)) {
                    item.selected = true
                } else {
                    item.selected = false
                }
                return item;
            })

            const cgids = this.state.groups.map(({cgid}) => cgid);
            newGroups = contactsGroups.results.map((item) => {
                if(cgids.includes(item.cgid)) {
                    item.selected = true
                } else {
                    item.selected = false
                }
                return item;
            })
        }
        
        return (
            <div className={`manage-addresses manage-contacts profile-page full-height group-page ${this.state.loading && 'progress'}`}>
                <InfoModal
                 small
                 info={words.popup_contacts_wipe || 'popup_contacts_wipe'}
                 toggleModal={this.toggleModal}
                 isActive={isActive}
                 action={this.wipe}
                 yesBtn={words.gen_yes}
                 noBtn={words.gen_no}
                 dontWipe={this.dontWipe}
                />

                <InfoModal
                    small
                    info={msg}
                    toggleModal={this.toggleMsgModal}
                    isActive={isMsgActive}
                />

                <div className='container' id='container'>
                    <div className='row' style={{padding: '20px 0'}}>
                        <div className='col-md-6' style={{padding: '0px 30px'}}>
                            <form className='search-from' onSubmit={this.handleSubmitSearch}>
                                <div className='search-input'>
                                    <div className='search-box'>
                                        <input className='search-text' type='text' onChange={this.handleSearch} value={this.state.search} />
                                        {this.state.search &&
                                            <div className="delete-btn" onClick={() => this.setState({search: ''})}>
                                                <span className="delete-icon" style={{backgroundImage: 'url(media/images/icon/delete.svg)'}}></span>
                                            </div>
                                        }
                                    </div>
                                    <button className='btn small black'>{words.gen_find}</button>
                                </div>
                            </form>
                        </div>
                        <div className='col-md-6'>
                            <div className='row'>
                                <div className='col-md-7 musinote-center'>
                                    <PaginationNumber
                                        current={(activeGroup.state === 1 || activeGroup.state === 3) && !activeGroup.parent || this.state.addMemberToGroup || invitations ? current : gc_current}
                                        count={(activeGroup.state === 1 || activeGroup.state === 3) && !activeGroup.parent || this.state.addMemberToGroup || invitations ? count : gc_count}
                                        number_page={(activeGroup.state === 1 || activeGroup.state === 3) && !activeGroup.parent || this.state.addMemberToGroup || invitations ? count/20 : gc_count/20}
                                        handle={this.handlePageClick}
                                        marginDisplay={1}
                                        page_range={2}
                                        navNull={true}
                                    />
                                </div>
                                <div className='col-md-5' style={{padding: '0px 23px'}}>
                                    <div className='btn-wrp' style={{justifyContent: 'flex-end'}}>
                                        <button className='btn small black' onClick={this.exportCsv}>{words.gen_export}</button>
                                        <label className='btn small black' htmlFor='import'>
                                            {words.gen_import}
                                            <input type='file' id='import' onChange={this.importCsv} style={{display: 'none'}} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.addMemberToGroup &&
                        <AddMemberToGroup
                            groupID={activeGroup.cgid}
                            openAddMemberToGroup={this.openAddMemberToGroup}
                            groupName={activeGroup.name}
                            words={words}
                            contacts={contacts}
                            groupContacts={groupContacts}
                            addContactToGroup={addContactToGroup}
                            removeContactFromGroup={removeContactFromGroup}
                            getData={this.getData}
                            toggleMsgModal={this.toggleMsgModal}
                        />
                    }
                    <div className='row' style={{display: this.state.addMemberToGroup ? 'none' : 'flex'}}>
                        <div className='col-md-6' style={{padding: '0px 30px'}}>
                            <ContactsGroups
                                {...this.props}
                                words={words}
                                getData={this.getData}
                                contactsGroups={invitations ? newGroups :contactsGroups.results}
                                deleteGroup={this.deleteGroup}
                                createGroup={this.createGroup}
                                setActiveGroup={this.setActiveGroup}
                                setContactsToAddMode={this.setContactsToAddMode}
                                activeGroup={activeGroup}
                                createGroup={this.createGroup}
                                deleteGroup={this.deleteGroup}
                                toggleMsgModal={this.toggleMsgModal}
                            />
                        </div>
                        <div className='col-md-6 contacts-wrp' style={{padding: '0px 30px', zIndex: '9'}}>
                            <div className="gi-header">
                                <div className="gi-title cursor">{words.gen_contacts}</div>
                                <div className='action-buttons'>
                                    <a tabIndex="0" id="add_group" role="button" onClick={activeGroup.state === 1 || activeGroup.state === 3 || activeGroup.state === 5 ? this.addMember: this.openAddMemberToGroup}><img src='/media/images/add.png' width='15' height='15' /></a>
                                    <a tabIndex="0" role="button" className="red-i" onClick={(activeGroup.state === 1 || activeGroup.state === 3) && !activeGroup.parent ? this.deleteContact: this.removeContactFromGroup}><img src='/media/images/remove.png' width='15' height='15' /></a>
                                </div>
                            </div>
                            <Contacts
                                contacts={invitations ? newContacts : (activeGroup.state === 1 || activeGroup.state === 3) && !activeGroup.parent ? contacts : groupContacts}
                                getContacts={() => this.props.getContacts(undefined, this.getContactsFailed)}
                                gotoEditContact={this.gotoEditContact}
                                invitations={invitations}
                                words={words}
                                activeGroup={activeGroup}
                                setActiveCotnact={this.setActiveCotnact}
                                activeContact={activeContact}
                                setActiveGroupID={this.setActiveGroupID}
                                allGroup={this.state.allGroup}
                                getData={this.getData}
                                toggleMsgModal={this.toggleMsgModal}
                            />
                        </div>
                    </div>
                    {invitations &&
                        <a className='btn black small' style={{marginTop: '50px'}} onClick={() => this.props.getContact(this.state.contacts.filter((obj, pos, arr) => {
                            return arr.map(mapObj => mapObj.cid).indexOf(obj.cid) === pos;
                        }))}>{words.gen_transfer}</a>
                    }
                </div>
            </div>
        );
    }
}

ContactsComponent.propTypes = {
    ActiveLanguageReducer: PropTypes.shape({
        words: PropTypes.object.isRequired,
    }),
    contacts: PropTypes.array.isRequired,
    getContact: PropTypes.func.isRequired,
    // TODO: add propTypes to rest props
    // invitations
}

export default ContactsComponent;
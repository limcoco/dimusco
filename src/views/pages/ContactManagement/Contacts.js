import React, {Fragment, Component} from 'react';
import PropTypes from "prop-types";
import classnames from "classnames"
import EditContacts from './EditContacts';

class Contacts extends Component {
    state = {
        items: []
    }
    componentWillReceiveProps (props) {
        this.setState({
            items: props.contacts.map((item) => {
                item.checked = false;
                return item;
            })
        })
    }
    addContactToTransfer = (ev, score) => {
        if (ev.target.checked) {
            this.setState({
                items: this.props.contacts.map((item)=> {
                    if(item.cid === score.cid) {
                        item.checked = true;
                    }
                    return item;
                })
            })
        } else {
            this.setState({
                items: this.props.contacts.map((item)=> {
                    if(item.cid === score.cid) {
                        item.checked = false;
                    }
                    return item;
                })
            })
        }
    }

    toggleModal = () => {
        this.setState((state) => ({ ...state, isActive: !state.isActive }))
    }

    render () {
        const {
            contacts,
            setActiveCotnact,
            activeContact,
            allGroup,
            toggleMsgModal,
            getData
        } = this.props;
        
        return (
            <Fragment>
                 <EditContacts
                    id={activeContact.cid}
                    getData={getData}
                    toggleMsgModal={toggleMsgModal}
                    toggleModal={this.toggleModal}
                    isActive={this.state.isActive}
                />
                <ul className='member-list'>
                    {contacts.map((item) => {
                        if (allGroup) {
                            const index = item.groups.indexOf(allGroup.cgid);
                           if (index > -1 && item.groups.length > 1) {
                               item.groups.splice(index, 1);
                           }
                        }
                     return (
                            <li
                                button
                                className={classnames("member transition-all", {"member-active" : activeContact.cid === item.cid || item.selected})}
                                key={item.cid}
                                onClick={() => setActiveCotnact(item)}
                                style={{padding: '10px 30px'}}
                                onDoubleClick={this.toggleModal}
                            >
                                <div>
                                    <div className='body-list-inside-title'>
                                        <span>{item.last_name && `${item.last_name}, `}{item.first_name}</span>
                                        {item.street && `, ${item.street}`}{item.city && `, ${item.city}`}
                                        <br/>
                                    </div>
                                    <span style={{color:'rgba(0, 0, 0, 0.6)',fontSize:'13px'}}>{`${item.email && `${item.email}`}${item.phone_1 && `, ${item.phone_1}`}${item.phone_2 && `, ${item.phone_2}`}`}</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
        </Fragment>
            
        )
    }
}

Contacts.propTypes = {
    contacts: PropTypes.array.isRequired,
    words: PropTypes.object.isRequired,
    // TODO: add propTypes to rest props
    // getContacts,
    // invitations,
    // getContact,
}

export default Contacts;
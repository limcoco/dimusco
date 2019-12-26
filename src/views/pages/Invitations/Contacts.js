import React, {Component} from 'react';
import Modal from '../../component/Modal/Skeleton';
import ContactsManagement from '../ContactManagement';
class Contacts extends Component {

    getContact = (email) => {
        this.props.getContact(email);
        this.props.toggleModal()
    }

    render () {
        const {words} = this.props;
        return (
            <div className='invitation-contacts'>
                <Modal
                    toggleModal={this.props.toggleModal}
                    isActive={this.props.isActive}
                >
                    <a onClick={this.props.toggleModal} className='close'>X</a>
                    <ContactsManagement words={words} invitations getContact={this.getContact} history={this.props.history} />
                </Modal>
            </div>
        );
    }
}

export default Contacts;
import React, { Component } from 'react';
import PropTypes from "prop-types";
import Request from "../../../utils/Request";
import Auth from '../../../redux/account/authToken';
import ContactsComponent from "./ContactsManagment";

class DeleteContact extends Component {
    state = {
    };

    deleteContact = (id) => {
        let headers = {
            Authorization: "Token " + Auth.getActiveToken(),
        }
        Request(
            "delete",
            "delete-contact",
            headers,
            {},
            [id],
            this.deleteContactSuccess,
            this.deleteContactFailed,
        )
    }


    deleteContactSuccess = () => {
        this.props.getContacts();
    }

    deleteContactFailed = (error) => {
        console.log('error: ', error);
    }

    render () {
        return (
            <span onClick={() => this.deleteContact(this.props.id)}><i className='remove-icon'/></span>
        );
    }
}

DeleteContact.propTypes = {
    words: PropTypes.object.isRequired,
    // id
    // contacts: PropTypes.array.isRequired,
    // getContact: PropTypes.func.isRequired,
    // TODO: add propTypes to rest props
    // invitations
}

export default DeleteContact;
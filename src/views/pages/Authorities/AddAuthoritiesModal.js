import React, { Component } from 'react';
import Modal from '../../component/Modal/Skeleton';
import DropDown from '../../component/DropDown';
import Auth from '../../../redux/account/authToken';
import Request from "../../../utils/Request";

class AddAuthority extends Component  {
    state = {
        value: this.props.data.value || '',
        groups: this.props.data.groups || '',
        variants: this.props.data.variants || '',
        state: this.props.data.state || 0,
        wikilink: this.props.data.wikilink || '',
        type: this.props.data.type || 1,
        language: this.props.data.language || 'en'
    }

     // AddAuthority
     addAuthority = () => {
        const headers = {
            Authorization: 'Token ' + Auth.getActiveToken()
        }
        Request(
            'post',
            'authorities',
            headers,
            this.state,
            [],
            this.onAddAuthoritySuccess,
            this.onAddAuthorityFailed
          );
    }

    onAddAuthoritySuccess = () => {
        const {toggleModal, toggleMsgModal, getAuthorities} = this.props;
        toggleModal()
        toggleMsgModal(true)
        getAuthorities()
    }

    onAddAuthorityFailed = () => {
        this.props.toggleMsgModal(false)
    }
    // AddAuthority

    // EditAuthority
    editAuthority = () => {
        const headers = {
            Authorization: 'Token ' + Auth.getActiveToken()
        }
        const {data} = this.props;
        Request(
            'patch',
            'delete-authority',
            headers,
            this.state,
            [data.auid],
            this.onEditAuthoritySuccess,
            this.onEditAuthorityFailed
          );
    }

    onEditAuthoritySuccess = () => {
        const {toggleModal, toggleMsgModal, getAuthorities} = this.props;
        toggleModal()
        toggleMsgModal(true)
        getAuthorities()
    }

    onEditAuthorityFailed = () => {
        this.props.toggleMsgModal(false)
    }
    // EditAuthority
    
    handleDrop = ({ value }) => {
        this.setState({
            state: value
        });
    }

    handleInput = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        const { data } = this.props
        if (data.auid)
            this.editAuthority()
        else 
            this.addAuthority()
    }

    opitons = () => {
        const {words} = this.props;
        return [
            {value: 0, label: words.state_preliminary || 'state_preliminary'},
            {value: 1, label: words.state_active || 'state_active'},
            {value: 2, label: words.state_flagged || 'state_flagged'},
            {value: 3, label: words.state_remove || 'state_removed'}
        ]
    } 

    typeOpitons = () => {
        const {words} = this.props;
        return [
            {value: 1, label: words.gen_title || 'gen_title'},
            {value: 2, label: words.gen_composer || 'gen_composer'},
            {value: 3, label: words.gen_instrument || 'gen_instrument'},
            {value: 4, label: words.gen_edition || 'gen_edition'},
            {value: 5, label: words.gen_category || 'gen_category'},
            {value: 6, label: words.gen_interests || 'gen_interests'},
            {value: 7, label: words.gen_publisher || 'gen_publisher'}
        ]
    } 

    render () {
        const {isActive, toggleModal, words, data = {}} = this.props;
        return (
            <div className='profile-page add-authority-modal'>
                <Modal
                    removeIcon
                    toggleModal={toggleModal}
                    isActive={isActive}
                >
                    <div className='add-contact edit-address'>
                        <form onSubmit={this.handleSubmit}>
                            <div className='box'>
                                <div className='row'>
                                    <div className='form-group col-xs-6'>
                                        <label>{words.gen_type || 'gen_type'}</label>
                                        <DropDown
                                            value={this.state.type}
                                            onChange={({value}) => this.handleInput({target: {value, name: 'type'}})}
                                            options={this.typeOpitons()}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className='form-group col-xs-6'>
                                        <label>{words.gen_language || 'gen_language'}</label>
                                        <DropDown
                                            value={this.state.language}
                                            onChange={({value}) => this.handleInput({target: {value, name: 'language'}})}
                                            options={[{value: 'en', label: 'English'}, {value: 'de', label: 'German'}]}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group col-xs-7">
                                        <label>{words['gen_name']}</label>
                                        <input
                                            type="text"
                                            name="value"
                                            className="form-control"
                                            onChange={this.handleInput}
                                            value={this.state.value}
                                        />
                                    </div>
                                    <div className="form-group col-xs-5">
                                        <label>{words['gen_state']}</label>
                                        <DropDown
                                            value={this.state.state}
                                            onChange={this.handleDrop}
                                            options={this.opitons()}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{words.gen_variants}</label>
                                    <textarea
                                        name="variants"
                                        className="form-control"
                                        onChange={this.handleInput}
                                        value={this.state.variants}
                                        rows={4}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{words['gen_link']}</label>
                                    <input
                                        type="text"
                                        name="wikilink"
                                        className="form-control"
                                        onChange={this.handleInput}
                                        value={this.state.wikilink}
                                    />
                                </div>
                            </div>
                            <div className='btns-wrp'>
                                <button className='btn black' onClick={toggleModal}>{words.gen_back}</button>
                                <button className='btn black' type='submit'>{data.auid ? words.gen_save || 'gen_save' : words.gen_add}</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default AddAuthority

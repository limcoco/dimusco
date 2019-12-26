import React, { Component, Fragment } from 'react';
import Modal from '../../component/Modal/Skeleton';

class RemoveModal extends Component {
    state = {}

    render () {
        const {words, isActive, toggleModal, onDeleteOptionClick} = this.props;
        
        return (
            <div className='remove-modal'>
                <Modal
                    toggleModal={toggleModal}
                    isActive={isActive}
                    small
                >
                    <h2>{words.popup_lib_score_remove || 'popup_lib_score_remove'}</h2>
                    <a onClick={toggleModal} className='close'>X</a>
                    <div className='btn-wrp'>
                        <button className='btn black small' onClick={() => {
                            onDeleteOptionClick()
                        }}>{words.gen_yes}</button>
                        <button className='btn black small' onClick={toggleModal}>{words.gen_no}</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default RemoveModal;
import React, { Component, Fragment } from 'react';
import Modal from '../../component/Modal/Skeleton';

class ChangeModal extends Component {

  render () {
    const {words, isActive, toggleModal, changeLibraryScope} = this.props;

    return (
      <div className='remove-modal'>
        <Modal
          toggleModal={toggleModal}
          isActive={isActive}
          small
        >
          <h2>{ words.popup_lib_score_change}</h2>
          <a onClick={toggleModal} className='close'>X</a>
          <div className='btn-wrp'>
            <button className='btn black small'  onClick={changeLibraryScope}>{words.gen_yes}</button>
            <button className='btn black small' onClick={toggleModal}>{words.gen_no}</button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default ChangeModal;
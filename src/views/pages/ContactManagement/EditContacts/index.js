import React, { Fragment } from 'react';
import Modal from '../../../component/Modal/Skeleton';
import AddContact from '../../AddContact';
import './style.css';

const EditContactModal = ({id, getData, toggleMsgModal, isActive, toggleModal}) =>  {
    return (
        <Fragment>
            {isActive &&
                <Modal
                    removeIcon
                    toggleModal={toggleModal}
                    isActive={isActive}
                    className='edit-contact-modal'
                >
                    <AddContact
                        id={id}
                        toggleModal={toggleModal}
                        getData={getData}
                        toggleMsgModal={toggleMsgModal}
                    />
                </Modal>
            }
        </Fragment>
    )
}

export default EditContactModal

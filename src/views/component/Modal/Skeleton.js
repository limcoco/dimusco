import React from 'react';
import PropTypes from "prop-types";
import classnames from 'classnames';

import logo from '../../../assets/logo.svg';

import './style.css';

const Modal = ({ toggleModal, isActive, small, children, removeIcon, className }) => (
  <section className={classnames('modal', { show: isActive })}>
    <button className="open-modal" type="button" onClick={() => toggleModal()} />
    <div
      className={classnames(`modal__content container ${className}`, {
        modal__small: small
      })}
    >
      <div className="content-wrp">
        {!small && !removeIcon && <img className="modal__icon" src={logo} />}
        {children}
      </div>
    </div>
  </section>
);

Modal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  // TODO: add propTypes to rest props
  // isActive
  // removeIcon
  // small
}


export default Modal;

import React from 'react'
import PropTypes from 'prop-types'
import Modal from './Skeleton'
import makeLineBreaks from '../../../utils/breakLines';

const InfoModal = ({ small, toggleModal, isActive, headline, info, children, action, yesBtn, noBtn, dontWipe }) => (
  <Modal small={small} toggleModal={() => {
    toggleModal()
    dontWipe && dontWipe()
    }} isActive={isActive}>
    {headline && <h3>{makeLineBreaks(headline)}</h3>}
    {info && <p>{makeLineBreaks(info)}</p>}
    {children}
    <div className="submit-input">
      {!yesBtn && <input
        type="button"
        value="OK"
        className="black"
        onClick={() => {
          toggleModal()
          action && action()
        }}
      />}
      {
        yesBtn && 
        <input
        type="button"
        value={yesBtn}
        className="btn black small"
        onClick={() => {
          toggleModal()
          action && action()
        }}
      />
      }
      {
        noBtn && 
        <input
        type="button"
        value={noBtn}
        className="btn black small"
        onClick={() => {
          toggleModal()
          dontWipe && dontWipe()
        }}
      />
      }
    </div>
  </Modal>
)



InfoModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  headline: PropTypes.string.isRequired,
  TokenReducer: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }),
  history: PropTypes.object.isRequired,
  // TODO: add propTypes to rest props
  // info,
  // isActive,
  // small,
}

export default InfoModal

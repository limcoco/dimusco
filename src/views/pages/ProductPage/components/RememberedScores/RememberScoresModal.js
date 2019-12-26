import React, {Component} from 'react';
import Modal from '../../../../component/Modal/Skeleton';
import InfoModal from '../../../../component/Modal/Info';
import RememberedScores from './RememberedScores';
import RememberedScoresDetail from './RememberedScoresDetail';
import Request from "../../../../../utils/Request";
import auth from "../../../../../redux/account/authToken";

class Contacts extends Component {
    state = {
        isActive: false,
        showConfirmationModal: false,
        showLoginRequiredModal: false,
        showConfirmationModal: false,
        activeScoreList: {name: '', scores: []}
    }

    toggleModal = () => {
        const {Token:{token}} = this.props;
        if (token) {
            this.setState({
                isActive: !this.state.isActive
            })
        } else {
            this.toggleLoginRequiredModal()
        }
    }
    toggleConfirmationModal = () => {
        const {showConfirmationModal} = this.state;
        const {toggleRememberedScores} = this.props;
        this.setState({
            showConfirmationModal: !showConfirmationModal,
            isActive: false,
        })
        toggleRememberedScores && toggleRememberedScores()
    }
    toggleLoginRequiredModal = () => {
        const {showLoginRequiredModal} = this.state;
        const {toggleRememberedScores} = this.props;
        this.setState({
            showLoginRequiredModal: !showLoginRequiredModal,
            isActive: false
        })
        toggleRememberedScores && toggleRememberedScores()
    }
    updateScoreList = (scoreList) => {
        this.setState({activeScoreList: scoreList})
    }

    getListDetails = (data) => {
        data.scores = data.score_list
       this.setState({activeScoreList: data})
    }

    close = () => {
        this.setState({
            showConfirmationModal: false,
        })
    }

    render () {
        const { ActiveLanguageReducer: { words }, sid, invitation, scoresActive, toggleRememberedScores, getRememberedScores } = this.props;
        const {showConfirmationModal, showLoginRequiredModal} = this.state;
        
        return (
            <div className='remembered-scores'>
                {!invitation && <button className='btn black medium' onClick={this.toggleModal}>
                    {words.product_remember || 'product_remember'}
                </button>}
                <div className='remembered-scores-details'>
                  <Modal
                    toggleModal={this.toggleConfirmationModal}
                    isActive={showConfirmationModal}
                    removeIcon
                >
                    <a onClick={this.toggleConfirmationModal} className='close'>X</a>
                    <RememberedScoresDetail
                        words={words}
                        sid={sid}
                        toggleConfirmationModal={this.toggleConfirmationModal}
                        updateScoreList={this.updateScoreList}
                        activeScoreList={this.state.activeScoreList}
                        invitation={invitation}
                        getRememberedScores={getRememberedScores}
                        closeModal={this.close}
                    />
                </Modal>
                </div>
                <InfoModal
                    small
                    headline={words['popup_remlist_login_big']}
                    info={words['popup_remlist_login_small']}
                    toggleModal={this.toggleLoginRequiredModal}
                    isActive={showLoginRequiredModal}
                />
                <Modal
                    toggleModal={!invitation ? this.toggleModal : toggleRememberedScores}
                    isActive={!invitation ? this.state.isActive : scoresActive}
                    small
                >
                    <a onClick={!invitation ? this.toggleModal : toggleRememberedScores} className='close'>X</a>
                    <RememberedScores
                         words={words}
                         sid={sid}
                         toggleConfirmationModal={this.toggleConfirmationModal}
                         updateScoreList={this.updateScoreList}
                         toggleLoginRequiredModal={this.toggleLoginRequiredModal}
                         invitation={invitation}
                         toggleDetails={this.toggleConfirmationModal}
                         getListDetails={this.getListDetails}
                    />
                </Modal>
            </div>
        );
    }
}

export default Contacts;
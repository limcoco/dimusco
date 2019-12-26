import React, { Component } from 'react';
import Request from "../../../../../utils/Request";
import auth from '../../../../../redux/account/authToken';
import { throws } from 'assert';
class RememberedScoresDetail extends Component {

    state = {
        name: '',
        items: [],
    }

    componentWillReceiveProps (props) {
        this.setState({
            items: props.activeScoreList.scores.map((item) => {
                item.checked = true;
                return item;
            })
        })
    }

    removeProductFromList = (sid) => {
        const {activeScoreList} = this.props;
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
        }

        Request(
            'patch',
            'add-product-toList',
            headers,
            { name: activeScoreList.name, score_sid: sid },
            [],
            this.removeProductToListSuccess,
            this.removeProductToListFailure,
            undefined,
            undefined
        );
    }

    removeProductToListSuccess = (response) => {
         this.props.updateScoreList(response.data)
    }

    removeProductToListFailure = (error) => {
        console.log('error: ', error);
    }

    addScoreToTransfer = (ev, score) => {
        if (ev.target.checked) {
            this.setState({
                items: this.state.items.map((item)=> {
                    if(item.sid === score.sid) {
                        item.checked = true;
                    }
                    return item;
                })
            })
        } else {
            this.setState({
                items: this.state.items.map((item)=> {
                    if(item.sid === score.sid) {
                        item.checked = false;
                    }
                    return item;
                })
            })
        }
    }

    render () {
        const {words, invitation, getRememberedScores, closeModal } = this.props;
        const {items} = this.state;
        
        return (
            <React.Fragment>
                <h4>{words.popup_remlist_content || 'popup_remlist_content'}</h4>
                <ul>
                    {items.map((score) => {
                        return (
                            <li key={score.play.title} style={invitation ? {justifyContent: 'flex-start'} : {}}>
                                {invitation && 
                                    <label className="control control--checkbox">
                                        <input
                                            type="checkbox"
                                            checked={score.checked}
                                            onChange={(ev) => this.addScoreToTransfer(ev, score)}
                                        />
                                        <div className="control__indicator" />
                                    </label>
                                }
                                {score.play.title} {score.play.composer} {score.instrument}
                                {!invitation && 
                                    <button
                                        className='btn black small'
                                        onClick={() => this.removeProductFromList(score.sid)}
                                    >
                                        {words.popup_remlist_remove || 'popup_remlist_remove'}
                                    </button>
                                }
                            </li>
                        )
                    })}
                </ul>

                {invitation && 
                <button
                    className='btn black meduim'
                    onClick={() => {
                        getRememberedScores(this.state.items.filter((item) => {
                            return item.checked;
                        }));
                        closeModal();
                    }}
                >
                    {words.popup_remlist_transfer || 'popup_remlist_transfer'}
                </button>
                }
            </React.Fragment>
        );
    }
}

export default RememberedScoresDetail;
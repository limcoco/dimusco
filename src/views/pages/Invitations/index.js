import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createInvitation } from "../../../redux/actions/InvitationsActions";
import { getUserDetails } from "../../../redux/actions/profilePageActions/UserDetailsActions";
import Contacts from './Contacts';
import RememberedScores from '../ProductPage/components/RememberedScores';
import InvitationsList from './InvitationsList';
import validator from 'validator';

import './style.css';
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
class Invitations extends Component {
    state = {
        emails: [],
        users: [],
        urls: [],
        comment: '',
        urlsText: '',
        premium_user: 'full_view',
        scores: [],
        valid_days: '',
        pdf_download: false,
        customUser: ''
    }

    componentDidMount () {
        this.props.getUserDetails(this.onGetUserDetailsSuccess)
    }

    onGetUserDetailsSuccess = (response) => {
        this.setState({
            valid_days: response.default_invitation_valid_days
        })
    }

    handleInput = (ev) => {
        if (ev.target.name === 'urls') {
            const value = ev.target.value.split('http').filter((item) => {
                return item.length > 0
            })
            const newUrls = value.map((item) => {
                return `http${item.replace(/\n/g, '')}`
            })
            if (validURL(newUrls[newUrls.length - 1]) && newUrls[newUrls.length - 1].includes('.dimusco.com')) {
                this.setState({
                    [ev.target.name]: newUrls,
                    urlsText: value.map((item, index) => {
                        if (index === (value.length - 1))
                            return `http${item.replace(/\n/g, '')}`;
                        return `http${item.replace(/\n/g, '')}\n`;
                    }).join('')
                })
            }
        } else if (ev.target.name === 'email') {
            this.setState({
                [ev.target.name]: {email: ev.target.value}
            })
        } else {
            this.setState({
                [ev.target.name]: ev.target.value
            })
        }
    }

    handleRemoveUrl = (ev) => {
        const {value} = ev.target;
        if (ev.keyCode === 8) {
            const textareaIndex = value.substr(0, ev.target.selectionStart).split("\n").length;
            setTimeout (() => {
                const filtered = this.state.urls.filter((item, index) => {
                    return (textareaIndex - 1) !== index;
                });
                this.setState({
                    urls: filtered,
                    urlsText: filtered.map((item, index) => {
                        if (index < (filtered.length - 1))
                            return `${item.replace(/\n/g, '')}\n`;
                        return item;
                    }).join('')
                })
            }, 100) 
        }  
    }

    onAddSuccess = (response) => {
        this.setState({
            emails: [],
            users: [],
            urls: [],
            comment: '',
            urlsText: '',
            premium_user: 'full_view',
            scores: [],
            customUser: ''
        })
    }

    onAddFailed = (error) => {
        console.log('error: ', error);
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        const {scores, emails, premium_user, comment, valid_days, customUser, pdf_download} = this.state;
        
        this.props.createInvitation({
            contacts: emails.map((item) => {
                return item.cid;
            }),
            emails: customUser ? customUser.split(' ').filter((email) => {
                return validator.isEmail(email);
            }) : [],
            scores: scores.map((item) => {
                return item.sid;
            }),
            premium_user: this.props.PublisherReducer.is_auth ? premium_user : 'link_only',
            comment,
            valid_days,
            pdf_download
        }, this.onAddSuccess, this.onAddFailed);
    }

    handlePremium = ({target: {value, name}}) => {
        this.setState({
            [name]: value
        })
    }

    getContact = (emails) => {
        this.setState({
            emails: emails,
            users: emails.map((item) => {
                return `${item.first_name} ${item.last_name} ${item.email}\n`;
            }).join('')
        })
    }
    
    toggleModal = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    }

    toggleRememberedScores = () => {
        this.setState({
            scoresActive: !this.state.scoresActive
        })
    }

    getRememberedScores = (scores) => {
        this.setState({
            scores: scores,
            urls: scores.map((score) => {
                return `${score.play.title} ${score.play.composer} ${score.instrument}\n`;
            }).join('')
        })
    }

    handleValidDays = ({target: {value, name}}) => {
        const num = parseInt(value);
        if (num > 0 && num < 32) {
            this.setState({
                [name]: value
            })
        } else if (num < 1) {
            this.setState({
                [name]: '1'
            })
        } else if (num > 31) {
            this.setState({
                [name]: '31'
            })
        }
    }

    clearEmails = () => {
        this.setState({
            emails: [],
            users: ''
        })
    }

    handleCustomUser = ({target: {value, name}}) => {
        this.setState({
            [name]: value
        })
    }

    handleDownloadPdf = ({target: {checked, name}}) => {
        this.setState({
            [name]: checked
        })
    }

    render() {
        const { ActiveLanguageReducer: { words } } = this.props;
        return (
            <div className="invitations fill-screen">
                <RememberedScores
                    invitation
                    scoresActive={this.state.scoresActive}
                    toggleRememberedScores={this.toggleRememberedScores}
                    getRememberedScores={this.getRememberedScores}
                />
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-offset-2 col-md-8 col-xs-12'>
                            <div className='row'>
                                <div className='col-md-offset-3 col-md-6'>
                                    <h2>{words.gen_invitation || 'gen_invitation'}</h2>
                                </div>
                                <div className='col-md-3' style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <InvitationsList words={words} />
                                </div>
                            </div>
                            <Contacts
                                words={words}
                                getContact={this.getContact}
                                toggleModal={this.toggleModal}
                                isActive={this.state.isActive}
                                history={this.props.history}
                            />
                            <form onSubmit={this.handleSubmit}>
                                <div className="box">
                                    <div className="form-group">
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <label>{words['gen_emails'] || 'gen_emails'}</label>
                                           <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-end',
                                                    width: '65%',
                                                    marginBottom: '5px'
                                                }}
                                           >
                                               <input
                                                    className='form-control'
                                                    type='text'
                                                    name='customUser'
                                                    value={this.state.customUser}
                                                    onChange={this.handleCustomUser}
                                                    placeholder={words.invitation_email}
                                                    style={!this.state.customUser ? {textAlign: 'center'} : {}}
                                               />
                                           </div>
                                            <div className="delete-btn" onClick={this.clearEmails}>
                                                <span className="delete-icon" style={{backgroundImage: 'url(media/images/icon/delete.svg)'}}></span>
                                            </div>
                                        </div>
                                        <textarea
                                            className='form-control urls'
                                            rows={4}
                                            name='users'
                                            value={this.state.users}
                                            onFocus={this.toggleModal}
                                            placeholder={words.gen_click_email || 'gen_click_email'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{words['gen_comment']}</label>
                                        <textarea
                                            className='form-control urls'
                                            rows={4}
                                            name='comment'
                                            onChange={this.handleInput}
                                            value={this.state.comment}
                                            placeholder={words.gen_click_comment || 'gen_click_comment'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{words.gen_scores || 'gen_scores'}</label>
                                        <textarea
                                            className='form-control urls'
                                            rows={4}
                                            name='urls'
                                            // onChange={this.handleInput}
                                            value={this.state.urls}
                                            placeholder={words.gen_click_scores || 'gen_click_scores'}
                                            onKeyDown={this.handleRemoveUrl}
                                            onFocus={this.toggleRememberedScores}
                                        />
                                    </div>
                                    {this.props.PublisherReducer.is_auth &&
                                    <div className="filters-catalog">
                                        <div className='zeuge-box center-content'>
                                            <span>{words.invitation_selection || 'invitation_selection'} </span>
                                            <div className='select'>
                                                <select value={this.state.premium_user} onChange={this.handlePremium} name='premium_user'>
                                                    <option value='link_only'>{words['invitation_link'] || 'invitation_link'}</option>
                                                    <option value='full_view'>{words['invitation_preview'] || 'invitation_preview'}</option>
                                                    <option value='perusal_delivery'>{words['invitation_perusal'] || 'invitation_perusal'}</option>
                                                </select>
                                                <div class="select__arrow"></div>
                                            </div>
                                        </div>
                                        <div className='zeuge-box center-content'>
                                            <span>{words.invitation_days || 'invitation_days'} </span>
                                            <div className='select'>
                                                <input value={this.state.valid_days} type='number' name='valid_days' onChange={this.handleValidDays} />
                                            </div>
                                        </div>
                                        <div className='zeuge-box center-content'>
                                            <label className="control control--checkbox">
                                                <span>{words.invitation_pdf || 'invitation_pdf'}</span>
                                                <input type="checkbox" onChange={this.handleDownloadPdf} name='pdf_download' checked={this.state.pdf_download} />
                                                <div className="control__indicator" />
                                            </label>
                                        </div>
                                    </div>
                                    }
                                </div>
                                <div className='centered-btn'>
                                    <button className='btn black small' type='submit'>{words.gen_send || 'gen_send'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        PublisherReducer: state.PublisherReducer,
        userDetails: state.userDetails
    };
};

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({
        createInvitation,
        getUserDetails
    }, dispatch)
});

export default connect(
    mapStateToProps, mapDispatchToProps
)(Invitations);
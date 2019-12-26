import React, { Component } from 'react'
import './style.css';
import axios from "axios"
import server from "../../../../config/server.js"
import urls from "../../../../config/urls.js"

class UpdateUpload extends Component {
    state = {
        actor_id: '',
        user_id: this.props.user_id,
        FileName: '',
        Language: '',
        PubPlayRef: '',
        PubScoreRef: '',
        Title: '',
        Composer: '',
        Instrument: '',
        Edition: '',
        Category: '',
        Duration: '',
        Orchestration: '',
    }

    updateUpload = () => {
        const { toggleLoading } = this.props;
        toggleLoading();
        axios.post(server.API_WUL + urls['update-upload'], this.state)
        .then(this.onUpdateUploadSuccess)
        .catch(this.onUpdateUploadFailed)
    }

    onUpdateUploadSuccess = () => {
        const { toggleLoading, onReadScore, toggleModal, words } = this.props;
        toggleLoading();
        onReadScore();
        toggleModal(words.popup_return_good);
        this.setState({
            FileName: '',
            Language: '',
            PubPlayRef: '',
            PubScoreRef: '',
            Title: '',
            Composer: '',
            Instrument: '',
            Edition: '',
            Category: '',
            Duration: '',
            Orchestration: '',
            actor_id: '',
            user_id: ''
        })
    }
    
    onUpdateUploadFailed = (error) => {
        const { toggleLoading, toggleModal, words } = this.props;
        toggleModal(words.popup_return_bad);
        toggleLoading();
    }

    handleChange = ({target: {name, value}}) => {
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.setState({
            Language: this.props.lang,
            actor_id: this.props.actor_id
        }, () => {
            this.updateUpload();
        })
    }

    render() {
        const {words} = this.props;
        return (
            <form className='update-upload' onSubmit={this.handleSubmit}>
                <div className='row'>
                    <div className='col-md-offset-3 col-md-6'>
                        <h2 className="title">{words.upload_meta}</h2>
                    </div>
                    <div className='col-md-3 d-flex' style={{justifyContent: 'flex-end'}}>
                        <button className='btn black small' style={{height: '33px'}}>{words.gen_upload}</button>
                    </div>
                </div>
                <div className='row'>
                    <div className='form-group col-md-3'>
                        <label>{words.gen_title}</label>
                        <input className='form-control' name='Title' value={this.state.Title} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-2'>
                        <label>{words.gen_composer}</label>
                        <input className='form-control' name='Composer' value={this.state.Composer} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-2'>
                        <label>{words.gen_edition}</label>
                        <input className='form-control' name='Edition' value={this.state.Edition} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-2'>
                        <label>{words.gen_instrument}</label>
                        <input className='form-control' name='Instrument' value={this.state.Instrument} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-2'>
                        <label>{words.gen_category}</label>
                        <input className='form-control' name='Category' value={this.state.Category} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-1'>
                        <label>{words.gen_duration}</label>
                        <input className='form-control' name='Duration' value={this.state.Duration} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-3'>
                        <label>{words.gen_filename || 'FileName'}</label>
                        <input className='form-control' name='FileName' value={this.state.FileName} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-3'>
                        <label>{words.pub_play_ref || 'pub_play_ref'}</label>
                        <input className='form-control' name='PubPlayRef' value={this.state.PubPlayRef} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-3'>
                        <label>{words.pub_score_ref || 'pub_score_ref'}</label>
                        <input className='form-control' name='PubScoreRef' value={this.state.PubScoreRef} onChange={this.handleChange} />
                    </div>
                    <div className='form-group col-md-3'>
                        <label>{words.gen_orchestration || 'gen_orchestration'}</label>
                        <input className='form-control' name='Orchestration' value={this.state.Orchestration} onChange={this.handleChange} />
                    </div>
                </div>
            </form>
        )
    }
}

export default UpdateUpload;
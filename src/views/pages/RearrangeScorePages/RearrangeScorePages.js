import React, { Component } from 'react';
import Request from "../../../utils/Request";
import auth from '../../../redux/account/authToken';
import './style.css';
import server from "../../../config/server.js"
import {InfoModal} from '../../component/Modal';
import Radio from "../../component/Radio";

class ProductSettings extends Component {
    state = {
        items: [],
        action: 'move'
    }

    componentDidMount () {
        this.getScorePages();
        
    }

    storeData = (data) => {
        this.setState({
            items: data.map((item) => {
                return item;
            })
        })
    }

    getScorePages = () => {
        const {match: { params: { id } }} = this.props;
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'get',
            'score-pages',
            headers,
            {assignment: id},
            [],
            this.getScoreSuccess,
            this.getScoreFailure
        );
    }

    getScoreSuccess = (response) => {
       this.storeData(response.data)
    }

    getScoreFailure = (error) => {
        console.log('error: ', error);
    }

    rearrangeScorePages = (pages, destination) => {
        const {match: { params: { id } }} = this.props;
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'patch',
            'order-score-pages',
            headers,
            {
                assignment: id,
                pages: pages.map((item) => {
                    return item.paid;
                }),
                destination
            },
            [],
            this.rearrangeScorePagesSuccess,
            this.rearrangeScorePagesFailure
        );
    }

    rearrangeScorePagesSuccess = (response) => {
        this.setState((state) => { return { ...state, items: response.data }})
    }

    rearrangeScorePagesFailure = (error) => {
        console.log('error: ', error);
    }


    copyScorePages = (pages, destination) => {
        const {match: { params: { id } }} = this.props;
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'post',
            'copy-score-page',
            headers,
            {
                assignment: id,
                pages: pages.map((item) => {
                    return item.paid;
                }),
                destination
            },
            [],
            this.copyScorePagesSuccess,
            this.copyScorePagesFailure
        );
    }

    copyScorePagesSuccess = (response) => {
        this.setState((state) => { return { ...state, items: response.data }})
    }

    copyScorePagesFailure = (error) => {
        console.log('error: ', error);
    }
    
    activatePages = (page, active) => {
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'patch',
            'score-page',
            headers,
            {
                page,
                active
            },
            [],
            this.activatePagesSuccess,
            this.activatePagesFailure
        );
    }

    activatePagesSuccess = (response) => {
    }

    activatePagesFailure = (error) => {
        console.log('error: ', error);
    }

    onDragStart = (index) => {
        this.setState({
            dragged: index
        })
    }

    allowDrop = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev, page_number) => {
        ev.preventDefault();
        ev.stopPropagation();
        const { dragged, items } = this.state;
        this.rearrangeScorePages([items[dragged]], page_number);
    }

    handlePageActivation = (page, { target: { checked } }) => {
        const { items } = this.state;
        this.setState({
            items: items.map((item) => {
                if (item.paid === page)
                    item.state = checked ? 1 : 0;
                return item;
            })
        })
        this.activatePages(page, checked ? 1 : 0)
    }


    toggleModal = () => {
        this.setState((state) => { return {
            ...state,
            isActive: !state.isActive
        }})
    }

    handleAction = ({value}) => {
        this.setState((state) => { return { ...state, action:  value}})
    }

    handleInput = ({ target: { name, value } }) => {
        this.setState((state) => { return { 
            ...state,
            [name]: value
         }})
    }

    handleModalSubmit = () => {
        const {from, to, place, items, action} = this.state;
        const array = items.slice(parseInt(from - 1), parseInt(to));
        if (from && to && place) {
            if (action === 'move')
            this.rearrangeScorePages(array, parseInt(place));
            else
            this.copyScorePages(array, parseInt(place));
        }

    }

    addBlankPage = (destination) => {
        const {match: { params: { id: assignment } }} = this.props;
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'post',
            'add-blank',
            headers,
            {
                assignment,
                destination
            },
            [],
            this.addBlankPageSuccess,
            this.addBlankPageFailure
        );
    }

    addBlankPageSuccess = (response) => {
        this.setState((state) => { return { ...state, items: response.data }})
    }

    addBlankPageFailure = (error) => {
        console.log('error: ', error);
    }

    removeBlankPage = (destination) => {
        const {match: { params: { id: assignment } }} = this.props;
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'patch',
            'remove-blank',
            headers,
            {
                assignment,
                destination
            },
            [],
            this.removeBlankPageSuccess,
            this.removeBlankPageFailure
        );
    }

    removeBlankPageSuccess = (response) => {
        this.setState((state) => { return { ...state, items: response.data }})
    }

    removeBlankPageFailure = (error) => {
        console.log('error: ', error);
    }

    setInitValue = (page) => {
        this.setState({
            to: page,
            from: page,
            place: page + 1
        })
    }

    render () {
        const { words } = this.props.ActiveLanguageReducer;

        const { items, isActive, action, to, from, place } = this.state;
        
        return (
            <div className="rearrange-pages">
                <div className='container'>
                    <InfoModal
                        toggleModal={this.toggleModal}
                        isActive={isActive}
                        small
                        action={this.handleModalSubmit}
                    >
                        <div className='d-flex'>
                            <Radio
                                value='move'
                                label={'Move'}
                                onChange={this.handleAction}
                                name='action'
                                checked={action === 'move'}
                            />

                            <Radio
                                value='copy'
                                label={'Copy'}
                                onChange={this.handleAction}
                                name='action'
                                checked={action === 'copy'}
                            />
                        </div>

                        <div className='d-flex'>
                            <label>page</label> <input type='text' name='from' value={from} onChange={this.handleInput} /> .. <input type='text' name='to' value={to} onChange={this.handleInput} />
                        </div>

                        <div className='d-flex'>
                            <label>before page</label> <input type='text' name='place' value={place} onChange={this.handleInput} />
                        </div>
                    </InfoModal>
                    <div className='row'>
                        {items.map((item, index) => {
                            return (
                                <div className='col-md-3' key={item.paid}>
                                    <div 
                                        className={`page ${!item.state && 'disabled'}`}
                                        draggable
                                        onDragStart={() => this.onDragStart(index)}
                                        onDragOver={this.allowDrop}
                                        onDrop={(ev) => this.onDrop(ev, item.page_number)}
                                    >
                                        <span className='badge' onClick={() => {
                                            this.toggleModal();
                                            this.setInitValue(item.page_number);
                                        }}>{item.page_number}</span>
                                        {!item.unauthed && <img src={`${server.API_WDL}item/thumbnail/${item.paid}/?token=${auth.getActiveToken()}`} />}
                                        {item.unauthed &&
                                            <div className="message-box">
                                                {words.prod_preview_limit || 'prod_preview_limit'}
                                            </div>
                                        }
                                        <label>
                                            Activate: 
                                            <input
                                                type='checkbox'
                                                onChange={(ev) => this.handlePageActivation(item.paid, ev)}
                                                checked={item.state}
                                            />
                                        </label>
                                        {item.type ?
                                        <button className='btn black' onClick={() => this.removeBlankPage(item.page_number)}>-</button>
                                        :
                                        <button className='btn black' onClick={() => this.addBlankPage(item.page_number)}>+</button>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductSettings;
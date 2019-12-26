import React, { Component } from 'react';
import Request from "../../../../utils/Request";
import {dateText, dateInput} from "../../../../utils/dateFormating";
import Auth from '../../../../redux/account/authToken';

import DropDown from "../../../component/DropDown";

class OrderHistory extends Component {
    constructor (props) {
        super(props);
        this.token = Auth.getActiveToken();
        this.state = {
            items: [],
            ordering: ''
        }
        this.onLoadFailed = this.onLoadFailed.bind(this);
        this.handleDate  = this.handleDate.bind(this);
        this.handleDropDown  = this.handleDropDown.bind(this);
        this.onSort  = this.onSort.bind(this);
    }

    componentDidMount() {
        this.getOrdersHistory()
    }

    getOrdersHistory = () => {
        this.props.getOrdersHistory(this.state, this.onLoadSuccess, this.onLoadFailed)
    }

    onLoadSuccess = () => {
        this.setState({
            items: this.props.ordersHistory
        })
    }

    onLoadFailed(error) {
        console.log('error: ', error);
    }   

    handleDate (ev) {
        if (ev.keyIdentifier == "Down") {
            ev.preventDefault()
        }
        this.setState({
            [ev.target.name]: ev.target.value
        }, () => {
            this.getOrdersHistory()
        })

    }

    handleDropDown ({ value }) {
        this.setState({
            active:  value
        }, () => {
            this.getOrdersHistory()
        })
    }

    onSort (sortby) {
        this.setState((state) => ({
            ...state,
            ordering: state.ordering === sortby ? `-${sortby}` : sortby
        }), () => {
            this.getOrdersHistory()
        })
    }

    render () {
        const { ActiveLanguageReducer: { words } } = this.props;
        const { items } = this.state;
        
        return (
            <div className='order-histroy'>
                <h2>{words['gen_order_history']}</h2>
                <div className='filters'>
                    <div className='right-cont'>
                        <div className='start-date'>
                            <label>{words.gen_from}:</label>
                            <input type='date' name='start_date' onChange={this.handleDate} id='start-date' />
                        </div>
                        <div className='end-date'>
                            <label>{words.gen_to}:</label>
                            <input type='date' name='end_date' onChange={this.handleDate} />
                        </div>
                    </div>
                    <div className='left-cont'>
                        <label>{words.gen_active}</label>
                        
                        <DropDown
                            options={[
                                {value: '', label: words.gen_none},
                                {value: 0, label: words.gen_yes},
                                {value: 1, label: words.gen_no},
                            ]}
                            onChange={this.handleDropDown}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th />
                            <th style={{width: '340px'}}><a onClick={() => this.onSort('score')}>{words.gen_score} <i className='sort-icon' /></a></th>
                            <th><a onClick={() => this.onSort('start')}>{words.gen_ordered} <i className='sort-icon' /></a></th>
                            <th><a onClick={() => this.onSort('state')}>{words.gen_active} <i className='sort-icon' /></a></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.map((item) => {
                            return (
                                <tr key={item.pid}>
                                    <td>
                                    <div className="lite-product" role="button" onClick={this.gotoProduct}>
                                        <div className="top-row">
                                        <img src="../media/images/product.jpg" width="93" height="83" />
                                        </div>
                                        <div className="middle-row">
                                            <a tabIndex="0" role="button" className="link-to-product">
                                                <h2 className="product-title">{item.book.play.title}</h2>
                                            </a>
                                            <ul>
                                                {item.book.play.composer && <li>{words.similarproduct_composer}: <span>{item.book.play.composer}</span></li>}
                                                {item.book.play.category && <li>{words.catalog_category}: <span>{item.book.play.category}</span></li>}
                                                {item.book.edition && <li>{words.similarproduct_edition}: <span>{item.book.edition}</span></li>}
                                                {item.book.instrument && <li>{words.similarproduct_instrument}: <span>{item.book.instrument}</span></li>}
                                            </ul>
                                        </div>
                                    </div>
                                    </td>
                                    <td style={{width: '386px'}}>
                                        <p>
                                            <strong>{item.book.play.title}</strong>
                                            {item.book.play.composer && `, ${item.book.play.composer}`}
                                            {item.book.play.category && `, ${item.book.play.category}`}
                                            {item.book.edition && `, ${item.book.edition}`}
                                            {item.book.instrument && `, ${item.book.instrument}`}
                                            {item.book.play.duration && `, ${item.book.play.duration}`}
                                        </p>
                                    </td>
                                    <td><span>{dateText(item.created_at)}</span></td>
                                    <td><span>{item.state? words.gen_no: words.gen_yes}</span></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default OrderHistory;
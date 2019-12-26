import React, { Component, Fragment } from 'react';
import Modal from '../../component/Modal/Skeleton';
import Table from '../../component/Table/Table.js';
import moment from 'moment';
import Request from "../../../utils/Request";
import auth from '../../../redux/account/authToken';
import './AssignScore.css';

class AddScore extends Component {
    state = {
        libraryScores: [],
        ordering: ''
    }

    componentDidMount () {
        this.getNormalScores();
    }

    getNormalScores = () => {
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'get',
            'library-read',
            headers,
            {ordering: this.state.ordering},
            [],
            this.getNormalScoresSuccess,
            this.getNormalScoresFailure
        );
    }

    getNormalScoresSuccess = (response) => {
        this.setState((state) => { return { ...state, libraryScores: response.data.results || [] }})
    }

    getNormalScoresFailure = (error) => {
        console.log('error', error)
    }

    toggleModal = () => {
        const {isActive} = this.state;
        this.setState({
            isActive: !isActive
        })
        this.getNormalScores()
    }

    addingScore = () => {
        const {prid} = this.props;
        const {libraryScores} = this.state;
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'post',
            'production-library',
            headers,
            {scores: libraryScores.filter((item) => item.checked).map(({sid}) => sid), production: prid},
            [],
            this.addingScoreSuccess,
            this.addingScoreFailure
        );
    }

    addingScoreSuccess = (response) => {
        this.toggleModal();
        this.props.getProductionScores()
    }

    addingScoreFailure = (error) => {
        console.log('error: ', error);
    }

    handleInput = ({target: {checked}},value) => {
        this.setState((state) => { return { ...state,
            libraryScores: state.libraryScores.map((item) => {
                if (value === item.sid) {
                    item.checked = checked;
                }
                return item;
            })
        }})
        
    }

    onTableHeaderItemClick = (e, data) => {
        let fields = data.data.sort.split(',')
        for (let i = 0; i < fields.length; i++) {
          if (!data.ascending) {
            fields[i] = '-' + fields[i]
          }
        }
        this.setState({
          ordering: fields.join(',')
        }, () => {
          this.getNormalScores()
        })
    }
      
    render () {
        const {words} = this.props;
        const {isActive, score} = this.state;

        let tableColumns = [
            ' ',
            words.gen_title,
            words.gen_composer,
            words.gen_instrument,
            words.gen_from,
            words.gen_to,
          ];
      
          let tableColumnExtras = {};
          tableColumnExtras[' '] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-1 col-sm-1 col-xs-12 ',
            canSort: false
          };
          tableColumnExtras[words.gen_title] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
            canSort: true,
            data: {
              sort: 'score__ssid__original_title'
            }
          };
          tableColumnExtras[words.gen_composer] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
            canSort: true,
            data: {
              sort: 'score__ssid__original_composer'
            }
          };
          tableColumnExtras[words.gen_instrument] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
            canSort: true,
            data: {
              sort: 'score__original_instrument'
            }
          };
          tableColumnExtras[words.gen_from] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
            canSort: true,
            data: {
              sort: 'from'
            }
          };
          tableColumnExtras[words.gen_to] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-md-2 col-sm-2 col-xs-12 descrease-width ',
            canSort: true,
            data: {
              sort: 'expire'
            }
          };
          const { libraryScores } = this.state;
          
        return (
            <div className='add-score-modal'>
                <button className='btn black small' onClick={this.toggleModal}>
                    {words.mod_score_add_score || 'mod_score_add_score'}
                </button>
                <Modal
                    toggleModal={this.toggleModal}
                    isActive={isActive}
                >
                    <a onClick={this.toggleModal} className='close'>X</a>
                    <Table
                            columns={tableColumns}
                            columnsExtras={tableColumnExtras}
                            onHeaderItemClick={this.onTableHeaderItemClick}
                            noDataDesc={words.library_empty}
                        >
                            {libraryScores.map((item) => {
                                return  (
                                    <li className="standart-container transition-all" key={item.aid}>
                                        <div className='no-margin row full-width'>
                                            <div className={"col-content col-md-1 col-sm-1 col-xs-12"}>
                                                <div className="book-title">
                                                <label className="control control--checkbox">
                                                    <input
                                                        type="checkbox"
                                                        onChange={(ev) => this.handleInput(ev, item.sid)}
                                                        name='score'
                                                        checked={item.checked}
                                                    />
                                                    <div className="control__indicator" />
                                                </label>
                                                </div>
                                            </div>
                                            <div className={"col-content col-md-3 col-sm-3 col-xs-12"}>
                                                <div className="book-title">
                                                {item.title}
                                                </div>
                                            </div>
                                            <div className={"col-content col-md-2 col-sm-2 col-xs-12"}>
                                                <div className="book-title">
                                                    {item.composer.value}
                                                </div>
                                            </div>
                                            <div className={"col-content col-md-2 col-sm-2 col-xs-12"}>
                                                <div className="book-title">
                                                    {item.instrument}
                                                </div>
                                            </div>
                                            <div className={"col-content col-md-2 col-sm-2 col-xs-12"}>
                                                <div className="book-title">
                                                    {moment(item.start).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                            <div className={"col-content col-md-2 col-sm-2 col-xs-12"}>
                                                <div className="book-title">
                                                    {moment(item.end).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </Table>
                        <button
                            className='btn black small'
                            onClick={this.addingScore}
                            disabled={!libraryScores.filter((item) => item.checked).length}
                        >
                            {words.gen_add}
                        </button>
                </Modal>
            </div>
        )
    }
}

export default AddScore;
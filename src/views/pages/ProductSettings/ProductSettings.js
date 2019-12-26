import React, { Component } from 'react';
import Request from "../../../utils/Request";
import auth from '../../../redux/account/authToken';
import Table from '../../component/Table/Table.js';
import './style.css';
import { Link } from 'react-router-dom';
import AddScoreModal from './AddScoreModal';

class ProductSettings extends Component {
    state = {
        score: {},
        title: this.props.location.state ? this.props.location.state.title : '',
        ordering: ''
    }

    componentDidMount () {
        this.setState({
            score: this.props.location.state || {}
        })
        this.fetchData();
    }

    getScorePages = () => {
        const {match: { params: { id } }} = this.props;
        this.setState({
            isLoading: true
        })
        this.props.getScorePages(undefined, undefined, {assignment: id, ordering: this.state.ordering});
    }

    getVirtualScoreScroes = () => {
        const {score: {sid}} = this.state;
        const payloads = {
            ['virtual-score']: sid
        }
        if (sid)
        this.props.getVirtualScoreLibrary(payloads)
    }

    fetchData = () => {
        this.getScorePages();
        this.getVirtualScoreScroes();
    }

    updateScoreTitle = () => {
        const {match: { params: { id } }} = this.props;
        const {title} = this.state;
        this.setState({
            isLoading: true
        })
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'patch',
            'update-title',
            headers,
            {assignment: id, title},
            [],
            this.updateScoreTitleSuccess,
            this.updateScoreTitleFailure
        );
    }

    updateScoreTitleSuccess = (response) => {
        this.setState({
            score: response.data
        })
        
    }

    updateScoreTitleFailure = (error) => {
        console.log('error: ', error);
    }

    onTableHeaderItemClick = () => {
        console.log('clicked');
    }

    handleScoreTitle = (ev) => {
        ev.preventDefault();
        this.updateScoreTitle();
    }

    handleInput = ({target: {name, value}}) => {
        this.setState({
            [name]: value
        })
    }

    removeScore = (score) => {
        const {match: { params: { id } }} = this.props;
        this.setState({
            isLoading: true
        })
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
        
        Request(
            'delete',
            'related-scores',
            headers,
            {from_score: score, to_assignment: id},
            [],
            this.removeScoreSuccess,
            this.removeScoreFailure,
            undefined,
            undefined,
            `?from_score=${score}&to_assignment=${id}`
        );
    }

    removeScoreSuccess = (response) => {
        this.fetchData()
    }

    removeScoreFailure = (error) => {
        console.log('error: ', error);
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
          this.getScorePages()
        })
    }


    render () {
        const { words } = this.props.ActiveLanguageReducer;

        const { title, score } = this.state;

        const tableColumns = [
            words.gen_title,
            words.gen_composer,
        ];
        const tableColumnExtras = {};
        tableColumnExtras[words.gen_title] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-5 col-sm-5 col-xs-12 ',
            canSort: true,
            data: {
                sort: 'score__ssid__original_title'
            }
        };
        tableColumnExtras[words.gen_composer] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-4 col-sm-4 col-xs-12 ',
            canSort: true,
            data: {
                sort: 'score__ssid__original_composer'
            }
        };
        tableColumnExtras[''] = {
            disabled: true,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
            canSort: true,
            data: {
              sort: ''
            }
        };
        const {match: { params: { id } }, scorePages} = this.props;
            
        return (
            <div className="set-price score-settings">
                <h2>{words.mod_score_title || 'mod_score_title'}</h2>
                <div className='container'>
                    <div className='d-flex'>
                        <h3>
                        {words.gen_score_title || 'gen_score_title'}: 
                        </h3>
                        <input
                            type='text'
                            name='title'
                            onChange={this.handleInput}
                            value={title}
                            onBlur={this.handleScoreTitle}
                        />
                    </div>
                    <h3>{words.gen_orig_scores || 'gen_orig_scores'}</h3>
                    <section className="user-content institution-content">
                        <Table
                            columns={tableColumns}
                            columnsExtras={tableColumnExtras}
                            onHeaderItemClick={this.onTableHeaderItemClick}
                            noDataDesc={words.library_empty}
                        >
                            {scorePages.map((item) => {
                                return (
                                    <li className="standart-container transition-all" key={item.sid}>
                                        <div className='no-margin row full-width'>
                                            <div className={"col-content col-md-5 col-sm-5 col-xs-12"}>
                                                <div className="book-title">
                                                    {item.play.title}
                                                </div>
                                            </div>
                                            <div className={"col-content col-md-4 col-sm-4 col-xs-12"}>
                                                <div className="book-title">
                                                    {item.play.composer}
                                                </div>
                                            </div>
                                            <div className="col-content col-md-3 col-sm-3 col-xs-12 dropdown member-menu">
                                                <button
                                                    className="btn-primary library-delete-btn"
                                                    onClick={() => this.removeScore(item.sid)}
                                                >
                                                    {words.gen_remove}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </Table>
                    </section>
                    <div className='buttons-wrp'>
                        {score.sid &&
                            <AddScoreModal
                                words={words}
                                getLibraryScores={this.props.getVirtualScoreLibrary}
                                libraryScores={this.props.virtualLibraryScores}
                                id={id}
                                getScorePages={this.getScorePages}
                                sid={score.sid}
                                prid={score.prid}
                            />
                        }
                        <Link
                            className='btn black small'
                            to={`/pages/rearrange/${id}`}
                        >
                            {words.mod_score_rearrange_page || 'mod_score_rearrange_page'}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductSettings;
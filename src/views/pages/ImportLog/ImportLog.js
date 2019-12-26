import React, { Component } from 'react';
import './style.css';
import Request from "../../../utils/Request";
import auth from "../../../redux/account/authToken";
import PaginationHeader from '../SetPrice/components/PaginationHeader';
import { Link } from 'react-router-dom';

class ImportLog extends Component {

    state = {
        items: [],
        page: 1,
        rpp: 20,
        count: 0,
        search: '',
        loading: false
    };

    componentDidMount() {
        this.getData(this.state)
    }

    getData = (data) => {
        const headers = {
            Authorization: "Token " + auth.getActiveToken()
        };
        const {page, rpp} = this.state;
        const payload = {
            page: data.page || page,
            rpp: data.rpp || rpp,
            search: data.search,
            sort: data.sort
        }
        this.setState({
            loading: true
        })
        Request(
            "get",
            "get-import-log",
            headers,
            payload,
            [],
            this.getDataSuccess,
            this.getDataFailure,
            undefined,
            undefined
        );
    };

    getDataSuccess = response => {
        this.setState({
            items: response.data.results,
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            page: response.data.current,
            pages_number: response.data.pages_number,
            loading: false
        });
    };

    getDataFailure = error => {
        this.setState({
            loading: false
        })
    };

    handlePageClick = data => {
        const selected = data.selected + 1;
        this.setState({
            page: selected,
        }, () => {
            this.getData(this.state);
        })
    };

    callScoresWithRPP = () => {
        const resData = {
          page: 1,
          rpp: this.state.rpp > 0 ? this.state.rpp : 1
        };
    
        this.getData(resData);
    }

    changeRPP = (event) => {
        if (event.target.value < 1000 && event.target.value > 0)
            this.setState({ rpp: event.target.value });
        else if (event.target.value >= 1000)
            this.setState({ rpp: 999 });
        else if (event.target.value < 1)
            this.setState({ rpp: 1 });
    }

    handleSort = (field) => {
        const value = field === this.state.sortValue ? `-${field}` : field;
        this.setState({sortValue: value}, () => {
            this.getData({sort: value});
        })
    }

    handleSearch = (ev) => {
        ev.preventDefault();
        const { search } = this.state;
        this.getData({search})
    }
    
    render () {
        const {
            ActiveLanguageReducer: { words },
            PublisherReducer: { publisher: { name } }
        } = this.props;
        
        const { items } = this.state;

        const {
            page,
            rpp,
            count,
            pages_number,
            loading
        } = this.state;
        
        return (
            <div className={`import-log full-height ${loading && 'progress'}`}>
                <div className='container'>
                    <h2>{words.gen_import}</h2>
                    <div className='row'>
                        <form className='col-xs-4 search' onSubmit={this.handleSearch}>
                            <input type='text' onChange={({target: {value}}) => this.setState({search: value})} />
                            <button className='btn black small' type='submit'>{words.gen_find}</button>
                        </form>
                        <div className='col-xs-8'>
                            <PaginationHeader
                                currentPage={page}
                                number_page={pages_number || (count/(rpp > 0 ? rpp : 1))}
                                handlePageClick={this.handlePageClick}
                                words={words}
                                number_result={count}
                                rpp={rpp}
                                changeRPP={this.changeRPP}
                                callScoresWithRPP={this.callScoresWithRPP}
                                marginDisplay={1}
                                page_range={2}
                                navNull={true}
                            />
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <a onClick={() => this.handleSort('publisher_score_id')}>
                                        {words.import_pub_ref || 'import_pub_ref'} <i className='sort-icon' />
                                    </a>
                                </th>
                                <th>
                                    <a onClick={() => this.handleSort('score')}>
                                        {words.import_dimusco_id || 'import_dimusco_id'} <i className='sort-icon' />
                                    </a>
                                </th>
                                <th>
                                    <a onClick={() => this.handleSort('state')}>
                                        {words.gen_state || 'gen_state'} <i className='sort-icon' />
                                    </a>
                                </th>
                                <th>
                                    <a onClick={() => this.handleSort('comment')}>
                                        {words.gen_comment} <i className='sort-icon' />
                                    </a>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                return (
                                    <tr key={item.publisher_score_id}>
                                        <td>{item.publisher_score_id}</td>
                                        <td><Link to={`/product/copy/${item.score}`} target="_blank">{item.score}</Link></td>
                                        <td>{words[`import_log_state_${item.state}`] || `import_log_state_${item.state}`}</td>
                                        <td>{item.comment ? item.comment : '-'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ImportLog;
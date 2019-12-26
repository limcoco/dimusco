import React from 'react';
import qs from 'query-string';

import moment from 'moment';

import PaginationNumber from '../../component/PaginationNumber';
import Header from './components/Header';
import Grid from './components/Grid';

/* Utils */
import toUTC from '../../../utils/toUTC.js';

import HomeFilters from '../../pages/home/HomeFilters'
import SearchInput from '../../component/SearchInput'
import './style.css';
import Table from '../../component/Table/Table.js';
import {Link} from 'react-router-dom'

class Catalog extends React.Component {
  state = {
    isLoading: this.props.isLoadingContent,
    isError: false,
    searchQuery: qs.parse(this.props.location.search).q,
    rpp: 10,
    sort: 'relevance',
    items: [],
    count: null,
    currentPage: 0,
    number_page: 0,
    nextLink: null,
    prevLink: null,
    searchFilterPopupIndex: 0,
    page: qs.parse(this.props.location.search).page || 1
  };

  gotoProduct(sid, ssid) {
    // https://stackoverflow.com/questions/38678804/in-react-router-how-do-you-pass-route-parameters-when-using-browser-history-pus
    this.props.history.push({
        pathname: '/product/' + sid,
        state: { SSID: ssid }
    })
  }

  onRead = (data = {}) => {
    const { searchQuery, rpp, sort, page } = this.state;
    // load data with search and page 1
    const payload = {
      q: data.searchQuery || searchQuery,
      page: data.page || page,
      rpp: data.rpp || rpp,
      sort: data.sort || sort,
    };
    this.props.getProducts(payload);
  };

  convertToUTC = date => {
    let tmpDate = date;
    return toUTC(tmpDate._d);
  };

  changeRPP = event => {
    let val = event.target.value;
    let data = {
      q: this.state.searchQuery,
      page: 1,
      rpp: val,
      sort: this.state.sort,
    };
    this.setState({ rpp: val });
    this.onRead(data);
  };

  changeSort = event => {
    let val = event.target.value;
    let data = {
      q: this.state.searchQuery,
      page: 1,
      rpp: this.state.rpp,
      sort: val,
    };
    this.setState({ sort: val });
    this.onRead(data);
  };

  componentDidMount() {
    this.onRead();
  }

  pagination = page => {
    const { searchQuery, rpp, sort } = this.state;
    const {history} = this.props;
    let data = {
      q: searchQuery,
      page: page,
      rpp: rpp,
      sort: sort,
    };
    this.onRead(data);
    history.push(`/catalog/?page=${page}`)
  };

  handlePageClick = data => {
    let selected = data.selected + 1;
    this.pagination(selected);
  };

  handleSearchSubmit = () => {
    this.onRead()
  }

  handleSearchQueryChange = searchQuery => {
    this.setState({ searchQuery })
  }

  handleSearchQueryClear = () => {
    this.setState({ searchQuery: '' })
  }

  toggleSearchFilterPopup = (index = null) => {
    if (!index || this.state.searchFilterPopupIndex === index) {
      this.setState({
        searchFilterPopupIndex: 0,
      })
    } else {
      this.setState({
        searchFilterPopupIndex: index,
      })
    }
  }

  handleComposerClick = data => {
    let { searchQuery } = this.state
    if (data.name.trim() !== '') {
      if (searchQuery.trim() && !searchQuery.endsWith(' ')) {
        searchQuery += ' '
      }
      searchQuery += data.name
      this.setState({ searchQuery: searchQuery })
    }
    this.toggleSearchFilterPopup(0)
    window.scrollTo(0, 0)
  }

  onTableHeaderItemClick = (e, data) => {
    if (data.data === null) return

    let fields = data.data.sort.split(',')
    for (let i = 0; i < fields.length; i++) {
      if (!data.ascending) {
        fields[i] = '-' + fields[i]
      }
    }
    this.setState({ sort: fields.join(',')}, () => {
      this.onRead()
    })
  }
  
  render() {
    const { Product, ActiveLanguageReducer } = this.props;
    const { sort, rpp } = this.state;
    const { words, lang } = ActiveLanguageReducer;
    const { products, currentPage, numberPage, count, loading } = Product;
    let tableColumns = [
      words.gen_title,
      words.gen_composer,
      words.gen_publisher,
      'Full score',
      'Piano Score',
      words.gen_voices || 'gen_voices',
      words.gen_orchestration
    ]

    let tableColumnExtras = {}
    tableColumnExtras[words.gen_title] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 title-column',
      canSort: true,
      data: {
        sort: 'title',
      },
    }
    tableColumnExtras[words.gen_composer] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'composer',
      },
    }
    tableColumnExtras[words.gen_publisher] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'publisher',
      },
    }
    tableColumnExtras['Full score'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12',
      canSort: true,
      data: {
        sort: 'full_score',
      },
    }
    tableColumnExtras['Piano Score'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12',
      canSort: true,
      data: {
        sort: 'piano_score',
      },
    }

    tableColumnExtras[words.gen_voices || 'gen_voices'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12',
      canSort: true,
      data: {
        sort: 'loves',
      },
    }

    tableColumnExtras[words.gen_orchestration] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 orchestration-column',
      canSort: true,
      data: {
        sort: 'orchestration',
      },
    }

    return (
      <div className={`animated fadeIn catalog-page ${loading && 'progress'}`}>
        <section className="set-price" style={{height: 'auto'}}>
          <div className="search-area filters-as-popup">
            <div className='container'>
              <div className="row search-form-box">
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <SearchInput
                    searchQuery={this.state.searchQuery}
                    words={words}
                    onSubmit={this.handleSearchSubmit}
                    onChange={this.handleSearchQueryChange}
                    onClear={this.handleSearchQueryClear}
                  />
                </div>
              </div>
              <HomeFilters
                props={this.props}
                activeTabIndex={this.state.searchFilterPopupIndex}
                toggleTab={this.toggleSearchFilterPopup}
                words={words}
                lang={lang}
                handleComposerClick={this.handleComposerClick}
                isCatalog
              />
            </div>
          </div>
        </section>
        <Header
          count={count}
          words={words}
          currentPage={currentPage}
          number_page={numberPage}
          onPageClick={this.handlePageClick}
          changeSort={this.changeSort}
          sort={sort}
          changeRPP={this.changeRPP}
          rpp={rpp}
        />
        <section className="product-gird">
          <div className="container">
            <div className="row">
              <Table
                columns={tableColumns}
                columnsExtras={tableColumnExtras}
                onHeaderItemClick={this.onTableHeaderItemClick}
              >
                {products.map((item) => {
                  return (
                    <li class="transition-all" onDoubleClick={() => this.gotoProduct(item.sid, item.ssid)}>
                      <div class="pointer no-margin row full-width">
                          <div class="col-content col-body col-md-2 col-sm-2 col-xs-12 title-column">{item.title}</div>
                          <div class="col-content col-body col-md-2 col-sm-2 col-xs-12">{item.composer.name}</div>
                          <div class="col-content col-body col-md-2 col-sm-2 col-xs-12">{item.publisher}</div>
                          <div class="col-content col-body col-md-2 col-sm-2 col-xs-12">{item.full_score}</div>
                          <div class="col-content col-body col-md-2 col-sm-2 col-xs-12">{item.piano_score}</div>
                          <div class="col-content col-body col-md-2 col-sm-2 col-xs-12">{item.voice_score}</div>
                          <div class="col-content col-body col-md-2 col-sm-2 col-xs-12 orchestration-column">{item.orchestration}</div>
                      </div>
                    </li>
                  )
                })}
              </Table>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Catalog;

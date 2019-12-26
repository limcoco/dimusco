import React, { Component } from 'react'
import PropTypes from 'prop-types'
import checkSession from '../../../utils/check_session.js'
import BookList from './BookList'
import SearchInput from '../../component/SearchInput'
import PaginationHeader from '../../pages/SetPrice/components/PaginationHeader'

class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTabIndex: 0,
      searchQuery: '',
      showModal: false,
      rpp: 25,
      page: 1,
      order: ''
    }
    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal })

  onReadScore = (data = {}) => {
    const payloads = {
      ordering: data.order || this.state.order,
      search: data.search || this.state.searchQuery,
      rpp: data.rpp || this.state.rpp,
      page: data.page || this.state.page
    }
    this.props.getLibraryScores(payloads, this.onLoadSuccess, this.onLoadFailed)
    this.toggleModal()
  }

  onLoadSuccess = () => {
    this.setState({
      showModal: false,
    })
  }

  onLoadFailed = error => {
    this.toggleModal(error.response.data.detail)
  }

  onDeleteScore = (data, text) => {
    this.props.deleteLibraryScore(data, this.onDeleteSuccess, this.onDeleteFailed)
    this.toggleModal('Deleting score')
  }

  onDeleteSuccess = () => {
    this.onReadScore()
    this.toggleModal()
  }

  onDeleteFailed = error => {
    console.log({ error }, 'delete score')
  }

  componentDidMount() {
    this.onReadScore()
  }

  gotoUpload = () => {
    this.props.history.push('/upload')
  }

  handleSearchQueryChange = searchQuery => {
    this.setState({ searchQuery })
  }

  handleSearchQueryClear = () => {
    this.setState({ searchQuery: '' })
  }

  handleSearchSubmit = () => {
    this.onReadScore()
  }

  pagination = page => {
    this.setState({
      rpp: this.state.rpp,
    })
    let resData = {
      page: page,
      rpp: this.state.rpp,
    }
    this.onReadScore(resData)
  }

  handlePageClick = data => {
    console.log(data);
    let selected = data.selected +1
    this.pagination(selected)
  }

  changeRPP = event => {
    this.setState({ rpp: event.target.value })
    let resData = {
      page: 1,
      rpp: event.target.value,
    }

    this.onReadScore(resData)
  }

  callScoresWithRPP = () => {
    let resData = {
      page: 1,
      rpp: this.state.rpp,
    }

    this.onReadScore(resData)
  }

  render() {
    const {
      ActiveLanguageReducer: { words, lang },
      changeLibraryScope,
      changeLibraryScoreStatus,
      history,
      libraryScores: {results, current_page, number_page, number_result},
    } = this.props

    const {rpp} = this.state;
    if (!this.loggedIn) return null
    return (
      <React.Fragment>
        {/* <InfoModal
          small
          isActive={this.state.showModal}
          toggleModal={this.toggleModal}
        >
          <img
            src="media/images/icon/loading.gif"
            width="80"
            height="80"
            style={{ marginBottom: '30px' }}
          />
        </InfoModal> */}
        <div className={`library-page set-price ${this.state.showModal && 'progress'}`}>
          <h2>{words.gen_library}</h2>
          <section className="search-area container" style={{ maxWidth: '1180px', paddingBottom: '25px' }}>
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
          </section>
          <section className="user-content institution-content">
            <div className="container">
              <PaginationHeader
                currentPage={current_page}
                number_page={number_page}
                handlePageClick={this.handlePageClick}
                words={words}
                number_result={number_result}
                rpp={rpp}
                changeRPP={this.changeRPP}
                callScoresWithRPP={this.callScoresWithRPP}
                marginDisplay={1}
                page_range={2}
                navNull={true}
              />
              <BookList
                words={words}
                items={results}
                makeSortRequest={this.onReadScore}
                onDeleteScore={this.onDeleteScore}
                changeLibraryScope={changeLibraryScope}
                changeLibraryScoreStatus={changeLibraryScoreStatus}
                history={history}
              />
            </div>
          </section>
        </div>
      </React.Fragment>
    )
  }
}
Book.propTypes = {
  SearchReducer: PropTypes.shape({
    query: PropTypes.string.isRequired,
  }),
  SessionReducer: PropTypes.shape({
    is_auth: PropTypes.string.isRequired,
  }),
  ActiveLanguageReducer: PropTypes.shape({
    words: PropTypes.object.isRequired,
    lang: PropTypes.string,
  }),
  libraryScores: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  deleteLibraryScore: PropTypes.func.isRequired,
  getLibraryScores: PropTypes.func.isRequired,
}

export default Book

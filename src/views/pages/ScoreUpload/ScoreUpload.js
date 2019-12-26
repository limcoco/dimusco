import React from "react"
import _ from "lodash/core"
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import checkSession from "../../../utils/check_session.js"


import Request from "../../../utils/Request.js"

import axios from "axios"
import server from "../../../config/server.js"
import urls from "../../../config/urls.js"
import  ScoreTable from "./ScoreTable";

import { Link } from 'react-router-dom';
import UpdateUpload from './UpdateUpload';
import Modal from '../../component/Modal/Info';

class ScoreUploadScreen extends React.Component {
  constructor(props) {
    super(props)

    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)
    // this.loggedInPublisher = checkSession.isLoggedIn(props.history, props.PublisherReducer.is_auth)

    this.state = {
      activeTabIndex: 0,
      searchQuery: '',
      from: moment(),
      to: moment("12/31/2099"),
      min_date: moment(),
      action: "add",
      raw_data: "",
      active_sub_index: null,
      loading: false,

      // Register
      price: 0,
      currency: "EUR",
      score: "",
      pid: "",
      spid: "",
      bulk_mode: false,

      //pagination
      count: null,
      currentPage: 0,
      number_page: 0,
      nextLink: null,
      prevLink: null,
      selected_items: {},
      rpp: 999,

      sort: null,

      mode: "pdf",
      progress: 0,
      disabled: true,
      token: null,
      filename: [],
      check_all: false,
      nameSortType: 'asc',
      dateSortType: 'asc',
      userSortType: 'asc',
      isActive: false,
      msg: '',
      type: []
    }
    this.payload = []
    this.data = new FormData()

    this._mounted = false
    this.searchInput = null
  }

  multipleSelected = (checked, selected, data) => {
    const { selected_items } = this.state

    if (checked) {
      selected_items[selected] = data

    } else {
      delete selected_items[selected]
    }
    this.setState({
      selected_items: selected_items,
    })
  }

  onReadScore = (data) => {
    let payload = {
      // pid : this.props.PublisherReducer.publisher.pid,
      rpp: data && data.rpp ? data.rpp : this.state.rpp,
      q: this.state.searchQuery,
      sort: data && data.order ? data.order : "",
      // page: data && data.page ? data.page : 1
    }
    this.props.getUploadScores(payload, this.onReadScoreSuccess, this.onReadScoreFailed)
    this.setState({
      loading: true
    })
  }

  onReadScoreSuccess = () => {
    const {uploadScores} = this.props;
    this.setState({
      raw_data: uploadScores.scores,
      count: uploadScores.number_result,
      nextLink: uploadScores.next_url,
      prevLink: uploadScores.before_url,
      currentPage: uploadScores.current_page,
      number_page: uploadScores.number_page,
      rpp: uploadScores.rpp,
      loading: false
    })
  }

  onReadScoreFailed = (err) => {
    // this.setState({
    //   source  : "search",
    // })
    this.setState({
      loading: false
    })
  }

  onDelete = () => {
    const { selected_items } = this.state

    let method, payload, url, sid;

    this.setState({ loading: true })

    if (_.isEmpty(selected_items)) {
      if (this.state.score === "") {
        return
      }
    } else {
      let data = this.getPayloadBulk();

      for (var i = 0; i < data.length; i++) {
        Request(
          "delete",
          "delete-score-upload",
          { Authorization: "Token " + this.state.token },
          payload,
          [data[i].sid],
          this.onDeleteSuccess,
          this.onDeleteFailed
        )
      }
    }

  }

  onDeleteSuccess = () => {
    this.setState({
      loading: false,
      active_id: null,
      score: "",
      selected_items: {},
      check_all: false,
    })

    let data = {
      page: this.state.currentPage
    }

    this.onReadScore(data)
  }

  onDeleteFailed = () => {
    this.setState({ loading: false })
  }

  getPayloadBulk = () => {
    const { selected_items } = this.state
    let tmp = []

    for (let i in selected_items) {

      if (this.state.check_all) {
        // If have PID

        tmp.push({
          sid: selected_items[i].sid,
          original_file_name: selected_items[i].original_file_name,
          created: moment(selected_items[i].created).format("YYYY-MM-DD"),
          user: selected_items[i].user,
        })

      } else {
        // If have PID

        tmp.push({
          sid: selected_items[i].sid,
          original_file_name: selected_items[i].original_file_name,
          created: moment(selected_items[i].created).format("YYYY-MM-DD"),
          user: selected_items[i].user,
        })
      }

    }
    return tmp
  }

  hasMount = () => {
    if (this._mounted) {
      this.onReadScore();
      this.props.getUserDetails(this.getUserDetailsSuccess);
    }
  }

  componentWillMount() {
    const { SessionReducer, InstitutionReducer, EnsembleReducer, PublisherReducer } = this.props
    if (SessionReducer.is_auth) {
      this.setState({ token: this.props.Token.token })
    }

    if (InstitutionReducer && InstitutionReducer.is_auth) {
      this.setState({ token: this.props.Token.tokenInstitution })
    }

    if (EnsembleReducer && EnsembleReducer.is_auth) {
      this.setState({ token: this.props.Token.tokenEnsemble })
    }

    if (PublisherReducer && PublisherReducer.is_auth) {
      this.setState({ token: this.props.Token.tokenPublisher })
    }
  }

  componentDidMount() {
    this._mounted = true
    this.hasMount()

    const { SessionReducer, InstitutionReducer, EnsembleReducer, PublisherReducer } = this.props
    if (SessionReducer.is_auth) {
      this.data.append("uid", SessionReducer.user.uid)
      this.setState({ name_of: SessionReducer.user.name, token: this.props.Token.token })
    }

    if (InstitutionReducer && InstitutionReducer.is_auth) {
      this.data.append("iid", InstitutionReducer.institution.iid)
      this.setState({ name_of: InstitutionReducer.institution.name, token: this.props.Token.tokenInstitution })
    }

    if (EnsembleReducer && EnsembleReducer.is_auth) {
      this.data.append("eid", EnsembleReducer.ensemble.eid)
      this.setState({ name_of: EnsembleReducer.ensemble.name, token: this.props.Token.tokenEnsemble })
    }

    if (PublisherReducer && PublisherReducer.is_auth) {
      this.data.append("pid", PublisherReducer.publisher.pid)
      this.setState({ name_of: PublisherReducer.publisher.name, token: this.props.Token.tokenPublisher })
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      searchQuery: nextProps.SearchReducer.query,
    })
  }

  pagination = (page) => {
    this.setState({
      rpp: this.state.rpp,
    });
    let resData = {
      order: this.state.sort,
      page: page,
      rpp: this.state.rpp

    }
    this.onReadScore(resData)
  }

  handlePageClick = (data) => {
    let selected = data.selected + 1
    this.pagination(selected)
  };

  onUpload = () => {
    this.setState({
      loading: true
    })
    let config = {
      onUploadProgress: function (progressEvent) {
        let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.setState({
          progress: percent,
          disabled: true,
        })
      }.bind(this)
    }
    const { words } = this.props.ActiveLanguageReducer
    axios.defaults.headers.common = {}
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data"
    axios.post(server.API_WUL + urls.upload, this.payload, config)
      .then(function (res) {
        this.reset()
        this.setState({
          progress: 0,
          disabled: true,
          loading: false
        })
        this.onReadScore();
        if (this.state.type.includes("text/csv")) {
          this.toggleModal(words.popup_return_csv_good)
        } else {
          this.toggleModal(words.popup_return_good)
        }
      }.bind(this))

      .catch(function (err) {
        this.setState({
          progress: 0,
          disabled: true,
          loading: false
      })
      if (this.state.type.includes("text/csv")) {
        this.toggleModal(words.popup_return_csv_bad)
      } else {
        this.toggleModal(words.popup_return_bad)
      }

      }.bind(this))
  }

  handleFileUpload = (e) => {
    let file = e.target.files
    let filename = this.state.filename;
    const files = e.target.files;
    this.setState({
      type: Object.keys(files).map((key) => files[key].type)
    })
    if (this.state.mode === "pdf") {
      for (let i = 0; i < e.target.files.length; i++) {
        this.data.append("files", file[i])
        filename.push(file[i].name)
      }

    } else {
      this.data.append("csv", file[0])
    }

    this.payload = this.data

    this.setState({ filename })

    this.setState({
      disabled: false
    }, () => {
      this.onUpload()
    })

  }

  reset = () => {
    this.data.delete("files")
    this.data.delete("csv")
    this.setState({
      filename: []
    });
  }

  onTableHeaderItemClick = (e, data) => {
    if (data.data === null) return
    if (data.data.sort === 'original_file_name') {
      if (this.state.nameSortType === 'asc') {
          this.setState({
              items: this.state.raw_data.sort((a ,b) => {
                  if(a.original_file_name < b.original_file_name) { return -1; }
                  if(a.original_file_name > b.original_file_name) { return 1; }
              })
          }, () => {
            this.setState({
              nameSortType: 'des'
            })
          })
      } else if (this.state.nameSortType === 'des') {
          this.setState({
              raw_data: this.state.raw_data.sort((a ,b) => {
                  if(a.original_file_name < b.original_file_name) { return 1; }
                  if(a.original_file_name > b.original_file_name) { return -1; }
              })
          }, () => {
            this.setState({
              nameSortType: 'asc'
            })
          })
      }
    } else if (data.data.sort === 'created') {
        if (this.state.dateSortType === 'asc') {
            this.setState({
                raw_data: this.state.raw_data.sort(function(a,b){
                    return new Date(b.created) - new Date(a.created);
                })
            }, () => {
              this.setState({
                dateSortType: 'des'
              })
            })
        } else if (this.state.dateSortType === 'des') {
            this.setState({
                raw_data: this.state.raw_data.sort(function(a,b){
                    return new Date(a.created) - new Date(b.created);
                })
            }, () => {
              this.setState({
                dateSortType: 'asc'
              })
            })
        }
    } else if (data.data.sort === 'user') {
      if (this.state.userSortType === 'asc') {
          this.setState({
              items: this.state.raw_data.sort((a ,b) => {
                  if(a.user < b.user) { return -1; }
                  if(a.user > b.user) { return 1; }
              })
          }, () => {
            this.setState({
              userSortType: 'des'
            })
          })
      } else if (this.state.userSortType === 'des') {
          
          this.setState({
              raw_data: this.state.raw_data.sort((a ,b) => {
                  if(a.user < b.user) { return 1; }
                  if(a.user > b.user) { return -1; }
              })
          }, () => {
            this.setState({
              userSortType: 'asc'
            })
          })
      }
    }
  }

  checkAll = (e) => {
    const { raw_data } = this.state
    let check_all, selected

    if (e.target.checked) {
      check_all = true
      selected = {}
      if (!_.isEmpty(raw_data)) {
        for (let i = 0; i < raw_data.length; i++) {
          selected[raw_data[i].sid] = { ...raw_data[i] }

        }
      }

    } else {
      check_all = false
      selected = {}
    }

    this.setState({
      check_all: check_all,
      selected_items: selected
    })
  }

  toggleModal = (msg) => {
    this.setState((state) => ({
      ...state,
      isActive: !state.isActive,
      msg
    }))
  }

  getUserDetailsSuccess = ({uid, pid, eid, iid}) => {
    this.setState({
      actor_id: uid || pid || eid || iid
    })
  }

  toggleLoading = () => {
    this.setState((state) => ({...state, loading: !state.loading}))
  }

  render() {
    if (!this.loggedIn) return (null)

    const { words, lang } = this.props.ActiveLanguageReducer;
    const {actor_id} = this.state;

    return (
      <div className={`upload-score ${this.state.loading && 'progress'}`}>
         <Modal
            info={this.state.msg}
            small
            toggleModal={this.toggleModal}
            isActive={this.state.isActive}
          />
        <section className="search-area">
          <h2 className="row title">{words.gen_upload}</h2>
        </section>

        <section className="container">
          <div className="row page-numeration-box">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <button className="btn black" onClick={this.onDelete} disabled={!Object.keys(this.state.selected_items).length}>{words.gen_remove}</button>
            </div>
            <div className='col-md-4 col-sm-4 col-xs-12 d-flex' style={{justifyContent: 'center'}}>
              <label className="btn black">
                {words.gen_upload}
                <input
                  type="file"
                  onChange={this.handleFileUpload}
                  multiple accept="application/pdf, .csv"
                  style={{display: 'none'}}
                />
              </label>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12 d-flex" style={{justifyContent: 'flex-end'}}>
              <Link className="btn black" to="/import-upload-log">{words.gen_protocol || 'gen_protocol'}</Link>
            </div>
          </div>
          
          <div className="scoreUpload">
            <ScoreTable
              words={words}
              raw_data={this.state.raw_data}
              multipleSelected={this.multipleSelected}
              selected_items={this.state.selected_items}
              onTableHeaderItemClick={this.onTableHeaderItemClick}
              checkAll={this.checkAll}
              check_all={this.state.check_all}
            />
          </div>
          <UpdateUpload
              user_id={this.props.SessionReducer.user.uid}
              actor_id={actor_id}
              words={words}
              lang={lang}
              onReadScore={this.onReadScore}
              toggleLoading={this.toggleLoading}
              toggleModal={this.toggleModal}
          />
        </section>
      </div>
    )
  }
}

export default ScoreUploadScreen;
import React, { Component } from 'react';
import Modal from '../../component/Modal/Skeleton';
import Table from '../../component/Table/Table.js';
import moment from 'moment';
import Request from "../../../utils/Request";
import auth from '../../../redux/account/authToken';
import PaginationNumber from '../../component/PaginationNumber';

class AddScore extends Component {
    state = {
        search: '',
        ordering: '',
        invitations: [],
        page: 1
    }

    componentDidMount () {
        this.getInviation();
    }

    getInviation = () => {
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }

        const {search, ordering, page} = this.state;

        const payload = {
            search,
            ordering,
            page
        }
        
        Request(
            'get',
            'invitation',
            headers,
            payload,
            [],
            this.getInviationSuccess,
            this.getInviationFailure
        );
    }

    getInviationSuccess = (response) => {
        this.setState((state) => { return {
          ...state,
          invitations: response.data.results || [],
          count: response.data.count,
          current: response.data.current
        }})
    }

    getInviationFailure = (error) => {
        console.log('error', error)
    }

    toggleModal = () => {
        const {isActive} = this.state;
        this.setState({
            isActive: !isActive
        })
    }

    handleSearch = (ev) => {
      this.setState({
          search: ev.target.value
      })
    }

    handleSubmitSearch = (ev) => {
      ev.preventDefault();
      this.getInviation();
    }

    handlePageClick = ({selected}) => {
        this.setState((state) => ({
            ...state,
            page: selected + 1
        }), () => {
            this.getInviation();
        })
    }

    onTableHeaderItemClick = (_, data) => {
      let fields = data.data.sort.split(',')
      for (let i = 0; i < fields.length; i++) {
        if (!data.ascending) {
          fields[i] = '-' + fields[i]
        }
      }
      this.setState({
        ordering: fields.join(',')
      }, () => {
        this.getInviation();
      })
    }

    render () {
        const {words} = this.props;
        const {isActive} = this.state;

        let tableColumns = [
            words.gen_name,
            words.gen_email,
            words.gen_title,
            words.gen_composer,
            words.gen_instrument,
            words.gen_scope || 'gen_scope',
            words.gen_sent || 'gen_sent',
            words.gen_valid || 'gen_valid',
            words.gen_action
          ];
          let tableColumnExtras = {};
          tableColumnExtras[words.gen_name] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'contact__first_name'
            }
          };
          tableColumnExtras[words.gen_email] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header double-width',
            canSort: true,
            data: {
              sort: 'contact__email'
            }
          };
          tableColumnExtras[words.gen_title] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'score'
            }
          };
          tableColumnExtras[words.gen_composer] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'composer'
            }
          };
          tableColumnExtras[words.gen_instrument] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'instrument'
            }
          };

          tableColumnExtras[words.gen_scope || 'gen_scope'] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'access_right'
            }
          };

          tableColumnExtras[words.gen_sent || 'gen_sent'] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'created_at'
            }
          };

          tableColumnExtras[words.gen_valid || 'gen_valid'] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'expire_at'
            }
          };

          tableColumnExtras[words.gen_action] = {
            disabled: false,
            visible: true,
            clickable: true,
            className:
              'col-content col-header col-auto',
            canSort: true,
            data: {
              sort: 'to'
            }
          };
          const { invitations, count, current } = this.state;
        return (
            <div className='invitations-list-modal'>
                <button className='btn black small' onClick={this.toggleModal}>
                    {words.gen_history || 'gen_history'}
                </button>
                <Modal
                    toggleModal={this.toggleModal}
                    isActive={isActive}
                >
                    <a onClick={this.toggleModal} className='close'>X</a>
                    <div className='book-list'>
                      <div className='row'>
                        <div className='col-md-6'>
                          <form className='search-from' onSubmit={this.handleSubmitSearch}>
                              <div className='search-input'>
                                  <div className='search-box'>
                                      <input className='search-text' type='text' onChange={this.handleSearch} value={this.state.search} />
                                      {this.state.search &&
                                          <div className="delete-btn" onClick={() => this.setState({search: ''})}>
                                              <span className="delete-icon" style={{backgroundImage: 'url(media/images/icon/delete.svg)'}}></span>
                                          </div>
                                      }
                                  </div>
                                  <button className='btn small black'>{words.gen_find}</button>
                              </div>
                          </form>
                        </div>
                        <div className='col-md-6'>
                          <PaginationNumber
                              current={current}
                              count={count}
                              number_page={count/20}
                              handle={this.handlePageClick}
                              marginDisplay={1}
                              page_range={2}
                              navNull={true}
                          />
                        </div>
                      </div>
                    </div>
                      <Table
                            columns={tableColumns}
                            columnsExtras={tableColumnExtras}
                            onHeaderItemClick={this.onTableHeaderItemClick}
                            noDataDesc={words.library_empty}
                        >
                            {invitations.map((item) => {
                              if (!item.contact_details) {
                                item.contact_details = {}
                              }
                                return  (
                                    <li className="standart-container transition-all" key={item.aid}>
                                        <div className='no-margin row full-width'>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                {item.contact_details.first_name} {item.contact_details.last_name}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto double-width"}>
                                                <div className="book-title">
                                                  {item.contact_details.email ? item.contact_details.email : item.email}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                    {item.scores_title}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                    {item.scores_composer}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                    {item.scores_instrument}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                    {words[item.access_right] || item.access_right}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                    {moment(item.created_at).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                    {moment(item.expire_at).format('YYYY-MM-DD')}
                                                </div>
                                            </div>
                                            <div className={"col-content col-auto"}>
                                                <div className="book-title">
                                                  ...
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </Table>
                </Modal>
            </div>
        )
    }
}

export default AddScore;
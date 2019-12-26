import React, { Component, Fragment } from 'react'
import Table from '../../component/Table/Table.js'
import PaginationHeader from '../../pages/SetPrice/components/PaginationHeader'

class BigTable extends Component {
    constructor(props) {
      super(props);
    };
    
    handlePageClick = data =>{
      console.log(data);
      this.props.clickpagination(data);
    }

    changeRPP= () =>{
      this.props.clickchangeRPP()
    }

    callScoresWithRPP = ()=>{
      this.props.clickcallScoresWithRPP()
    }

    render() {
        const {
            toggleAuthorityForm,
            deleteAuthority,
            onTableHeaderItemClick,
            words,
            goToUrl,
            setActiveFrom,
            getState,
            data,
            authority_to_replace,
            current_page,
            number_page,
            number_result,
            rpp
          } = this.props;

        let tableColumns = [
            words.gen_name,
            words.gen_variants || 'gen_variants',
            words.gen_link || 'gen_link',
            words.gen_links || 'gen_links',
            words.gen_state,
          ]
          const tableColumnExtras = {}
          tableColumnExtras[words.gen_name] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
            canSort: true,
            data: {
              sort: 'value',
            },
          }
          tableColumnExtras[words.gen_variants || 'gen_variants'] = {
            disabled: false,
            visible: true,
            clickable: false,
            className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
            canSort: false,
            data: {
              sort: 'score__ssid__original_composer',
            },
          }
          tableColumnExtras[words.gen_link || 'gen_link'] = {
            disabled: false,
            visible: true,
            clickable: false,
            className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
            canSort: false,
            data: {
              sort: 'score__original_edition',
            },
          }
          tableColumnExtras[words.gen_links || 'gen_links'] = {
            disabled: false,
            visible: true,
            clickable: false,
            className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
            canSort: false,
            data: {
              sort: 'score__original_edition',
            },
          }
          tableColumnExtras[words.gen_state] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
            canSort: true,
            data: {
              sort: 'state',
            },
          }

          
        return (
            <div className="col-md-8">
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
                    rppStuck
                />
                <div>
                    <div className="gi-header">
                        <div className="gi-title cursor">{words.AU_keep_this || 'AU_keep_this'}</div>
                        <div className="action-buttons">
                            <a id="add_group" role="button" onClick={toggleAuthorityForm}><img src="/media/images/add.png" width="15" height="15" /></a>
                            <a role="button" className="red-i" onClick={deleteAuthority}><img src="/media/images/remove.png" width="15" height="15" /></a>
                        </div>
                    </div>
                    <div>
                        <Table
                            columns={tableColumns}
                            columnsExtras={tableColumnExtras}
                            onHeaderItemClick={onTableHeaderItemClick}
                            noDataDesc={words.library_empty}
                        >
                            {data.map((item) => {
                                return (
                                    <li
                                        className={`standard-container transition-all ${authority_to_replace ===  item.id ? 'is_active' : ''}`}
                                        key={item.id}
                                        onClick={() => setActiveFrom(item.id)}
                                    >
                                        <div className="pointer no-margin row full-width">
                                            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12" onDoubleClick={() => toggleAuthorityForm(item)}>
                                                <div>
                                                    {item.value} <br />
                                                    {item.value && <Fragment>----------- <br /></Fragment> }
                                                    {item.auid}
                                                </div>
                                            </div>
                                            <div className="col-content col-body col-md-3 col-sm-3 col-xs-12" onDoubleClick={() => toggleAuthorityForm(item)}>{item.variants}</div>
                                            <div className="col-content col-body col-md-3 col-sm-3 col-xs-12" onDoubleClick={() => goToUrl(item.wikilink)}>{item.wikilink}</div>
                                            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">
                                                <div style={{width: '100%', padding: '0 20px'}}>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                                        <strong>{words.gen_plays}:</strong> {item.details.used_by_plays}
                                                    </div>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                                        <strong>{words.gen_scores}:</strong> {item.details.used_by_scores}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-content col-body col-md-2 col-sm-2 col-xs-12">{getState(item.state)}</div>
                                        </div>
                                    </li>
                                )
                            })}
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

export default BigTable

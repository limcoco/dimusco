import React, { Component, Fragment } from 'react'
import Table from '../../component/Table/Table.js'
import PaginationHeader from '../../pages/SetPrice/components/PaginationHeader'

class SmallTable extends Component {

    handlePageClick = ()=>{
        const data = this.props;
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
            onSmallTableHeaderItemClick,
            setActiveTo,
            getState,
            words,
            smallTableData,
            replace_with_authority,
            current_page,
            number_page,
            number_result,
            rpp
          } = this.props;
          
        let smallTableColumns = [
            words.gen_name,
            words.gen_state,
          ]
          
          const smallTableColumnExtras = {}

          smallTableColumnExtras[words.gen_name] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-6 col-sm-6 col-xs-12 ',
            canSort: true,
            data: {
              sort: 'value',
            },
          }

          smallTableColumnExtras[words.gen_state] = {
            disabled: false,
            visible: true,
            clickable: true,
            className: 'col-content col-header col-md-6 col-sm-6 col-xs-12 ',
            canSort: true,
            data: {
              sort: 'state',
            },
          }

        return (
            <div className="col-md-4">
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
                    removeScoresFound
                    rppStuck
                />
                <div>
                    <div className="gi-header">
                        <div className="gi-title cursor">{words.AU_replace_this || 'AU_replace_this'}</div>
                    </div>
                    <div>
                    <Table
                        columns={smallTableColumns}
                        columnsExtras={smallTableColumnExtras}
                        onHeaderItemClick={onSmallTableHeaderItemClick}
                        noDataDesc={words.library_empty}
                    >
                        {smallTableData.map((item) => {
                            return (
                                <li
                                    className={`standard-container transition-all ${replace_with_authority === item.id ? 'is_active' : ''}`}
                                    key={item.id}
                                    onClick={() => setActiveTo(item.id)}
                                >
                                    <div className="pointer no-margin row full-width">
                                        <div className="col-content col-body col-md-6 col-sm-6 col-xs-12">
                                            <div>
                                                {item.value} <br />
                                                {item.value && <Fragment>----------- <br /></Fragment> }
                                                {item.auid}
                                            </div>
                                        </div>
                                        <div className="col-content col-body col-md-6 col-sm-6 col-xs-12">{getState(item.state)}</div>
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

export default SmallTable

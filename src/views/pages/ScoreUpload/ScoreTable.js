import React, { Component } from 'react';
import Table from "../../component/Table/Table.js"
import _ from "lodash/core"
import ScoreUploadRow from "./components/ScoreUploadRow"
import moment from 'moment'

class ScoreTable extends Component {
    state = {
        active_id: null,
        type_price: "otp",
    }

    validateDate = (date, param = null) => {
        if (date === "") {
          if (param === "to") {
            return moment("12/31/2099")
          } else if (param === "from") {
            return moment()
          }
        } else {
          return moment(date)
        }
      }
    

  singleSelected = (have_price, active_id, data) => {
    if (active_id !== this.state.active_id) {
      this.setState({
        active_id: active_id,
        original_file_name: data.original_file_name,
        created: this.validateDate(data.created, "from"),
        user: data.user,
        sid: data.sid,
        pid: data.pid,
      })
    } else {
      this.setState({
        active_id: null,
        original_file_name: "",
        sid: "",
        user: "",
        created: ""
      })
    }
  }

    generateRow = (row) => {
        var element = row.map((val, index) => {
          return (
            <ScoreUploadRow
              index={index}
              key={index}
              activeId={this.state.active_id}
              selectedItems={this.props.selected_items}
              multipleSelected={this.props.multipleSelected}
              rowData={val}
              singleSelected={this.singleSelected}
              typePrice={this.state.type_price}
            />
          )
        })
        return element
      }

    renderRow = () => {
        const { raw_data } = this.props;
    
        if (typeof raw_data === "undefined") {
          return (<tr><td colSpan={100}><p className="grey text-center">Data Empty</p></td></tr>)
        } else {
          if (raw_data.length === 0) {
            return (<tr><td colSpan={100}><p className="grey text-center">Data Empty</p></td></tr>)
          } else {
            return (this.generateRow(raw_data))
          }
        }
      }

      renderCheckBoxAll = () => {
        const { check_all, checkAll } = this.props
        return (
          <label className="control control--checkbox ">
            <input type="checkbox" checked={check_all} onChange={checkAll} />
            <div className="control__indicator"></div>
          </label>
        )
      }
      
    render () {
        const {words} = this.props;
        
    let tableColumns = [
        this.renderCheckBoxAll(),
        words.gen_filename,
        words['upload_uploaded-at'] || 'upload_uploaded-at',
        words['upload_uploaded-by'] || 'upload_uploaded-by'
      ]
  
      let tableColumnExtras = {}
      tableColumnExtras[this.renderCheckBoxAll()] = {
        disabled: false,
        visible: true,
        clickable: true,
        className: "col-content col-header col-md-1 col-sm-1 col-xs-12 ",
        canSort: false,
      }
      tableColumnExtras[words.gen_filename] = {
        disabled: false,
        visible: true,
        clickable: true,
        className: "col-content col-header col-md-4 col-sm-4 col-xs-12 ",
        canSort: true,
        data: {
          'sort': 'original_file_name'
        },
      }
      tableColumnExtras[words['upload_uploaded-at'] || 'upload_uploaded-at'] = {
        disabled: false,
        visible: true,
        clickable: true,
        className: "col-content col-header col-md-offset-1 col-sm-offset-1 col-md-3 col-sm-3 col-xs-12 ",
        canSort: true,
        data: {
          'sort': 'created'
        },
      }
      tableColumnExtras[words['upload_uploaded-by'] || 'upload_uploaded-by'] = {
        disabled: false,
        visible: true,
        clickable: true,
        className: "col-content col-header col-md-3 col-sm-3 col-xs-12 ",
        canSort: true,
        data: {
          'sort': 'user'
        },
      }
        return (
            <Table
              columns={tableColumns}
              columnsExtras={tableColumnExtras}
              onHeaderItemClick={this.props.onTableHeaderItemClick}
            >
              {this.renderRow()}
            </Table>
        );
    }
}

export default ScoreTable;
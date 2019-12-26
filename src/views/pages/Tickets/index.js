import React, { Component } from 'react';
import { connect } from 'react-redux';

import Table from '../../component/Table/Table';
import RelationsRow from './components/TableRow';

import Request from '../../../utils/Request';
import Auth from '../../../redux/account/authToken';

import './styles.css';

class Relations extends Component {
  state = {
    rowData: [],
    ordering: ''
  };

  componentDidMount() {
    this.getTickets();
  }

  getTickets = () => {
    let headers = {
      Authorization: 'Token ' + Auth.getActiveToken()
    }
    Request(
      'get',
      'ticket',
      headers,
      {ordering: this.state.ordering},
      [],
      this.onSuccess,
      undefined
    );
  }

  onSuccess = response => {
    this.setState({
      rowData: response.data || []
    });
  };

  onFailed = () => {
    console.log('failed');
  };

  handleCreateContract = () => {
    this.props.history.push('/create-contract');
  };

  renderRow() {
    const { rowData } = this.state;

    if (typeof rowData === 'undefined') {
      return (
        <tr>
          <td colSpan={100}>
            <p className="grey text-center">Data Empty</p>
          </td>
        </tr>
      );
    } else {
      if (rowData.length === 0) {
        return (
          <tr>
            <td colSpan={100}>
              <p className="grey text-center">Data Empty</p>
            </td>
          </tr>
        );
      } else {
        return this.generateRow(rowData);
      }
    }
  }

  generateRow(row) {
    const {
      ActiveLanguageReducer,
      Token
    } = this.props;
    const { words } = ActiveLanguageReducer;

    var element = row.map((val, index) => {
      return (
        <RelationsRow
          index={index}
          words={words}
          key={index}
          rowData={val}
          TokenReducer={Token}
          getRelations={this.getRelations}
        />
      );
    });
    return element;
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
      this.getTickets()
    })
  }

  render() {
    const {
      ActiveLanguageReducer,
      InstitutionReducer
    } = this.props;
    const { words } = ActiveLanguageReducer;

    let tableColumns = [
      words[`gen_email`],
      words['gen_first-name'],
      words['gen_last-name'],
      words['gen_created'],
      words['gen_changed'],
      words['gen_action']
    ];

    let tableColumnExtras = {};
    tableColumnExtras[words['gen_email'] || 'gen_email'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'email'
      }
    };
    tableColumnExtras[words['gen_first-name'] || 'gen_first-name'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'first_name'
      }
    };
    tableColumnExtras[words['gen_last-name'] || 'gen_last-name'] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'last_name'
      }
    };
    tableColumnExtras[words['gen_created']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'created_at'
      }
    };
    tableColumnExtras[words['gen_changed']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'created_at'
      }
    };

    tableColumnExtras[words['gen_action']] = {
      disabled: false,
      visible: true,
      clickable: false,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: false,
      data: {
        sort: 'user'
      }
    };

    return (
      <div className="relations tickets">
        <section className="search-area">
          <div className="row title">{words.gen_tickets}</div>
        </section>

        <section className="container">
          <Table
            columns={tableColumns}
            columnsExtras={tableColumnExtras}
            onHeaderItemClick={this.onTableHeaderItemClick}
          >
            {this.renderRow()}
          </Table>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    Token: state.TokenReducer,
    SearchReducer: state.SearchReducer,
    PublisherReducer: state.PublisherReducer,
    InstitutionReducer: state.InstitutionReducer,
    EnsembleReducer: state.EnsembleReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer
  };
};
const mapDispatchToProps = dispatch => {
  return {
    RunRedux: data => {
      dispatch(data);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Relations);

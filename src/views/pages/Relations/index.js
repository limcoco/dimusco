import React, { Component } from 'react';
import { connect } from 'react-redux';

import Table from '../../component/Table/Table';
import RelationsRow from './components/TableRow';

import Request from '../../../utils/Request';

import './styles.css';

class Relations extends Component {
  state = {
    rowData: [],
    ordering: ''
  };

  componentDidMount() {
    this.getRelations();
  }

  getRelations = () => {
    const { PublisherReducer, InstitutionReducer, Token } = this.props;
    let activeToken;
    if (PublisherReducer.is_auth) {
      activeToken = Token.tokenPublisher;
    } else if (InstitutionReducer.is_auth) {
      activeToken = Token.tokenInstitution;
    }
    const payload = {
      ordering: this.state.ordering
    }
    Request(
      'get',
      'get-inst-pub-contract-list',
      { Authorization: `Token ${activeToken}` },
      payload,
      [],
      this.onSuccess,
      this.onFailed
    );
  }

  onSuccess = response => {
    this.setState({
      rowData: response.data.contracts
    });
  };

  onFailed = (params, response) => {
    console.log({ params, response }, 'failed');
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
      InstitutionReducer,
      PublisherReducer,
      Token
    } = this.props;
    const { words } = ActiveLanguageReducer;
    let type = '';

    if (InstitutionReducer.is_auth) type = 'institution';
    else if (PublisherReducer.is_auth) type = 'publisher';

    var element = row.map((val, index) => {
      return (
        <RelationsRow
          index={index}
          words={words}
          key={index}
          type={type}
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
      this.getRelations()
    })
  }


  render() {
    const {
      ActiveLanguageReducer,
      PublisherReducer,
      InstitutionReducer
    } = this.props;
    const { words } = ActiveLanguageReducer;
    let type = '';

    if (!PublisherReducer.is_auth && !InstitutionReducer.is_auth) return null;

    if (PublisherReducer.is_auth) type = 'institution';
    if (InstitutionReducer.is_auth) type = 'publisher';

    let tableColumns = [
      words[`gen_${type}`],
      words['gen_contract'],
      words['gen_state'],
      words['gen_created'],
      words['gen_changed'],
      words['gen_action']
    ];

    let tableColumnExtras = {};
    tableColumnExtras[words[`gen_${type}`]] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: `${type}__name`
      }
    };
    tableColumnExtras[words['gen_contract']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'contract__name'
      }
    };
    tableColumnExtras[words['gen_state']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'state'
      }
    };
    tableColumnExtras[words['gen_created']] = {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'created'
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
      disabled: true,
      visible: true,
      clickable: false,
      className: 'col-content col-header col-md-2 col-sm-2 col-xs-12 ',
      canSort: false,
      data: {
        sort: ''
      }
    };

    return (
      <div className="relations">
        <section className="search-area">
          <div className="row title">{words.relations_title}</div>
        </section>

        {InstitutionReducer.is_auth && (
          <div className="row container btn-wrapper">
            <button className="btn black" onClick={this.handleCreateContract}>
              {words.gen_create}
            </button>
          </div>
        )}

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

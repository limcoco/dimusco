import React, { Component } from 'react';
import { connect } from 'react-redux';

class Imprint extends Component {
  render() {
    const { ActiveLanguageReducer: {words} } = this.props;

    return (
      <div className="container">
        <div className="imprint-wrap">
          <h3>{words.gen_imprint || 'gen_imprint'}</h3>
          <div className="custom-content">
            <p>IGK Rechnersysteme GmbH</p>
            <p>Deutschtaler Str. 143a</p>
            <p>12355 Berlin, Germany</p>
          </div>
          <div className="custom-content">
            <label>{words.gen_manager || 'gen_manager'}</label>
            <p>Georg Köster</p>
          </div>
          <div className="contact-content">
          <span>
            <label>{words.gen_contact || 'gen_contact'}</label>
          </span>
            <span>
            <label>{words.gen_phone || 'gen_phone'}</label>
            <p>+49 30 666900 – 0</p>
          </span>
            <span>
            <label>{words.gen_fax || 'gen_fax'}</label>
            <p>+49 30 666900 – 99</p>
          </span>
            <span>
            <label>{words.gen_email || 'gen_email'}</label>
            <p>info@igk.de</p>
          </span>
          </div>
          <div className="custom-content">
            <label>{words.gen_trade_register || 'gen_trade_register'}</label>
            <p>Amtsgericht Berlin Charlottenburg</p>
            <p>HRB 50337</p>
          </div>
          <div className="custom-content">
            <label>{words.gen_vat || 'gen_vat'}</label>
            <p>DE 166647374</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ActiveLanguageReducer: state.ActiveLanguageReducer
  };
};

export default connect(
  mapStateToProps,
  {}
)(Imprint);

import React, { Component } from 'react';
import { connect } from 'react-redux';

class Privacy extends Component {
    render() {
        const { ActiveLanguageReducer: {lang} } = this.props;
        return (
            <div>
                <iframe id='my-frame' src={lang === 'en' ? "/media/privacy_en.pdf" : "/media/privacy_de.pdf"} width='100%' height='100%' type='application/pdf' style={{height: 'calc(100vh - 184px)'}} />
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        SessionReducer: state.SessionReducer,
        TokenReducer: state.TokenReducer,
        InstitutionReducer: state.InstitutionReducer,
        ActiveLanguageReducer: state.ActiveLanguageReducer,
        interests: state.InterestsReducer.interests,
        importStatus: state.importStatus,
        exportStatus: state.exportStatus
    };
};
  
  
  export default connect(
    mapStateToProps,
    {}
  )(Privacy);
  

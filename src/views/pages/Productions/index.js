import { connect } from 'react-redux';

import Productions from './Productions';

const mapStateToProps = state => {
    return {
        SessionReducer: state.SessionReducer,
        Token: state.TokenReducer,
        SearchReducer: state.SearchReducer,
        PublisherReducer: state.PublisherReducer,
        ActiveLanguageReducer: state.ActiveLanguageReducer,
        ActiveCurrencyReducer: state.ActiveCurrencyReducer,
        LanguageReducer: state.LanguageReducer
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
)(Productions);
  
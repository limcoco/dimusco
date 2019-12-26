import { connect } from 'react-redux';

import RearrangeScorePages from './RearrangeScorePages';

const mapStateToProps = state => {
    return {
        InstitutionReducer: state.InstitutionReducer,
        EnsembleReducer: state.EnsembleReducer,
        PublisherReducer: state.PublisherReducer,
        SessionReducer: state.SessionReducer,
        ActiveLanguageReducer: state.ActiveLanguageReducer,
        ActiveCurrencyReducer: state.ActiveCurrencyReducer,
        TokenReducer: state.TokenReducer,
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
)(RearrangeScorePages);
  
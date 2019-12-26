import { connect } from 'react-redux';

import ProductSettings from './ProductSettings';

import { bindActionCreators } from 'redux';
import * as scoreSettingsActions from '../../../redux/actions/scoreSettingsActions';

const mapStateToProps = state => {
    return {
        SessionReducer: state.SessionReducer,
        Token: state.TokenReducer,
        SearchReducer: state.SearchReducer,
        PublisherReducer: state.PublisherReducer,
        ActiveLanguageReducer: state.ActiveLanguageReducer,
        ActiveCurrencyReducer: state.ActiveCurrencyReducer,
        LanguageReducer: state.LanguageReducer,
        scorePages: state.scorePages,
        virtualLibraryScores: state.virtualLibraryScores
    };
};
const mapDispatchToProps = dispatch => {
    return {
        RunRedux: data => {
            dispatch(data);
        },
        ...bindActionCreators({
            ...scoreSettingsActions
        }, dispatch),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductSettings);
  
import { connect } from "react-redux";
import RememberScoresModal from './RememberScoresModal';
import './style.css';

const mapStateToProps = (state) => {
    return {
        SessionReducer: state.SessionReducer,
        Token: state.TokenReducer,
        SearchReducer: state.SearchReducer,
        PublisherReducer: state.PublisherReducer,
        InstitutionReducer: state.InstitutionReducer,
        EnsembleReducer: state.EnsembleReducer,
        ActiveLanguageReducer: state.ActiveLanguageReducer,
        ActiveCurrencyReducer: state.ActiveCurrencyReducer,
    }
}

export default connect(mapStateToProps, {})(RememberScoresModal)
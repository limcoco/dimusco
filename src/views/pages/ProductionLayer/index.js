import { connect } from 'react-redux';
import Layer from './layer';

const mapStateToProps = (state) => {
    return {
        EnsembleReducer: state.EnsembleReducer,
        ActiveLanguageReducer: state.ActiveLanguageReducer,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        RunRedux: (data) => {
            dispatch(data);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layer)
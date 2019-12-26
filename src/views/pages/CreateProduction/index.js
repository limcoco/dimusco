
import { connect } from "react-redux";
import CreateProduction from './CreateProduction';

const mapStateToProps = (state) => {
    return {
      SessionReducer: state.SessionReducer,
      TokenReducer: state.TokenReducer,
      InstitutionReducer: state.InstitutionReducer,
      ActiveLanguageReducer: state.ActiveLanguageReducer,
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {
      RunRedux: (data) => {
        dispatch(data)
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(CreateProduction)

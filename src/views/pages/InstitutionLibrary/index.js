import InstitutionLibrary  from "./InstitutionLibrary";
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
      // SessionReducer     : state.SessionReducer,
      // TokenReducer       : state.TokenReducer,
      PublisherReducer: state.PublisherReducer,
      ActiveLanguageReducer: state.ActiveLanguageReducer
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
  )(InstitutionLibrary);
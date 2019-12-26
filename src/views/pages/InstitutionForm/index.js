import { connect } from 'react-redux';

import InstitutionForm from './InstitutionForm';


const mapStateToProps = state => {
  return {
    ActiveLanguageReducer: state.ActiveLanguageReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstitutionForm);

import {connect} from 'react-redux';
import Contact from './Contact';

const mapStateToProps = state => {
  return {
    ActiveLanguageReducer: state.ActiveLanguageReducer
  };
};

export default connect(
  mapStateToProps,
  {}
)(Contact);

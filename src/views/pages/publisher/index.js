import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PublisherScreen from './publisher';
import * as institutionAction from '../../../redux/actions/institutionAction';
import {reorderGroup} from '../../../redux/actions/reorderGroups'

const mapStateToProps = (state) => {
    return {
      SessionReducer: state.SessionReducer,
      TokenReducer: state.TokenReducer,
      PublisherReducer: state.PublisherReducer,
      ActiveLanguageReducer: state.ActiveLanguageReducer,
    }
  }
  
  const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({
      ...institutionAction,
      reorderGroup
    }, dispatch),
    RunRedux: data => {
      dispatch(data);
    }
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(PublisherScreen)
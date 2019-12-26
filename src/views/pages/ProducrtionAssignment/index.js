import InstitutionLibrary  from "./InstitutionLibrary";
import { connect } from 'react-redux';
import * as productionAssignmentActions from '../../../redux/actions/productionAssignmentActions';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
    return {
      // SessionReducer     : state.SessionReducer,
      // TokenReducer       : state.TokenReducer,
      PublisherReducer: state.PublisherReducer,
      ActiveLanguageReducer: state.ActiveLanguageReducer,
      groups: state.productionAssignmentGroups,
      assignGroupStatus: state.assignGroupStatus,
      unassignGroupStatus: state.unassignGroupStatus
    };
  };
  const mapDispatchToProps = dispatch => {
    return {
      RunRedux: data => {
        dispatch(data);
      },
      ...bindActionCreators({
        ...productionAssignmentActions
      }, dispatch)
    };
  };
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(InstitutionLibrary);
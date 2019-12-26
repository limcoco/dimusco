import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import productionGroup from './ProductionGroup';
import { loadInterests } from '../../../redux/actions/InterestsAction';
import * as productionsActions from '../../../redux/actions/productionsActions'
import {reorderGroup} from '../../../redux/actions/reorderGroups'
import * as institutionAction from '../../../redux/actions/institutionAction';

const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    TokenReducer: state.TokenReducer,
    InstitutionReducer: state.InstitutionReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    interests: state.InterestsReducer.interests
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      loadInterests,
      ...productionsActions,
      reorderGroup,
      ...institutionAction
    },
    dispatch
  ),
  RunRedux: data => {
    dispatch(data);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(productionGroup);

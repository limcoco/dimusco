import { connect } from 'react-redux'

import ProductionScores from './ProductionScores'
import * as dashBoardActions from '../../../redux/actions/dashBoardActions';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    Token: state.TokenReducer,
    PublisherReducer: state.PublisherReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer,
    LanguageReducer: state.LanguageReducer,
    deleteLibraryScoreStatus: state.deleteLibraryScoreStatus,
    changeLibraryScoreStatus: state.changeLibraryScoreStatus
  }
}
const mapDispatchToProps = dispatch => {
  return {
    RunRedux: data => {
      dispatch(data)
    },
    ...bindActionCreators({
      ...dashBoardActions
    }, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductionScores)

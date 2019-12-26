import ScoreUpload from './ScoreUpload';
import { connect } from "react-redux"
import * as uploadScoresAction from '../../../redux/actions/uploadScoresAction'
import {getUserDetails} from '../../../redux/actions/profilePageActions/UserDetailsActions'
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
      uploadScores: state.uploadScores
    }
  }
  
  export default connect(mapStateToProps, {...uploadScoresAction, getUserDetails})(ScoreUpload)
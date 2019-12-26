import { connect } from "react-redux"
import SetDiscount from './SetDiscount'

const mapStateToProps = (state) => {
    return {
      SessionReducer: state.SessionReducer,
      Token: state.TokenReducer,
      SearchReducer: state.SearchReducer,
      PublisherReducer: state.PublisherReducer,
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
  export default connect(mapStateToProps, mapDispatchToProps)(SetDiscount)
  
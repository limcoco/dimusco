import { connect } from 'react-redux'

import SetPriceScreen from './SetPrice'

const mapStateToProps = state => {
  return {
    SessionReducer: state.SessionReducer,
    Token: state.TokenReducer,
    PublisherReducer: state.PublisherReducer,
    ActiveLanguageReducer: state.ActiveLanguageReducer,
    ActiveCurrencyReducer: state.ActiveCurrencyReducer,
    LanguageReducer: state.LanguageReducer,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    RunRedux: data => {
      dispatch(data)
    },
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetPriceScreen)

import { connect } from 'react-redux';
import PubLibraryScreen from './PublisherLibrary';

const mapStateToProps = state => {
    return {
      SessionReducer: state.SessionReducer,
      Token: state.TokenReducer,
      SearchReducer: state.SearchReducer,
      PublisherReducer: state.PublisherReducer,
      ActiveLanguageReducer: state.ActiveLanguageReducer,
      ActiveCurrencyReducer: state.ActiveCurrencyReducer
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
  )(PubLibraryScreen);
  
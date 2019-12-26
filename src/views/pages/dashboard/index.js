import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Book from './Book';

import * as dashBoardActions from '../../../redux/actions/dashBoardActions';

const mapStateToProps = state => {
    return {
        SessionReducer: state.SessionReducer,
        ActiveLanguageReducer: state.ActiveLanguageReducer,
        SearchReducer: state.SearchReducer,
        PublisherReducer: state.PublisherReducer,
        libraryScores: state.libraryScores,
        deleteLibraryScoreStatus: state.deleteLibraryScoreStatus,
        changeLibraryScoreStatus: state.changeLibraryScoreStatus
    };
};

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({
      ...dashBoardActions
    }, dispatch),
    RunRedux: data => {
        dispatch(data);
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Book);

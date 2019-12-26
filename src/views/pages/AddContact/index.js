import { connect } from 'react-redux';

import AddContact from './AddContact';

import { bindActionCreators } from 'redux';

import * as contactsGroupsActions from '../../../redux/actions/contactsGroupsActions';

const mapStateToProps = state => {
    return {
      SessionReducer: state.SessionReducer,
      TokenReducer: state.TokenReducer,
      EnsembleReducer: state.EnsembleReducer,
      InstitutionReducer: state.InstitutionReducer,
      ActiveLanguageReducer: state.ActiveLanguageReducer,
      PublisherReducer: state.PublisherReducer,
      userDetails: state.userDetails,
      contactsGroups: state.contactsGroups
    };
};

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({
      ...contactsGroupsActions
    }, dispatch)
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddContact);
  
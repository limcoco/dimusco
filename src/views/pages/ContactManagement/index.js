import { connect } from 'react-redux';

import ContactsManagment from './ContactsManagment';
import * as contactsActions from '../../../redux/actions/profilePageActions/contactsActions';
import * as contactsGroupsActions from '../../../redux/actions/contactsGroupsActions';
import { bindActionCreators } from 'redux';
import {reorderContactGroup} from '../../../redux/actions/reorderGroups'

const mapStateToProps = state => {
    return {
      SessionReducer: state.SessionReducer,
      TokenReducer: state.TokenReducer,
      EnsembleReducer: state.EnsembleReducer,
      InstitutionReducer: state.InstitutionReducer,
      ActiveLanguageReducer: state.ActiveLanguageReducer,
      PublisherReducer: state.PublisherReducer,
      contacts: state.contacts,
      userDetails: state.userDetails,
      contactsGroups: state.contactsGroups,
      createContactsGroupStatus: state.createContactsGroupStatus,
      deleteContactsGroupStatus: state.deleteContactsGroupStatus,
      groupContacts: state.groupContacts
    };
};

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({
        reorderContactGroup,
      ...contactsActions,
      ...contactsGroupsActions
    }, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactsManagment);
  
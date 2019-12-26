import React, { Component } from 'react';

import {
  Router,
  Route,
  Switch
} from 'react-router-dom';

import history from '../../../history';
import UserMenu from './Menu';
import OverView from './OverView';
import OrderHistory from './OrderHistory';
import ManageAddresses from './ManageAddresses';
import AddressForm from './AddressForm';
import ChangePassword from './ChangePassword';
import ChangeUserName from './ChangeUserName';
import CancelMemberShip from './CancelMemberShip';
import PaymentManagement from './PaymentManagement';
import CardsPage from './CardsPage';
import AddCard from './AddCard';
import RemoveEnsemble from './RemoveEnsemble';
import ManagePublisher from '../publisher/manage_publisher';

class ProfilePage extends Component {
    state = {
        activeTab: ''
    }
    
    componentDidMount () {
        this.props.getUserDetails();
        if (this.props.location.pathname === '/profile/overview') {
            this.setState({
                activeTab: 0
            })
        }
        if (this.props.location.pathname === "/profile") {
            history.push('/profile/overview')
        }
    }

    toggleTab = (tab) => {
        if (this.state.activeTab !== tab) {
          this.setState({ activeTab: tab });
        }
    }
    

    render () {
        const {
            ActiveLanguageReducer,
            InstitutionReducer,
            EnsembleReducer,
            PublisherReducer,
            userDetails,
            location: {pathname},
        } = this.props;
        return (
            <div className="animated fadeIn user-content full-height institution-content profile-page full-height">
                <Router history={history}>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-3 col-sm-3 col-xs-12 no-margin sidebar'>
                                <div className='menu-inner'>
                                    <UserMenu
                                        words={ActiveLanguageReducer.words}
                                        institutionIsAuth={InstitutionReducer.is_auth}
                                        ensembleIsAuth={EnsembleReducer.is_auth}
                                        publisherIsAuth={PublisherReducer.is_auth}
                                        toggleTab={this.toggleTab}
                                        activeTab={this.state.activeTab}
                                        pathname={pathname}
                                        gotoRelations={() => this.props.history.push('/relations')}
                                    />
                                </div>
                            </div>
                            <div className='col-md-9 col-sm-9 col-xs-12 user-main-info'>
                            <Switch>
                                <Route
                                    path='/profile/overview'
                                    render={(props) => (
                                        <OverView
                                            {...props}
                                            accountDetails={userDetails}
                                            toggleTab={this.toggleTab}
                                        />
                                    )}
                                />
                                 <Route
                                    path='/profile/history'
                                    render={(props) => (
                                        <OrderHistory
                                            {...props}
                                            accountDetails={userDetails}
                                        />
                                    )}
                                />
                                 <Route
                                    path='/profile/addr'
                                    render={(props) => (
                                        <ManageAddresses
                                            {...props}
                                            accountDetails={userDetails}
                                        />
                                    )}
                                />
                                <Route
                                    path='/profile/addressForm'
                                    render={(props) => (
                                        <AddressForm
                                            {...props}
                                            accountDetails={userDetails}
                                        />
                                    )}
                                    exact
                                />
                                <Route
                                    path='/profile/addressForm/:id'
                                    render={(props) => (
                                        <AddressForm
                                            {...props}
                                            accountDetails={userDetails}
                                        />
                                    )}
                                />
                                <Route
                                    path='/profile/pwd'
                                    render={(props) => (
                                        <ChangePassword
                                            {...props}
                                            accountDetails={userDetails}
                                        />
                                    )}
                                />
                                <Route
                                    path='/profile/name'
                                    render={(props) => (
                                        <ChangeUserName
                                            {...props}
                                            accountDetails={userDetails}
                                            getUserDetails={this.props.getUserDetails}
                                        />
                                    )}
                                />
                                <Route
                                    path='/profile/cancel'
                                    render={(props) => (
                                        <CancelMemberShip
                                            {...props}
                                            accountDetails={userDetails}
                                        />
                                    )}
                                />
                                <Route
                                    path='/profile/payment'
                                    render={(props) => (
                                        <PaymentManagement
                                            {...props}
                                            userData={userDetails}
                                        />
                                    )}
                                />
                                <Route
                                    path='/profile/cc'
                                    render={(props) => (
                                        <CardsPage
                                            {...props}
                                            userData={userDetails}
                                        />
                                    )}
                                />
                                 <Route
                                    path='/profile/addCard'
                                    render={(props) => (
                                        <AddCard
                                            {...props}
                                            userData={userDetails}
                                        />
                                    )}
                                />
                               
                                <Route
                                    path='/profile/deleteEnsemble'
                                    render={(props) => (
                                        <RemoveEnsemble
                                            {...props}
                                            userData={userDetails}
                                        />
                                    )}
                                    exact
                                />
                                <Route
                                    path='/profile/managePublishers'
                                    render={(props) => (
                                        <ManagePublisher
                                            {...props}
                                        />
                                    )}
                                    exact
                                />
                            </Switch>
                            </div>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}

export default ProfilePage;

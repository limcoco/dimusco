import React, {Component, Fragment} from 'react';
import Modal from '../../../component/Modal/Skeleton';
import Presenter from "../../../../group/presenter.js"
import Request from "../../../../group/utils/request.js"
import NoramlRequest from "../../../../utils/Request";
import auth from '../../../../redux/account/authToken';

class InstitutionGroupsModal extends Component {
    state={
        isActive: false,
        items: [],
        groups: []
    }

    componentDidMount () {
        this.onRead()
    }

    toggleModal = () => {
        this.setState((state) => ({...state, isActive: !state.isActive}))
    }

     // Read List Group
    onRead(search, page) {
        Presenter.Read(
        Request.Read(search, page, this, this.onReadSuccess, this.onReadFailed)
        )
    }

    onReadSuccess = (_,response) => {
        this.setState({
            items: response.data.results
        })
    }

    onReadFailed = (error) => {
        console.log('error', error)
    }

    addGroups = () => {
      
        const headers = {
            Authorization: "Token " + auth.getActiveToken(),
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }

        const { groups } = this.state;
        const {match: {params: {prid: production}}} = this.props;
        
        const data = {
            groups,
            production
        }
        NoramlRequest(
            'post',
            'production-group-copy',
            headers,
            data,
            [],
            this.addGroupsSuccess,
            this.addGroupsFailure
        );
      }
    
      addGroupsSuccess = (response) => {
        this.props.getProdGroups();
        this.toggleModal();
      }
    
      addGroupsFailure = (error) => {
        console.log('error: ', error);
      }

      handleGroupCheck = ({target: {checked}}, group) => {
        const {groups} = this.state;
        const index = groups.indexOf(group);
 
        this.setState({
            groups: checked ? groups.concat(group) : groups.splice(index, 1)
        })        
      }

      displayGroups = (data) => {
        return data.map((item, index) => {
          return (
            <Fragment>
                <div key={item.gid} className='box'>
                    <p>{item.name}</p>
                    <label className="control control--checkbox">
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(ev) => this.handleGroupCheck(ev, item.gid)}
                        />
                        <div className="control__indicator" />
                    </label>
                </div>
              <ul className='group-wrp'>
                {item.children.length > 0 && this.displayGroups(item.children)}
              </ul>
            </Fragment>
            )
        })
      }
    
    render () {
        const {words} = this.props;
        const {items} = this.state;

        return (
            <Fragment>
                <button onClick={this.toggleModal} className='btn black small' style={{marginRight: '30px'}}>{words.prod_groups_copy || 'prod_groups_copy'}</button>
                <div className='institutin-groups invitations'>
                    <Modal
                        toggleModal={this.toggleModal}
                        isActive={this.state.isActive}
                        small
                    >
                        <a onClick={this.toggleModal} className='close'>X</a>
                        {items.length > 0 ? 
                        <div className='invitation-contacts'>
                            {this.displayGroups(items) }
                            <button className='btn black small' onClick={this.addGroups}>Add groups</button>
                        </div>
                        :
                        <div>There aren't any groups to copy.</div>
                        }
                    </Modal>
                </div>
            </Fragment>
        );
    }
}

export default InstitutionGroupsModal;
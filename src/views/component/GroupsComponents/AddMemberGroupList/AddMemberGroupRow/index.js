import React from "react"
import classnames from "classnames"

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateInterests, loadInterests } from "../../../../../redux/actions/InterestsAction.js";
import Auth from '../../../../../redux/account/authToken';

import './styles.css';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class AddMemberGroupRow extends React.Component {
  constructor(props) {
    super(props)

    let interestsMap = props.interests.reduce(function(acc, cur, i) {
      acc[cur.name.toLowerCase()] = cur.id;
      return acc;
    }, {});

    this.state = {
      expanded: false,
      gid: props.rowData.gid
    }

    if (props.rowData.interests) {
      this.state.interests = props.rowData.interests.map((item) => {
        return { value: interestsMap[item.toLowerCase()], label: capitalizeFirstLetter(item), checked: true}
      })
    }

    this.expand = this.expand.bind(this)
    this.collapse = this.collapse.bind(this)
    this.addToGroup = this.addToGroup.bind(this)
  }

  componentDidMount () {
    this.props.loadInterests(Auth)
  }


  handleInterestsChange = (userId, groupId) => (data) => {
    this.setState({
      interests: data
    });
    this.props.updateInterests(userId, groupId, data.map((item) => {
      return { id: item.value, name: item.label }
    }));
    setTimeout(() => {
        this.props.onReadMemberGroup()
      }, 1000)
  }

  expand(e) {
    this.setState({expanded: true})
  }

  collapse(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      this.setState({expanded: false})
    } else {
      this.timer = setTimeout(() => {
        this.setState({expanded: false})
      }, 200)
    }
  }

  addToGroup() {
    const {groupID, rowData} = this.props
    if(groupID === "administrator") {
      // add member to group administartor
      this.props.addMemberToGroup(rowData.uid)
    } else {
      // add member to other group
      this.props.addMemberToGroup(rowData.uid)
    }
  }

  componentWillMount() {
    clearTimeout(this.timer)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const {rowData, mode, groupID, InstitutionReducer, words, active} = this.props
    let meta, name
    
    if(rowData.name === "") {
      name = <span>-</span>
      meta = <span className="meta-not-register">{words.gen_not_registered || 'gen_not_registered'}</span>
    } else {
      name = <span>{rowData.name}</span>
      if(rowData.is_admin || groupID === "administrator") {
        meta = <span className="meta-admin">{words.gen_admin || 'gen_admin'}</span>
      }
    }

    return (
      <div className="m-l">
        <li 
        className={classnames("member transition-all m-p-15", {"member-active" : active === rowData.uid })}
        onClick={() => this.props.setActiveMember(rowData)}
        >
          <div className="overlay-page-body-row">
            {mode === "add" &&
              <button className="btn-add-large" onClick={this.addToGroup}><i className="material-icons">add</i></button>
            }
            <div className="body-list-inside">
              <div className="body-list-inside-main">
                <div className="body-list-inside-title">
                  {name}
                </div>
                <div className="body-list-inside-meta">
                  {meta}
                </div>
              </div>
              <div className={classnames("body-list-inside-secondary", "interests")}>
                <span>{rowData.email}</span>
                <ul>
                  {rowData && rowData.interests && rowData.interests.map((item) => {
                    return <li key={item}>{item}</li>
                  })}
                </ul>
              </div>
            </div>
          </div>
        </li>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    interests: state.InterestsReducer.interests
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    updateInterests,
    loadInterests
  }, dispatch)
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(AddMemberGroupRow);
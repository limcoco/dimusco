import classnames from "classnames";
import React from "react";
import getFirstCaracter from "./../../../../../utils/get_first_caracter.js";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateInterests, loadInterests } from "./../../../../../redux/actions/InterestsAction.js";
import InterestsMultiselect from './../../../group/InterestsMultiselect';
import './styles.css';
import DropDownDynamic from '../../../../component/DropDownDynamic'
import auth from "../../../../../redux/account/authToken";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class MemberRow extends React.Component {
  constructor(props) {
    super(props)

    let interestsMap = props.interests.reduce(function(acc, cur, i) {
      acc[cur.name.toLowerCase()] = cur.id;
      return acc;
    }, {});

    this.state = {
      expanded: false
    }

    if (props.rowData.interests) {
      this.state.interests = props.rowData.interests.map((item) => {
        return { value: interestsMap[item.toLowerCase()], label: capitalizeFirstLetter(item), checked: true}
      })
    }

    this.expand = this.expand.bind(this)
    this.collapse = this.collapse.bind(this)

  }

  expand(e) {
    this.setState({ expanded: true })
  }

  collapse(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      this.setState({ expanded: false })
    } else {
      this.timer = setTimeout(() => {
        this.setState({ expanded: false })
      }, 200)
    }
  }

  componentDidMount () {
    this.props.loadInterests(auth);
  }

  componentWillMount() {
    clearTimeout(this.timer)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  handleInterestsChange = (userId, groupId) => (data) => {
    this.setState({
      interests: data
    });
    this.props.updateInterests(userId, groupId, data.map((item) => {
      return { id: item.value, name: item.label }
    }));
    setTimeout(() => {
      this.props.onReadMember()
  }, 1000)
  }

  render() {
    const { rowData, InstitutionReducer, words, active } = this.props

    let meta, name
    
    if (rowData.name === "") {
      name = <span>-</span>
      meta = <span className="meta-not-register">{words.gen_not_registered || 'gen_not_registered'}</span>
    } else {
      name = <span>{rowData.name}</span>
      if (rowData.is_admin) {
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
                <span className="user-email" >{rowData.email}</span>
                {/* <ul>
                  {rowData.interests.map((item) => {
                    return <li key={item}>{item}</li>
                  })}
                </ul> */}
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
)(MemberRow);
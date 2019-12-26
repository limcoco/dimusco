import React from "react"

import Animated from "../../component/animated.js"
import { InstitutionList } from "../../component/animation.js"
import checkSession from "../../../utils/check_session.js"
import Request from "../../../utils/Request";
import auth from '../../../redux/account/authToken';
import './style.css';
import { Link } from 'react-router-dom';

class Productions extends React.Component {
  constructor(props) {
    super(props);
    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)
    this.state = {
        items: [],
        isLoading: false
    }
  }

  componentDidMount () {
    this.getProductions();
  }

  getProductions = () => {
    this.setState({
      isLoading: true
    })
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
        'Content-Type': 'application/json', 'Accept': 'application/json'
    }
    Request(
        'get',
        'productions',
        headers,
        {},
        [],
        this.getProductionsSuccess,
        this.getProductionsFailure
    );
  }

  getProductionsSuccess = (response) => {
    this.setState({
      items: response.data.results || [],
      isLoading: false
    })
  }

  getProductionsFailure = (error) => {
    console.log('error: ', error);
    this.setState({
      isLoading: false
    })
  }

  createProduction = () => {
    this.props.history.push("/create-production")
  }

  gotToGroups = (prid, production) => {
    localStorage.setItem('production', JSON.stringify(production))
    this.props.history.push(`/production/${prid}/groups`)
  }

  render() {
    if (!this.loggedIn) return (null)
    const { words } = this.props.ActiveLanguageReducer

    const {
      isLoading,
      items,
      count,
    } = this.state;
    
    return (
      <section className="user-content full-height institution-content productions">
        <div className="container">
          <div className="row center-xs bb">
            <div className="col-md-3">
              {/*<button>Create Institution</button>*/}
            </div>
            <div className="col-md-6 col-xs-10">
              <div className="box musinote-center">
                <h3 className="no-margin">{words.gen_production}</h3>
              </div>
            </div>
            <div className="col-md-3 center-content">
              <div>
                <button className='btn black small' onClick={this.createProduction} style={{textTransform: 'capitalize'}}>{words.prod_create}</button>
              </div>
            </div>
          </div>
          <div className="row center-xs">
            <div className="col-md-6 col-xs-10">
              <div className="box">
                <Animated total={5} loading={isLoading} count={count} text={words.manageensemble_empty} animation={<InstitutionList />}>
                <ul className="institution-list">
                  {items.map((item) => {
                    return (
                      <li className="institution transition-all" key={item.prid} onClick={() => this.gotToGroups(item.prid, item)}>
                        {item.name}
                      </li>
                    )
                  })}
                    
                </ul>
                </Animated>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Productions;

import React from "react"
import checkSession from "../../../utils/check_session.js"
import ContentTitle from "../../component/ContentTitle.js"
import Request from "../../../utils/Request";
import auth from '../../../redux/account/authToken';

class CreateProduction extends React.Component {
  constructor(props) {
    super(props);
    this.loggedIn = checkSession.isLoggedIn(props.history, props.SessionReducer.is_auth)
    this.state = {
        name: ''
    }
  }

  createProduction = (name) => {
    const headers = {
        Authorization: "Token " + auth.getActiveToken(),
        'Content-Type': 'application/json', 'Accept': 'application/json'
    }
    Request(
        'post',
        'productions',
        headers,
        {name},
        [],
        this.createProductionSuccess,
        this.createProductionFailure
    );
  }

  createProductionSuccess = (response) => {
    this.props.history.push("/productions")
  }

  createProductionFailure = (error) => {
    console.log('error: ', error);
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { name } = this.state;
    this.createProduction(name);
  }

  handleInput = (ev) => {
    this.setState({
        [ev.target.name]: ev.target.value
    });
  }

  render() {
    if (!this.loggedIn) return (null)
    const { words } = this.props.ActiveLanguageReducer
    const { name } = this.state;
    return (
      <div className='create-ensemble'>
        <section className="login-area">
          <ContentTitle title={words.prod_create} />
          <div className="container-fluid">
            <form onSubmit={this.handleSubmit}>

              <div className="row content-center form-group">
                <div className="col-md-4 col-sm-6 col-xs-10 form-validation-error-horizontal-medium">
                  <input
                    type="text"
                    className="form-control-large"
                    name="name"
                    placeholder='Production name'
                    onChange={this.handleInput}
                    value={name}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12 sign-in">
                  <div className="no-border">
                    <button
                      disabled={!name}
                      className='btn black small'
                    >
                      {words.gen_create}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    )
  }
}

export default CreateProduction;
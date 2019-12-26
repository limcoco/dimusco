import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Radio from '../../component/Radio';
import './style.css'

export default class InstitutionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address_extra: false,
      request_type: "request"
    };
  }

  handleChange = (e, key) => {
    if (key === 'order' || key === 'request') {
      this.setState({
        request_type: key
      })
    }
    else {
      this.setState({
        [key]: e.target.checked
      })
    }
  }

  render() {
    const { words } = this.props.ActiveLanguageReducer;
    const { address_extra, request_type } = this.state

    return (
      <React.Fragment>
        <div className="institution-form profile-page full-height">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>{words['inst-form_title'] || 'inst-form_title'}</h2>
              <Form
                ref={c => {
                  this.form = c;
                }}
              >
                <div className="row">
                  <div className="col-lg-12">
                  <div  className="d-flex inst-form-header">
                  <div>
                    <label>{words.gen_publisher || 'gen_publisher'}:</label>
                    <label>{"publisher"}</label>
                  </div>
                  <div>
                    <label>{words.gen_date || 'gen_date'}:</label>
                    <label>{"date"}</label>
                  </div>
                  </div>
                  </div>
                </div>

                <div className="d-flex mt-3">
                  <Radio
                    label={words.gen_request || 'gen_request' }
                    name="radio"
                    value="request"
                    checked={request_type === "request"}
                    onChange={e => this.handleChange(e,"request")}
                  />
                  <div className="ml-3">
                  <Radio
                    label={words.gen_order || 'gen_order' }
                    name="radio"
                    value="order"
                    checked={request_type === 'order'}
                    onChange={e => this.handleChange(e,"order")}
                  />
                  </div>
                </div>

                <div className="inst-form-wrp">
                  <legend>{words.gen_your_data || 'gen_your_data' }</legend>
                  <div className="publisher-main-wrapper">
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_institution || 'gen_institution'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words['gen_last-name'] || 'gen_last-name'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words['gen_first-name'] || 'gen_first-name'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_street || 'gen_street'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_zip || 'gen_zip'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_city || 'gen_city'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_country || 'gen_country'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_phone || 'gen_phone'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_fax || 'gen_fax'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row content-left form-group">
                      <div className="start-middle-content">
                        <label>{words.gen_email || 'gen_email'}:</label>
                      </div>
                      <div className="form-validation-error-horizontal">
                        <Input
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {address_extra &&
                  <div className="inst-form-wrp">
                    <label className="control control--checkbox">
                      <span className="ov-divider">
                         <legend className="address-extra-lbl">{words.gen_address_extra || 'gen_address_extra' }</legend>
                      </span>
                      <input
                        type="checkbox"
                        checked={address_extra}
                        onChange={e =>
                          this.handleChange(e,'address_extra')
                        }
                      />
                      <div className="control__indicator check-box" />
                    </label>
                    <div className="publisher-main-wrapper">
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_name || 'gen_name'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words['gen_last-name'] || 'gen_last-name'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words['gen_first-name'] || 'gen_first-name'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_street || 'gen_street'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_zip || 'gen_zip'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_city || 'gen_city'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_country || 'gen_country'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_phone || 'gen_phone'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_fax || 'gen_fax'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row content-left form-group">
                        <div className="start-middle-content">
                          <label>{words.gen_email || 'gen_email'}:</label>
                        </div>
                        <div className="form-validation-error-horizontal">
                          <Input
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>}

                {!address_extra &&
                  <div className="address-wrap">
                  <label className="control control--checkbox">
                       <legend>{words.gen_address_extra || 'gen_address_extra' }</legend>
                    <input
                      type="checkbox"
                      checked={address_extra}
                      onChange={e =>
                        this.handleChange(e, "address_extra")
                      }
                    />
                    <div className="control__indicator" />
                  </label></div>}
                <div className='btns-wrp'>
                  <button className='btn black' type='submit'>{words.gen_send}</button>
                </div>
              </Form>
            </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

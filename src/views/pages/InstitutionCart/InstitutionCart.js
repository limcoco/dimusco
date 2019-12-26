import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import Table from '../../component/Table/Table.js';
import InstCartRow from '../product/component/InstCartRow.js';
import { InfoModal } from '../../component/Modal';

import tableData from './tableData';
import AddressesModal from './AddressesModal';
import './style.css';

class InstitutionCart extends React.Component {
  state = {
    showModal: false,
    success: false,
    redirectUrl: '',
    raw_data_scores: [],
    raw_data_play: [],

    selectedAddress: {},

    order_perusal_material: true,
    order_perusal_material_start_date: moment(),
    order_perusal_material_to_date: moment().add(14, 'days'),
    order_print_material_start_date: moment(),
    order_print_material_to_date: moment().add(14, 'days'),
    order_perusal_material_order_printed_material: false,
    order_perusal_material_name_1: '',
    order_perusal_material_name_2: '',
    order_perusal_material_address_1: '',
    order_perusal_material_address_2: '',
    order_perusal_material_city: '',
    order_perusal_material_postial_code: '',
    order_perusal_material_additional_information: '',

    play: [],
    order_performance_material: true,
    order_performance_material_order_printed_material: false,
    order_performance_material_start_date: moment(),
    order_performance_material_to_date: moment(),
    order_performance_material_name_1: '',
    order_performance_material_name_2: '',
    order_performance_material_address_1: '',
    order_performance_material_address_2: '',
    order_performance_material_city: '',
    order_performance_material_postial_code: '',
    order_performance_material_additional_information: ''
  };

  removeItem = (id, typ) => {
    const { cart, removeFromCart } = this.props;
    const type = typ + 's';
    const instCart = cart.institutionCart;
    removeFromCart(id, type, instCart);
  };

  generateRow(row, type) {
    var element = row.map((val, index) => {
      return (
        <InstCartRow
          index={index}
          key={index}
          rowData={val}
          removeItem={this.removeItem}
          type={type}
        />
      );
    });
    return element;
  }

  toggleModal = infoMsg => {
    this.setState({ showModal: !this.state.showModal, infoMsg });
  };

  onOrder = () => {
    const { institutionCart } = this.props.cart;

    if (institutionCart.plays.length + institutionCart.scores.length === 0) {
      this.toggleModal('You have to add scores to the cart first');
      return;
    }

    if (this.checkValidation()) return true;

    let o_prsl_mn1,
      o_prsl_mn2,
      o_prsl_ma1,
      o_prsl_ma2,
      o_prsl_mc,
      o_prsl_mpc,
      o_prsl_mai,
      o_prf_mn1,
      o_prf_mn2,
      o_prf_ma1,
      o_prf_ma2,
      o_prf_mc,
      o_prf_mpc,
      o_prf_mai;

    if (
      this.state.order_perusal_material_order_printed_material &&
      !this.state.order_performance_material_order_printed_material
    ) {
      o_prsl_mn1 = this.state.order_perusal_material_name_1;
      o_prsl_mn2 = this.state.order_perusal_material_name_2;
      o_prsl_ma1 = this.state.order_perusal_material_address_1;
      o_prsl_ma2 = this.state.order_perusal_material_address_2;
      o_prsl_mc = this.state.order_perusal_material_city;
      o_prsl_mpc = this.state.order_perusal_material_postial_code;
      o_prsl_mai = this.state.order_perusal_material_additional_information;

      o_prf_mn1 = '';
      o_prf_mn2 = '';
      o_prf_ma1 = '';
      o_prf_ma2 = '';
      o_prf_mc = '';
      o_prf_mpc = '';
      o_prf_mai = '';
    } else if (
      !this.state.order_perusal_material_order_printed_material &&
      this.state.order_performance_material_order_printed_material
    ) {
      o_prsl_mn1 = '';
      o_prsl_mn2 = '';
      o_prsl_ma1 = '';
      o_prsl_ma2 = '';
      o_prsl_mc = '';
      o_prsl_mpc = '';
      o_prsl_mai = '';

      o_prf_mn1 = this.state.order_performance_material_name_1;
      o_prf_mn2 = this.state.order_performance_material_name_2;
      o_prf_ma1 = this.state.order_performance_material_address_1;
      o_prf_ma2 = this.state.order_performance_material_address_2;
      o_prf_mc = this.state.order_performance_material_city;
      o_prf_mpc = this.state.order_performance_material_postial_code;
      o_prf_mai = this.state.order_performance_material_additional_information;
    } else {
      o_prsl_mn1 = this.state.order_perusal_material_name_1;
      o_prsl_mn2 = this.state.order_perusal_material_name_2;
      o_prsl_ma1 = this.state.order_perusal_material_address_1;
      o_prsl_ma2 = this.state.order_perusal_material_address_2;
      o_prsl_mc = this.state.order_perusal_material_city;
      o_prsl_mpc = this.state.order_perusal_material_postial_code;
      o_prsl_mai = this.state.order_perusal_material_additional_information;

      o_prf_mn1 = this.state.order_performance_material_name_1;
      o_prf_mn2 = this.state.order_performance_material_name_2;
      o_prf_ma1 = this.state.order_performance_material_address_1;
      o_prf_ma2 = this.state.order_performance_material_address_2;
      o_prf_mc = this.state.order_performance_material_city;
      o_prf_mpc = this.state.order_performance_material_postial_code;
      o_prf_mai = this.state.order_performance_material_additional_information;
    }

    let payload = {}

    if (this.state.order_performance_material) {
      payload = {
        scores: JSON.stringify(institutionCart.scores.map(item => item.sid)),
        order_perusal_material: this.state.order_perusal_material,
        order_perusal_material_start_date: moment(
          this.state.order_perusal_material_start_date
        ).format('YYYY-MM-DD'),
        order_perusal_material_to_date: moment(
          this.state.order_perusal_material_to_date
        ).format('YYYY-MM-DD'),
        order_perusal_material_order_printed_material: this.state
          .order_perusal_material_order_printed_material,
  
        order_perusal_material_name_1: o_prsl_mn1,
        order_perusal_material_name_2: o_prsl_mn2,
        order_perusal_material_address_1: o_prsl_ma1,
        order_perusal_material_address_2: o_prsl_ma2,
        order_perusal_material_city: o_prsl_mc,
        order_perusal_material_postial_code: o_prsl_mai,
        order_perusal_material_additional_information: o_prf_mn1,
  
        play: JSON.stringify(institutionCart.plays.map(item => item.ssid)),
        order_performance_material: this.state.order_performance_material,
        order_performance_material_order_printed_material: this.state
          .order_performance_material_order_printed_material,
        order_performance_material_start_date: moment(
          this.state.order_performance_material_start_date
        ).format('YYYY-MM-DD'),
        order_performance_material_to_date: moment(
          this.state.order_performance_material_to_date
        ).format('YYYY-MM-DD'),
  
        order_performance_material_name_1: o_prf_mn1,
        order_performance_material_name_2: o_prf_mn2,
        order_performance_material_address_1: o_prf_ma1,
        order_performance_material_address_2: o_prf_ma2,
        order_performance_material_city: o_prf_mc,
        order_performance_material_postial_code: o_prf_mpc,
        order_performance_material_additional_information: o_prf_mai
      };
    } else if (this.state.order_perusal_material) {
      payload = {
        scores: JSON.stringify(institutionCart.scores.map(item => item.sid)),
        order_perusal_material: this.state.order_perusal_material,
        order_perusal_material_start_date: moment(
          this.state.order_perusal_material_start_date
        ).format('YYYY-MM-DD'),
        order_perusal_material_to_date: moment(
          this.state.order_perusal_material_to_date
        ).format('YYYY-MM-DD'),
        order_perusal_material_order_printed_material: this.state
          .order_perusal_material_order_printed_material,
  
        order_perusal_material_name_1: o_prsl_mn1,
        order_perusal_material_name_2: o_prsl_mn2,
        order_perusal_material_address_1: o_prsl_ma1,
        order_perusal_material_address_2: o_prsl_ma2,
        order_perusal_material_city: o_prsl_mc,
        order_perusal_material_postial_code: o_prsl_mai,
        order_perusal_material_additional_information: o_prf_mn1,
  
        order_performance_material: this.state.order_performance_material,
        order_performance_material_order_printed_material: this.state
          .order_performance_material_order_printed_material,
        order_performance_material_start_date: moment(
          this.state.order_performance_material_start_date
        ).format('YYYY-MM-DD'),
        order_performance_material_to_date: moment(
          this.state.order_performance_material_to_date
        ).format('YYYY-MM-DD'),
  
        order_performance_material_name_1: o_prf_mn1,
        order_performance_material_name_2: o_prf_mn2,
        order_performance_material_address_1: o_prf_ma1,
        order_performance_material_address_2: o_prf_ma2,
        order_performance_material_city: o_prf_mc,
        order_performance_material_postial_code: o_prf_mpc,
        order_performance_material_additional_information: o_prf_mai
      };
    }

    this.props.institutionPurchase(
      payload,
      this.props.TokenReducer.tokenInstitution,
      {
        onSuccess: this.onOrderSuccess,
        onFailed: this.onOrderFailed
      }
    );
  };

  onOrderSuccess = response => {
    const { words } = this.props.ActiveLanguageReducer;
    this.toggleModal(words.cart_msg_checkout_success);
    this.setState({ redirectUrl: '/library', success: true });
  };

  onOrderFailed = error => {
    const { words } = this.props.ActiveLanguageReducer;
    this.toggleModal(words.cart_msg_checkout_failed);
  };

  handleChange = (e, key) => {
    this.setState({
      [key]: e.target.checked
    });
  };

  checkValidation = () => {
    const { words } = this.props.ActiveLanguageReducer;

    if (
      !this.state.order_perusal_material &&
      !this.state.order_performance_material
    ) {
      return true;
    } else if (
      this.state.order_perusal_material &&
      !this.state.order_performance_material
    ) {
      // list score
      for (let i = 0; i < this.state.raw_data_scores.length; i++) {
        this.scores_list.push(this.state.raw_data_scores[i].sid);
      }
    } else if (
      !this.state.order_perusal_material &&
      this.state.order_performance_material
    ) {
      // list play
      for (let i = 0; i < this.state.raw_data_play.length; i++) {
        this.play_list.push(this.state.raw_data_play[i].ssid);
      }
    } else if (
      this.state.order_perusal_material &&
      this.state.order_performance_material
    ) {
      // list keduanya
      for (let i = 0; i < this.state.raw_data_scores.length; i++) {
        this.scores_list.push(this.state.raw_data_scores[i].sid);
      }
      for (let i = 0; i < this.state.raw_data_play.length; i++) {
        this.play_list.push(this.state.raw_data_play[i].ssid);
      }
    }
  };

  renderRow(type) {
    let raw = [];

    const { cart } = this.props;

    if (!cart.institutionProducts) return null;

    const { scores = [], play = [] } = cart.institutionProducts;
    raw = [...scores, ...play]
    if (typeof raw === 'undefined') {
      return (
        <tr>
          <td colSpan={100}>
            <p className="grey text-center">Data Empty</p>
          </td>
        </tr>
      );
    } else {
      if (raw.length === 0) {
        return (
          <tr>
            <td colSpan={100}>
              <p className="grey text-center">Data Empty</p>
            </td>
          </tr>
        );
      } else {
        return this.generateRow(raw, type);
      }
    }
  }

  componentDidMount() {
    const {
      getCartProducts,
      TokenReducer,
      cart: { institutionCart },
      getAddresses
    } = this.props;
    if (TokenReducer.tokenInstitution)
      getCartProducts(institutionCart, TokenReducer.tokenInstitution);
      getAddresses();
  }

  transferAddress = (selectedAddress) => {
     this.setState({
       selectedAddress
     })
  }

  render() {
    const { showModal, infoMsg, redirectUrl, success, order_perusal_material_order_printed_material, selectedAddress } = this.state;
    const { ActiveLanguageReducer, cart, address, addresses } = this.props;
    const { words } = ActiveLanguageReducer;

    const {
      tableColumns,
      tableColumnExtras,
      tableColumnsPerformance,
      tableColumnExtrasPerformance
    } = tableData(words);

    return success && !showModal ? (
      <Redirect to={redirectUrl} />
    ) : (
      <React.Fragment>
        <InfoModal
          headline="Checkout"
          info={infoMsg}
          toggleModal={this.toggleModal}
          isActive={showModal}
        />
        <div className="animated fadeIn institution-wrp">
          <div className="container order-container">
            <div className="row">
              <div className="col-md-12 col-sm-12 col-xs-12 cart-big-title no-border">
                <h3>{words['inst-cart_title'] || 'inst-cart_title'}</h3>
              </div>
            </div>

            <div className="">
              {/* <div className="row">
                <legend className="divider-midle divider-left">
                  <label className="control control--checkbox">
                    <span className="ov-divider">
                      {words['inst-cart_perusal_material'] || 'inst-cart_perusal_material'}
                    </span>
                    <input
                      type="checkbox"
                      checked={this.state.order_perusal_material}
                      onChange={e =>
                        this.handleChange(e, 'order_perusal_material')
                      }
                    />
                    <div className="control__indicator" />
                  </label>
                </legend>
              </div> */}

              <div className="row border-table">
                <Table
                  columns={tableColumns}
                  columnsExtras={tableColumnExtras}
                  onHeaderItemClick={this.onTableHeaderItemClick}
                >
                  {this.renderRow()}
                </Table>
              </div>

              <div className="row center-xs">
                <div class="col-xs-12">
                <div class="box dates-wrp">
                  <div className="row">
                    <div class="col-xs">
                      <div class="box flex-center">
                        <span className="horizontal-field">
                          <label>{words.gen_from || 'gen_from'}</label>
                          <DatePicker
                            selected={
                              this.state.order_perusal_material_start_date
                            }
                            onChange={date =>
                              this.setState({
                                order_perusal_material_start_date: moment(
                                  date._d
                                )
                              })
                            }
                            minDate={moment()}
                          />
                        </span>
                        <div className="spacer" />
                        <span className="horizontal-field">
                          <label>{words.gen_to || 'gen_to'}</label>
                          <DatePicker
                            selected={this.state.order_perusal_material_to_date}
                            onChange={date =>
                              this.setState({
                                order_perusal_material_to_date: moment(date._d)
                              })
                            }
                            minDate={moment()}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div className={`deliver-section ${!order_perusal_material_order_printed_material && 'disabled'}`}>
                <div className="row nested">
                  <p className="divider-midle">
                    <label className="control control--checkbox">
                      <span className="ov-divider">
                        {words['inst-cart_printed_material'] || 'inst-cart_printed_material'}
                      </span>
                      <input
                        type="checkbox"
                        checked={
                          this.state.order_perusal_material_order_printed_material
                        }
                        onChange={e =>
                          this.handleChange(
                            e,
                            'order_perusal_material_order_printed_material'
                          )
                        }
                      />
                      <div className="control__indicator" />
                    </label>
                  </p>
                </div>

                <div className={`row nested ${!order_perusal_material_order_printed_material && 'disabled-opacity'}`}>
                <div className="col-md-2 col-lg-2 col-xs-2 address-title">
                  {words['inst-cart_deliver_to'] || 'inst-cart_deliver_to'}:
                  <AddressesModal
                    disabled={!order_perusal_material_order_printed_material}
                    words={words}
                    addresses={addresses}
                    transferAddress={this.transferAddress}
                  />
                </div>
                <div
                  className={`address-box col-md-10 col-xs-9 col-xs-offset-1 col-md-offset-0 ${!order_perusal_material_order_printed_material && 'disabled'}`}
                >
                  <p>{this.state.order_perusal_material_order_printed_material ? selectedAddress.address_line_1 || address.address_line_1: 'Address I'}</p>
                  <p>{this.state.order_perusal_material_order_printed_material ? selectedAddress.city || address.city: 'City'},{' '}
                  {this.state.order_perusal_material_order_printed_material ? selectedAddress.zip || address.zip: 'PO Box'}</p>
                  <p>{this.state.order_perusal_material_order_printed_material ? selectedAddress.country || address.country: 'DE'}</p>
                </div>
              </div>
              <div class={`box dates-wrp ${!order_perusal_material_order_printed_material && 'disabled-opacity'}`}>
                  <div className="row">
                    <div class="col-xs">
                      <div class="box flex-center">
                        <span className="horizontal-field">
                          <label>{words.gen_from || 'gen_from'}</label>
                          <DatePicker
                            selected={
                              this.state.order_print_material_start_date
                            }
                            onChange={date =>
                              this.setState({
                                order_print_material_start_date: moment(
                                  date._d
                                )
                              })
                            }
                            minDate={moment()}
                            disabled={!order_perusal_material_order_printed_material}
                          />
                        </span>
                        <div className="spacer" />
                        <span className="horizontal-field">
                          <label>{words.gen_to || 'gen_to'}</label>
                          <DatePicker
                            selected={this.state.order_print_material_to_date}
                            onChange={date =>
                              this.setState({
                                order_print_material_to_date: moment(date._d).add(14, 'days')
                              })
                            }
                            minDate={moment()}
                            disabled={!order_perusal_material_order_printed_material}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="upper-section"> */}
            {/* <div className="row">
              <legend className="divider-midle divider-left">
                <label className="control control--checkbox">
                  <span className="ov-divider">
                    {words['inst-cart_performance_material'] || 'inst-cart_performance_material'}
                  </span>
                  <input
                    type="checkbox"
                    checked={this.state.order_performance_material}
                    onChange={e =>
                      this.handleChange(e, 'order_performance_material')
                    }
                  />
                  <div className="control__indicator" />
                </label>
              </legend>
            </div> */}

            {/* <div className="row border-table-generator">
              <Table
                columns={tableColumnsPerformance}
                columnsExtras={tableColumnExtrasPerformance}
                onHeaderItemClick={this.onTableHeaderItemClick}
              >
                {this.renderRow('play')}
              </Table>
            </div> */}

            {/* <div className="row center-xs">
              <div class="col-xs-12">
                <div class="box dates-wrp">
                  <div className="row">
                    <div class="col-xs">
                      <div class="box flex-center">
                        <span className="horizontal-field">
                          <label>{words.gen_from || 'gen_from'}</label>
                          <DatePicker
                            selected={
                              this.state.order_performance_material_start_date
                            }
                            onChange={date =>
                              this.setState({
                                order_performance_material_start_date: moment(
                                  date._d
                                )
                              })
                            }
                            minDate={moment()}
                          />
                        </span>
                        <div className="spacer" />
                        <span className="horizontal-field">
                          <label>{words.gen_to || 'gen_to'}</label>
                          <DatePicker
                            selected={
                              this.state.order_performance_material_to_date
                            }
                            onChange={date =>
                              this.setState({
                                order_performance_material_to_date: moment(
                                  date._d
                                )
                              })
                            }
                            minDate={moment()}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="deliver-section col-md-8 col-lg-8 col-md-offset-2">
              <div className="row nested">
                <p className="divider-midle">
                  <label className="control control--checkbox">
                    <span className="ov-divider">
                      {words['inst-cart_printed_material'] || 'inst-cart_printed_material'}
                    </span>
                    <input
                      type="checkbox"
                      checked={
                        this.state
                          .order_performance_material_order_printed_material
                      }
                      onChange={e =>
                        this.handleChange(
                          e,
                          'order_performance_material_order_printed_material'
                        )
                      }
                    />
                    <div className="control__indicator" />
                  </label>
                </p>
              </div>

              <div className="row nested">
                <div className="col-md-2 col-lg-2 col-xs-2 address-title">
                  {words['inst-cart_deliver_to'] || 'inst-cart_deliver_to'}:
                  <button className="btn black small">{words.gen_change}</button>
                </div>
                <div className="address-box col-md-10 col-xs-9 col-xs-offset-1 col-md-offset-0">
                  <p>Address I</p>
                  <p>City, PO Box</p>
                  <p>DE</p>
                </div>
              </div>
            </div> */}
            {/* </div> */}
            <div className="row center-xs">
              <div class="col-xs-5">
                <div class="box">
                  <button
                    onClick={this.onOrder}
                    className="btn-order btn black small"
                    disabled={cart.isLoading}
                  >
                    {words.gen_order || 'gen_order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InstitutionCart;

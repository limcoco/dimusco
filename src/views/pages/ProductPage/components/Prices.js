import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { addToInstitutionCart } from '../../../../redux/actionCreators';

import Price from './Price';
import Modal from '../../../component/Modal/Info';

class Prices extends Component {
  state = {}
  addToCart = type => () => {
    const {
      data,
      addToInstitutionCart,
      institutionCart,
      onAddSuccess,
      onAddFailed
    } = this.props;
    const newScore = {
      sid: data.sid
    };
    if (type === 'plays') newScore.ssid = data.ssid;

    const callbacks = {
      onSuccess: onAddSuccess,
      onFailed: onAddFailed
    };
    addToInstitutionCart(newScore, type, institutionCart, callbacks);
  };
  
  toggleModal = () => {
    this.setState((state) => { return { ...state, isActive: !state.isActive }})
  }

  render() {
    const {
      cartIsDisabled,
      institutionAuth,
      onBuy,
      changePrice,
      words,
      data,
      contract,
      isCopy
    } = this.props;

    const {isActive} = this.state;
    if (isCopy)
      return <div className='price-box' />;

    return institutionAuth ? (
      <React.Fragment>
        <div
          className={classnames('add-cart-box', {
            'cursor-not-allowed': cartIsDisabled
          })}
        >
          <a
            tabIndex="0"
            role="button"
            onClick={contract ? this.addToCart('scores') : this.toggleModal}
            className={classnames('add-to-cart', 'add-to-cart--small', {
              'link-not-active': cartIsDisabled
            })}
          >
            <span className="cart-icon" /> {words.gen_single_voice || 'gen_single_voice'}
          </a>
        </div>
        <div
          className={classnames('add-cart-box', {
            'cursor-not-allowed': cartIsDisabled
          })}
        >
          <a
            tabIndex="0"
            role="button"
            onClick={contract ? this.addToCart('plays') : this.toggleModal}
            className={classnames('add-to-cart', 'add-to-cart--small', {
              'link-not-active': cartIsDisabled
            })}
          >
            <span className="cart-icon" /> {words.gen_whole_set || 'gen_whole_set'}
          </a>
        </div>
        <Modal
            toggleModal={this.toggleModal}
            isActive={isActive}
            small
            headline={words.popup_no_price_big}
            info={words.popup_no_price_small}
        >
            <a onClick={this.toggleModal} className='close'>X</a>
        </Modal>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className="price-box bg-white">
          {data && data.prices && (
            <h3 className="price">
              <Price
                institutionAuth={institutionAuth}
                data={data}
                words={words}
                changePrice={changePrice}
              />
            </h3>
          )}
        </div>
        <div
          className={classnames('add-cart-box', {
            'cursor-not-allowed': cartIsDisabled
          })}
        >
          <a
            tabIndex="0"
            role="button"
            onClick={onBuy}
            className={classnames('add-to-cart', {
              'link-not-active': cartIsDisabled
            })}
          >
            <span className="cart-icon" /> {words.gen_add}
          </a>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  institutionCart: state.cart.institutionCart
});

const mapDispatchToProps = {
  addToInstitutionCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Prices);

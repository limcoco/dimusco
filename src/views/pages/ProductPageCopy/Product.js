import React from 'react'
import moment from 'moment'

import toUTC from '../../../utils/toUTC.js'
import Preview from '../ProductPage/components/preview'
import ProductInfo from '../ProductPage/components/Info'

import { InfoModal } from '../../component/Modal'

import Image from '../ProductPage/components/Image'

class Product extends React.Component {
  state = {
    activeTab: 1,
    isLoading: true,
    sid: this.props.match.params.sid,
    rowData: {},
    rowDataSimilar: [],
    count: 0,
    isLifeTime: false,
    queue: false,
    showConfirmationModal: false,
    priceChecked: false,
    havePrice: false,
  }

  toggleConfirmationModal = (infoMsg, headline) => {
    const { showConfirmationModal } = this.state
    if (typeof infoMsg !== 'object')
      this.setState({
        showConfirmationModal: !showConfirmationModal,
        infoMsg,
        headline,
      })
    else
      this.setState({
        showConfirmationModal: !showConfirmationModal,
        headline,
      })
  }

  setStateAsync = state => {
    return new Promise(resolve => {
      setTimeout(() => this.setState(state), 100)
    })
  }

  ReadDetailAsync = async () => {
    try {
      await this.setStateAsync({ queue: true })
    } catch (err) {}
  }

  // This function for queue image load
  imgLoadQueue = src => {
    if (this.state.queue) {
      return src
    }
  }

  convertToUTC = date => {
    let tmpDate = date
    return toUTC(tmpDate._d)
  }

  changePrice = e => {
    this.setState({
      isLifeTime: JSON.parse(e.target.value),
    })
  }

  onAddSuccess = () => {
    const { words } = this.props.ActiveLanguageReducer
    this.toggleConfirmationModal(
      words['popup_product-added_small'] || 'popup_product-added_small',
      words['popup_product-added_big'] || 'popup_product-added_big'
    )
  }

  onAddFailed = () => {
    const { words } = this.props.ActiveLanguageReducer
    this.toggleConfirmationModal(
      words['popup_product-add-fail_small'] || 'popup_product-add-fail_small',
      words['popup_product-add-fail_big'] || 'popup_product-add-fail_big'
    )
  }

  onBuy = () => {
    const {
      state: { isLifeTime },
      props: {
        addToCart,
        product,
        SessionReducer,
        EnsembleReducer,
        PublisherReducer,
        InstitutionReducer,
        cart,
        ActiveLanguageReducer: { words },
      },
    } = this
    let type = '',
      activeCart = []
    if (!this.checkPrice()) {
      this.toggleConfirmationModal(
        words.popup_no_price_small || 'popup_no_price_small',
        words.popup_no_price_big || 'popup_no_price_big'
      )
      return
    }

    if (PublisherReducer.is_auth) {
      activeCart = cart.publisherCart
      type = 'publisher'
    } else if (EnsembleReducer.is_auth) {
      activeCart = cart.ensembleCart
      type = 'ensemble'
    } else if (SessionReducer.is_auth) {
      activeCart = cart.userCart
      type = 'user'
    } else {
      this.toggleConfirmationModal(words['popup_login-required_small'] || 'popup_login-required_small')
      return
    }
  
    addToCart(
      type,
      {
        sid: product.sid,
        start: this.convertToUTC(moment().subtract(2, 'minute')),
        isLifeTime,
      },
      activeCart,
      {
        onSuccess: this.onAddSuccess,
        onFailed: this.onAddFailed,
      }
    )
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  load = (sid, id_curr) => {
    this.setState({
      sid,
    }, () => {
      this.props.changeActiveProduct(sid)
    });
  }

  onReadDetail = (sid, id_curr) => {
    this.props.getProduct('get-score-copy', { q: sid, cur: id_curr }, this.getToken(), this.getProductSuccess)
  }

  getProductSuccess = (data) => {
    const item = data.results.find((item) => {
      return item.sid === this.state.sid
    })
    if (item.prices && item.prices.otp.price) {
      if (Object.keys(item.prices.dr).length === 0 &&
      Object.keys(item.prices.otp).length > 0) 
      this.changePrice({ target: { value: true } });
    } else {
      this.changePrice({ target: { value: false }});
    }
  }

  getToken = () => {
    const { TokenReducer, InstitutionReducer, PublisherReducer, EnsembleReducer } = this.props

    let activeToken = TokenReducer.token

    if (EnsembleReducer.is_auth) activeToken = TokenReducer.tokenEnsemble
    else if (InstitutionReducer.is_auth) activeToken = TokenReducer.tokenInstitution
    else if (PublisherReducer.is_auth) activeToken = TokenReducer.tokenPublisher

    return activeToken
  }

  componentWillReceiveProps(nextProps) {
    const { product: oldProduct } = this.props
    const { product: newProduct } = nextProps
    if (this.props.ActiveCurrencyReducer.code !== nextProps.ActiveCurrencyReducer.code) {
      this.onReadDetail(this.state.sid, nextProps.ActiveCurrencyReducer.code)
    }
    if (oldProduct.sid && newProduct.sid && oldProduct.sid !== newProduct.sid) {
      this.getProductSuccess({ results: [{ ...newProduct }] });
    }
  }

  componentDidMount() {
    this.onReadDetail(this.state.sid, this.props.ActiveCurrencyReducer.code)
    window.scrollTo(0, 0)
  }

  renderMultipleImage = rowData => {
    let tmpImg = []
    if (typeof rowData !== 'undefined' && rowData.length > 0) {
      for (let i = 0; i < rowData.length; i++) {
        tmpImg.push(<img className="b-img" key={i} src={rowData.images[i]} alt="book preview" />)
      }
    }
    return tmpImg
  }

  disabledCart = () => {
    const { is_auth } = this.props.PublisherReducer
    const { product } = this.props

    if (is_auth) {
      return true
    }
    if (product && product.prices) return false
    return true
  }

  checkPrice = () => {
    const { product } = this.props
    if (product && product.prices) {
      const { dr, otp } = product.prices
      if (Object.keys(dr).length || Object.keys(otp).length) return true
    }
    return false
  }

  componentWillUnmount() {
    this.props.resetActiveProduct()
  }

  render() {
    const { infoMsg, showConfirmationModal, headline, sid } = this.state
    const {
      ActiveLanguageReducer: { words },
      previewMode,
      togglePreviewMode,
      InstitutionReducer,
      isLoading,
      product,
      similarProducts,
    } = this.props

    const cartIsDisabled = this.disabledCart()
    const havePrice = this.checkPrice()

    return (
      <React.Fragment>
        <InfoModal
          small
          headline={headline || words['popup_login-required_big'] || 'popup_login-required_big'}
          info={infoMsg}
          toggleModal={this.toggleConfirmationModal}
          isActive={showConfirmationModal}
          institutionAuth={InstitutionReducer.is_auth}
        />
        <div className="animated fadeIn">
          {typeof product !== 'undefined' && (
            <Preview
              togglePreviewMode={togglePreviewMode}
              previewMode={previewMode}
              data={product.preview}
              nop={product.nop}
              words={words}
              token={this.getToken()}
            />
          )}
          {product && Object.keys(product).length > 0 && (
            <section className="product-content animated fadeIn">
              <div className="container">
                <div className="row">
                  <Image
                    token={this.getToken()}
                    icon={product.icon}
                    isLoading={isLoading}
                    togglePreviewMode={togglePreviewMode}
                    sid={sid}
                    isCopy
                  />
                  <ProductInfo
                    institutionAuth={InstitutionReducer.is_auth}
                    data={product}
                    words={words}
                    cartIsDisabled={cartIsDisabled}
                    changePrice={this.changePrice}
                    onBuy={this.onBuy}
                    havePrice={havePrice}
                    onAddSuccess={this.onAddSuccess}
                    onAddFailed={this.onAddFailed}
                    isCopy
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default Product

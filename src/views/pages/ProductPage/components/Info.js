import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import ProductInfoFragment from './ProductInfoFragment';
import Prices from './Prices';

class Info extends Component {
  render() {
    const {
      words,
      cartIsDisabled,
      data,
      institutionAuth,
      changePrice,
      onBuy,
      havePrice,
      onAddSuccess,
      onAddFailed,
      contract,
      isCopy
    } = this.props;

    console.log({ havePrice, data });

    const bookInfo = getDataArr(words);
    
    return (
      <div className="col-md-8 col-xs-12">
        <div className="top-row">
          <div className="title-box">
            <div className="with-icon">
              {data && data.title && <h1>{data.title}</h1>}
            </div>
          </div>
          <ul className="autor-or-compositor">
            <ProductInfoFragment rowData={data} {...bookInfo[0]} />
          </ul>
          <ul className="other-info">
            {bookInfo.slice(1, bookInfo.length - 3).map(fragment => (
              <ProductInfoFragment
                key={fragment.name}
                rowData={data}
                {...fragment}
              />
            ))}
            <li>
              <label>{words.gen_instrument || 'gen_instrument'}: </label>
              <span>{data.instrument}</span>
            </li>
            <li>
              <label>{words.gen_duration || 'gen_duration'}: </label>
              <span>{moment.utc(data.duration * 1000).format('HH:mm:ss')}</span>
            </li>
            <ProductInfoFragment
              rowData={data}
              {...bookInfo[bookInfo.length - 3]}
            />
            <ProductInfoFragment
              rowData={data}
              {...bookInfo[bookInfo.length - 2]}
            />
          </ul>
          <div className="orchestration">
            <ProductInfoFragment
              rowData={data}
              {...bookInfo[bookInfo.length - 1]}
            />
          </div>
          <div className="product-main-info-bottom">
            <Prices
              data={data}
              words={words}
              onBuy={onBuy}
              changePrice={changePrice}
              institutionAuth={institutionAuth}
              cartIsDisabled={cartIsDisabled}
              onAddSuccess={onAddSuccess}
              onAddFailed={onAddFailed}
              contract={contract}
              isCopy={isCopy}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Info;

const getDataArr = words => [
  {
    name: words.gen_composer || 'gen_composer',
    params: 'composer',
    subParams: ['name']
  },
  {
    name: words.gen_category || 'gen_category',
    params: 'category'
  },
  {
    name: words.gen_librettist || 'gen_librettist',
    params: 'librettist'
  },
  {
    name: words.gen_edition || 'gen_edition',
    params: 'edition'
  },
  {
    name: words.gen_arrangement || 'gen_arrangement',
    params: 'arrangement'
  },
  {
    name: words.gen_textversion || 'gen_textversion',
    params: 'textversion'
  },
  {
    name: words.gen_translation || 'gen_translation',
    params: 'translation'
  },
  {
    name: words.gen_pages || 'gen_pages',
    params: 'nop'
  },
  {
    name: words.gen_publisher || 'gen_publisher',
    params: 'publisher'
  },
  {
    name: words.gen_orchestration || 'gen_orchestration',
    params: 'orchestration'
  }
];

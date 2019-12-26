import React from 'react';

import PaginationNumber from '../../../component/PaginationNumber';
import DropDown from './DropDown';

const sortOptions = words => [
  {
    value: 'relevance',
    label: words.gen_relevance || 'gen_relevance'
  },
  {
    value: 'title',
    label: words.gen_title || 'gen_title'
  },
  {
    value: 'composer',
    label: words.gen_composer || 'gen_composer'
  },
  {
    value: 'category',
    label: words.gen_category || 'gen_category'
  },
  {
    value: 'edition',
    label: words.gen_edition || 'gen_edition'
  },
  {
    value: 'instrument',
    label: words.gen_instrument || 'gen_instrument'
  }
];

const scoresPerPageOptions = [
  {
    value: '5',
    label: 5
  },
  {
    value: '10',
    label: 10
  },
  {
    value: '25',
    label: 25
  },
  {
    value: '50',
    label: 50
  },
  {
    value: '100',
    label: 100
  }
];

const Header = props => {
  const {
    words,
    count,
    currentPage,
    number_page,
    onPageClick,
    rpp,
    changeRPP
  } = props;

  return (
    <section className="catalog-nav">
      <div className="container">
        <div className="filters-catalog">
          <div className="catalog-page-title center-content">
            <h1>
              {words.gen_scores_found + ': '}
              <span>{count}</span>
            </h1>
          </div>
          <div className="zeuge-box center-content">
            <span>{words.gen_score_per_page}</span>
            <DropDown
              onChange={changeRPP}
              value={rpp}
              data={scoresPerPageOptions}
            />
          </div>
          <div className="zeuge-box center-content">
            <div className="page-numeration">
              <PaginationNumber
                current={currentPage}
                count={count}
                number_page={number_page}
                handle={onPageClick}
                page_range={2}
                marginDisplay={1}
                navNull={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;

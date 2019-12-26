import React from 'react';
import PaginationNumber from '../../../component/PaginationNumber.js';

const PaginationHeader = ({
    words,
    currentPage,
    number_result,
    number_page,
    rpp,
    changeRPP,
    handlePageClick,
    callScoresWithRPP,
    marginDisplay,
    page_range,
    navNull,
    removeScoresFound,
    rppStuck
}) => {
    return (
        <section className="catalog-nav">
            <div className='container-setprice'>
                <div className="filters-catalog">
                {!removeScoresFound ? <div className="catalog-page-title center-content">
                    <h1>
                    {words.gen_scores_found + ': '}
                    <span>{number_result}</span>
                    </h1>
                </div> : <span />}
                {!rppStuck &&
                <div className="zeuge-box center-content">
                    <span>{words.gen_score_per_page}</span>
                    <div className="select">
                        <input type='text' value={rpp} onChange={changeRPP} onBlur={callScoresWithRPP} />
                    </div>
                </div>
                }
                <div className="zeuge-box center-content">
                    {rppStuck &&
                    <div className="zeuge-box center-content">
                        <span>{words.gen_score_per_page}</span>
                        <div className="select">
                            <input type='text' value={rpp} onChange={changeRPP} onBlur={callScoresWithRPP} />
                        </div>
                    </div>
                    }
                    <div className="page-numeration">
                    <PaginationNumber
                        current={currentPage}
                        count={number_result}
                        number_page={number_page}
                        handle={handlePageClick}
                        page_range={page_range? page_range: 5}
                        marginDisplay={marginDisplay ? marginDisplay : 2}
                        navNull={navNull}
                    />
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}

export default PaginationHeader;
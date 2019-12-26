import React from "react"
import ReactPaginate from "react-paginate"
import PropTypes from "prop-types"

export default class PaginationNumber extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {current, count, number_page, handle, page_range, marginDisplay, navNull} = this.props
    if(count === null || count === 0) return null

    return (
      <div className="pagination-flexend">
        <ReactPaginate
          previousLabel         ={navNull ? '' : "Prev"}
          nextLabel             ={navNull ? '' : "Next"}
          breakLabel            ={"..."}
          breakClassName        ={"break-me"}
          pageCount             ={number_page}
          marginPagesDisplayed  ={marginDisplay ? marginDisplay :2}
          pageRangeDisplayed    ={page_range ? page_range : 5}
          onPageChange          ={handle}
          containerClassName    ={"pagination"}
          subContainerClassName ={"pages pagination"}
          activeClassName       ={"active"}
          forcePage             ={current - 1}
        />
      </div>
    )
  }
}

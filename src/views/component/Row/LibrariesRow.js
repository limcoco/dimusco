import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BookOrderer from '../BookOrderer.js'
import Score from '../Score.js'
import UsageFee from '../UsageFee.js'
import Composer from '../Composer.js'
import { Link } from 'react-router-dom'
import { RowItem } from './RowItem'
import PopoverExampleAnimation from './Popover'

class LibrariesRow extends Component {
  render() {
    const { score, composer, options, words } = this.props
    return (
      <li className="standart-container transition-all">
        <Link to={`/product/copy/${score.sid}`} target="_blank" className="no-margin row full-width">
          <div className={'col-content col-md-3 col-sm-3 col-xs-12'} style={{ textDecoration: 'none' }}>
            <Score {...score} words={words} />
          </div>
          <Composer {...composer} words={words} className={'col-content col-md-2 col-sm-2 col-xs-12'} designType={3} />
          <RowItem>{score.edition}</RowItem>
          <RowItem>{score.instrument}</RowItem>
          <div className="col-content col-md-1 col-sm-1 col-xs-12">{score.original ? 'yes' : 'no'}</div>
          <RowItem>{score.expire}</RowItem>
        </Link>
        <div className="dropdown member-menu">
          <PopoverExampleAnimation renderOptions={options} />
        </div>
      </li>
    )
  }
}

LibrariesRow.propTypes = {
  words: PropTypes.object.isRequired,

  index: PropTypes.number.isRequired,
  score: PropTypes.object.isRequired,
  composer: PropTypes.object.isRequired,
  usageFee: PropTypes.object.isRequired,
  orderer: PropTypes.object.isRequired,
  options: PropTypes.element.isRequired,
}
LibrariesRow.defaultProps = {}
export default LibrariesRow

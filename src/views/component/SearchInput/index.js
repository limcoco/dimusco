import React, { useState, Component } from 'react'
import PropTypes from 'prop-types'

class SearchInput extends Component {
  render() {
    const { words, searchQuery } = this.props
    return (
      <div className="search-input">
        <div className="search-box">
          <input
            type="text"
            placeholder={words.gen_search}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            className="search-text"
            value={searchQuery}
          />
          {searchQuery != '' && (
            <div className="delete-btn" onClick={this.onClear}>
              <span
                style={{
                  backgroundImage: 'url(/media/images/icon/delete.svg)',
                }}
                className="delete-icon"
              />
            </div>
          )}
        </div>
        <div className="search-btn">
          <button className="send-search" onClick={this.onSubmit}>
            {words.gen_find}
            <span
              style={{
                backgroundImage: "url('/media/images/search-icon.png')",
              }}
              className="search-icon"
            />
          </button>
        </div>
      </div>
    )
  }

  onChange = e => {
    this.props.onChange(e.target.value)
  }

  onSubmit = () => {
    this.props.onSubmit()
  }

  onClear = () => {
    this.props.onClear()
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      this.props.onSubmit()
    }
  }
}

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  words: PropTypes.object.isRequired,
}

export default SearchInput

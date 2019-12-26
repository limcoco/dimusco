import React, { Component } from 'react';
import PropTypes from "prop-types";

import './style.css';
import classnames from "classnames"
import DropDown from '../DropDown';

class DropDownDynamic extends Component {
  state = {
    open: false
  }

  componentDidMount() {
    const {closeMenu} = this;
    document.addEventListener('mousedown', this.handleClickOutside);
    const listener = window.addEventListener('blur', function() {
      if (document.getElementById('my-frame')) {
        closeMenu()
      }
      window.removeEventListener('blur', listener);
    });
  }

  componentWillUnmount() {
    const {closeMenu} = this;
    document.removeEventListener('mousedown', this.handleClickOutside);
    const listener = window.addEventListener('blur', function() {
      if (document.getElementById('my-frame')) {
        closeMenu()
      }
      window.removeEventListener('blur', listener);
    });
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }


  toggleMenu = () => {
    this.setState({
      open: !this.state.open
    });
  }

  closeMenu = () => {
    this.setState({
      open: false
    });
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.state.open)
      this.toggleMenu();
  }

  render() {
    return (
      <div className='dropdown-dynamic'
        ref={this.setWrapperRef}
      >
        <div className='triger'>
          {this.state.open ?
            <span
              className='close-circle-icon'
              onClick={this.toggleMenu}
            />
            :
            React.cloneElement(this.props.triger, {
              ...this.props.triger.props,
              className: classnames(this.props.triger.props.className, { 'active': this.state.open }),
              style: this.props.triger.props.style,
              onClick: this.toggleMenu
            })
          }
        </div>
        <div
        className={this.props.innerDropDown && 'dropdown-content'}
        style={ this.state.open && this.props.innerDropDown ? {display: 'block'  } : {}}
        >
          {
            this.state.open && React.cloneElement(this.props.children, {
              ...this.props.children.props,
              className: classnames(this.props.toRight ? 'right ' + this.props.children.props.className : !this.props.innerDropDown && this.props.children.props.className, { 'context-show': this.state.open }),
              style: { display: this.state.open ? 'block' : 'none' },
              onClick: this.props.closeOnSelect && this.toggleMenu,
            })
          }
          {this.state.open && this.props.innerDropDown && <DropDown {...this.props.innerDropDown} />}
        </div>
      </div >
    );
  }
}

DropDownDynamic.propTypes = {
  toRight: PropTypes.bool,
  // TODO: add propTypes to rest props
  // innerDropDown
  // closeOnSelect
}

export default DropDownDynamic;

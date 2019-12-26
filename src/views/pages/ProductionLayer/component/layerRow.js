import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Options from '../../../component/Option/Options.js'

const propTypes = {
  index: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  active: PropTypes.bool,
  loading: PropTypes.bool,

  onClick: PropTypes.func,
}

const defaultProps = {
  active: false,
  loading: false,

  onClick() {}
}

class LayerRow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      new_name     : props.data.name,
      mode         : null,
      newId        : props.newId
    }

    this.rename            = this.rename.bind(this)
    this.cancelUpdate      = this.cancelUpdate.bind(this)
    this.saveUpdate        = this.saveUpdate.bind(this)
  }

  rename() {
    this.setState({
      mode: 'update',
      newId: null,
      new_name: this.props.data.name === 'New Layer' ? this.props.newLayerLabel : this.props.data.name 
    })
  }

  saveUpdate(ev, lid) {
    ev.preventDefault()
    this.props.onUpdate(lid, this.state.new_name)
    this.setState({
      mode: null,
      newId: null,
    })
  }

  cancelUpdate() {
    this.setState({
      mode: null,
      newId: null,
      new_name: this.props.data.name
    })
  }

  renderLayerItem(data) {
    const {mode, new_name, newId} = this.state
    const {newLayerLabel} = this.props;
    if(mode === "update" || newId === data.lid) {
      return(
        <form onSubmit={(ev) => this.saveUpdate(ev, data.lid)}>
          <input
            type="text"
            value={new_name}
            onChange={(e) => this.setState({new_name: e.target.value})}
            onBlur={this.cancelUpdate}
            autoFocus
          />
        </form>
      )
    } else {
      return(<div role="button">{data.name === 'New Layer' ? newLayerLabel : data.name}</div>)
    }
  }


  render() {
    const {data, active, onClick} = this.props

    return (
      <li role="button" className={classnames('align-left member transition-all', {'member-active' : active })} onClick={(e)=>{this.props.onClick(this.props.index, this.props.data)}}>
        <div className="member-name" onDoubleClick={this.rename}>
          {this.renderLayerItem(data)}
        </div>
          <a
          role="button"
          className="red-i"
          onClick={()=>this.props.onDelete(data.lid)}
          style={{
            marginLeft: 'auto',
            display: 'inline-block',
            width: '15px',
            height: '15px',
            marginRight: '10px'
          }}
          >
            <img src="/media/images/remove.png" width="15" height="15" />
          </a>
      </li>
    );
  }
}

LayerRow.propTypes = propTypes
LayerRow.defaultProps = defaultProps
export default LayerRow

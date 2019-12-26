import React, { Component } from 'react'
import Request from '../../../utils/Request.js'

import ListView from '../../component/Listview/List.js'
import Options from '../../component/Option/Options.js'
import ScoreRow from '../../component/Row/PurchasedScoreRow.js'
import LayerRow from './component/layerRow.js'
import RightContent from "./component/RightContent";
// Redux
import auth from '../../../redux/account/authToken.js'

import './style.css';

class Layer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      itemsLayer: [],

      groups: [],
      unregisteredGroups: [],

      members: [],
      unregisteredMembers: [],

      loadingRegistered: false,
      loadingUnregistered: false,

      showAddGroup: false,
      showAddMember: false,
      activeScoreIndex: -1,
      activeLayerIndex: -1,

      upload_toggle: true,
      loading_proccess: {
        type: null,
        index: -1
      }
    }

    this.token = auth.getActiveToken()
    this.newId = null
  }

  componentDidMount() {
    this.onReadPurchased("", "")
  }

  gotoSetPrice = () => {
    this.props.history.push('/pub-prices')
  }

  gotoSetDiscount = () => {
    this.props.history.push('/pub-discount')
  }

  gotoPubLibrary = () => {
    this.props.history.push('/pub-library')
  }

  // Layer Function

  onRegisterLayer = () => {
    const { activeScoreIndex, items } = this.state
    if (items.length === 0) {
      alert("Please select score first.")
      return
    }

    let payload = {
      aid: items[activeScoreIndex].aid,
      name: "New Layer"
    }

    Request(
      "post",
      "register-layer",
      { Authorization: "Token " + this.token },
      payload,
      [],
      this.onRegisterLayerSuccess,
      this.onRegisterLayerFailed,
      items[activeScoreIndex].aid,
    )
  }

  onRegisterLayerSuccess = (response, extra) => {
    this.newId = response.data.lid
    this.onReadLayer(extra)
  }

  onRegisterLayerFailed = (error) => {
  }

  onReadLayer = (purchase_id) => {
    let new_aid

    if (purchase_id === null || purchase_id === undefined) {
      const { activeScoreIndex, items } = this.state
      new_aid = items[activeScoreIndex].aid
    } else {
      new_aid = purchase_id
    }

    Request(
      "get",
      "read-layer",
      { Authorization: "Token " + this.token },
      { aid: new_aid },
      [],
      this.onReadLayerSuccess,
      this.onReadLayerFailed
    )
  }

  onReadLayerSuccess = (response) => {
    this.setState({
      itemsLayer: this.sortData(response.data.results)
    })
    this.onReadAssignment()
  }

  onReadLayerFailed = (error) => {

  }

  onUpdateLayer = (lid, new_name) => {
    let payload = {
      lid: lid,
      name: new_name
    }

    Request(
      "patch",
      "update-layer",
      { Authorization: "Token " + this.token },
      payload,
      [],
      this.onUpdateLayerSuccess,
      this.onUpdateLayerFailed,
      undefined,
      { lid: lid }
    )
  }

  onUpdateLayerSuccess = (response) => {
    this.onReadLayer()
  }

  onUpdateLayerFailed = (error) => {
  }

  onDeleteLayer = (layer_id) => {
    Request(
      "delete",
      "delete-layer",
      { Authorization: "Token " + this.token },
      { lid: layer_id },
      [],
      this.onDeleteLayerSuccess,
      this.onDeleteLayerFailed,
      undefined,
      { lid: layer_id }
    )
  }

  onDeleteLayerSuccess = (response) => {
    this.setState({
      groups: [],
      members: [],
      unregisteredGroups: [],
      unregisteredMembers: [],
    })
    this.onReadLayer()
  }

  onDeleteLayerFailed = (error) => {
  }

  // ENd Layer Function

  toggle = (key, value) => {
    let nextVal = this.state[key]

    if (nextVal === undefined) {
      return
    }

    if (typeof nextVal !== "boolean") {
      return
    }

    if (value === undefined) {
      nextVal = !nextVal
    }

    if (typeof value !== "boolean") {
      return
    } else {
      nextVal = value
    }

    let incomingState = {}
    incomingState[key] = nextVal
    this.setState(incomingState)
  }

  onRequestFailed = (error) => {
    this.setState({
      loading_proccess: {
        type: null,
        index: -1
      }
    })
  }

  onReadPurchased = (search, order) => {
    Request(
      "get",
      "library-read",
      { Authorization: "Token " + this.token },
      { ordering: order, search: search },
      [],
      this.onReadPurchasedSuccess,
      this.onRequestFailed
    )
  }

  onReadPurchasedSuccess = (response) => {
    if (response.data.length > 0) {
      response.data.sort(function (a, b) {
        return 0 //default return value (no sorting)
      });
    }

    this.setState({
      items: response.data.results || [],
    })
    if (response.data.length > 0) {
      this.handleScoreClick(undefined, response.data)
    }
  }

  onReadPurchasedFailed = (error) => {
  }

  // Asyn
  resolveAfter2Seconds = () => {
    return new Promise(resolve => {
      setTimeout(this.onReadAssignment, 3000)
    });
  }

  async asyncCall() {
    await this.resolveAfter2Seconds()
  }
  // END Asyn

  onReadAssignment = (data, search, order) => {
    const { activeLayerIndex, itemsLayer } = this.state

    let layer_id = null

    if (data === null || data === undefined || data === "") {
      layer_id = itemsLayer[activeLayerIndex].lid
    } else {
      layer_id = data.lid
    }

    Request(
      "get",
      "layer-read-assignment",
      { Authorization: "Token " + this.token },
      { ordering: order, search: search },
      [layer_id],
      this.onReadAssignmentSuccess,
      this.onRequestFailed
    )
  }

  onReadAssignmentSuccess = (response) => {
    const { loading_proccess, groups, unregisteredGroups, members, unregisteredMembers } = this.state

    if (loading_proccess.type === "group_assign") {
      if (groups.length === response.data.assigned.groups.length) {
        this.onReadAssignment()
      }

    } else if (loading_proccess.type === "group_unassign") {
      if (unregisteredGroups.length === response.data.unassigned.groups.length) {
        this.onReadAssignment()
      }

    } else if (loading_proccess.type === "member_assign") {
      if (members.length === response.data.assigned.users.length) {
        this.onReadAssignment()
      }

    } else if (loading_proccess.type === "member_unassign") {
      if (unregisteredMembers.length === response.data.unassigned.users.length) {
        this.onReadAssignment()
      }
    }

    this.setState({
      groups: this.sortData(response.data.assigned.groups),
      members: this.sortData(response.data.assigned.users),
      unregisteredGroups: this.sortData(response.data.unassigned.groups),
      unregisteredMembers: this.sortData(response.data.unassigned.users),
      loading_proccess: {
        type: null,
        index: -1
      }
    })
  }

  sortData = (data) => {
    if (data.length > 0) {
      data.sort(function (a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();

        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      });
    }
    return data
  }

  onAssign = (index, data) => {
    const { activeLayerIndex, itemsLayer } = this.state

    if (data.type === "group") {
      this.setState({
        loading_proccess: {
          type: "group_assign",
          index: index
        }
      })
    } else {
      this.setState({
        loading_proccess: {
          type: "member_assign",
          index: index
        }
      })
    }

    let payload = {
      lid: itemsLayer[activeLayerIndex].lid,
      assign_to: data.id
    }

    Request(
      "post",
      "layer-assign",
      { Authorization: "Token " + this.token },
      payload,
      [],
      this.onAssignSuccess,
      this.onRequestFailed,
      { requested: data, index: index }
    )
  }

  onAssignSuccess = (response, extra) => {
    this.asyncCall()
  }

  onUnassign = (index, data) => {
    const { activeLayerIndex, groups, itemsLayer } = this.state
    let url, id = null

    if (data.type === "group") {
      url = "layer-unassign-group"
      id = groups[index].ldid
      data['ldid'] = id
      this.setState({
        loading_proccess: {
          type: "group_unassign",
          index: index
        }
      })
    } else {
      url = "layer-unassign-master"
      id = itemsLayer[activeLayerIndex].lid
      this.setState({
        loading_proccess: {
          type: "member_unassign",
          index: index
        }
      })
    }

    Request(
      "delete",
      url,
      { Authorization: "Token " + this.token },
      {},
      [id],
      this.onUnassignSuccess,
      this.onRequestFailed,
      { requested: data, index: index }
    )
  }

  onUnassignSuccess = (response, extra) => {
    this.asyncCall()
  }

  onAssignError = (error) => {
  }

  handleScoreClick = (index, extra) => {
    let data = null
    if (index === undefined) {
      index = 0
      data = extra[index]
    } else {
      const { items } = this.state
      data = items[index]
    }

    const { activeScoreIndex } = this.state
    if (index !== activeScoreIndex) {

      this.onReadLayer(data.aid)

      this.newId = null
      // this.props.RunRedux(SET_INDEX(0))

      this.setState({
        activeScoreIndex: index,
        activeLayerIndex: 0,
      })
    }
  }

  handleLayerClick = (index, extra) => {
    let data = null

    if (index === undefined) {
      index = 0
      data = extra[index]
    } else {
      const { itemsLayer } = this.state
      data = itemsLayer[index]
    }

    const { activeLayerIndex } = this.state
    this.onReadAssignment(data)
    if (index !== activeLayerIndex) {
      this.setState({
        activeLayerIndex: index,
      })
    }
  }

  generateRow = (row, layer = false) => {
    var element = row.map((val, index) => {
      if (layer) {
        return (
          <LayerRow
            key={index}
            index={index}
            data={val}
            onDelete={this.onDeleteLayer}
            onUpdate={this.onUpdateLayer}
            active={this.state.activeLayerIndex === index}
            onClick={this.handleLayerClick}
            newId={this.newId}
          />
        )
      } else {
        return (
          <ScoreRow
            key={index}
            index={index}
            data={val}
            active={this.state.activeScoreIndex === index}
            onClick={this.handleScoreClick}
            words={this.props.ActiveLanguageReducer.words}
          />
        )
      }
    })
    return element
  }

  renderRow = () => {
    const { items } = this.state
    if (items.length >= 0) {
      return this.generateRow(items)
    }
  }

  renderRowLayer = () => {
    const { itemsLayer } = this.state
    if (itemsLayer.length >= 0) {
      return this.generateRow(itemsLayer, true)
    }
  }

  render() {
    const {
      groups,
      unregisteredGroups,
      members,
      unregisteredMembers,
      activeScoreIndex,
      loading_proccess
    } = this.state

    const { words } = this.props.ActiveLanguageReducer

   
    return (
      <section className="product-content no-border-bottom">
        <div className="container">
          {/* TITLE */}
          <div className="musinote-center institution-name-header">
            <h3 className="no-margin full-width">
              <small>{words.layer_title}</small>
            </h3>
          </div>
          {/* END TITLE */}
          
          {/* CONTENT */}
          <div className='row layer-content'>
              <ListView
                title={words.library_scores}
                emptyMessage={words.library_score_empty}
                className="col-md-3 col-sm-12 col-xs-12 no-margin no-padding"
              >
                {this.renderRow()}
              </ListView>

              <ListView
                title={words.layer_title}
                emptyMessage={words.layer_not_found}
                className="col-md-3 col-sm-12 col-xs-12 no-margin no-padding border-left have-option"
                options={<Options
                  items={[{ text: 'Add New', onClick: this.onRegisterLayer, className: "text-center" }]}
                  iconClassName={"sm-icon"} />
                }
              >
                {this.renderRowLayer()}
              </ListView>

              {/* RIGHT COLUMN*/}
              <RightContent
                groups={groups}
                unregisteredGroups={unregisteredGroups}
                members={members}
                unregisteredMembers={unregisteredMembers}
                words={words}
                activeScoreIndex={activeScoreIndex}
                onUnassign={this.onUnassign}
                onAssign={this.onAssign}
                loading_proccess={loading_proccess}
              />
              {/* END RIGHT COLUMN*/}
            </div>
        </div>

        {/*<Uplaod
        toggle = {this.state.toggle_upload}
        toggleAction = {this.toggleUplaod}
      />*/}
      </section>
    );
  }
}

export default Layer;
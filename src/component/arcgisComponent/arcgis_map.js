import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initArcgisMap } from '../../redux/arcgisReducer/arcgis_map_redux'
import './arcgis_map.css'

@connect(
  state => ({
    arcgisMapReducer: state.arcgisMapReducer
  }), {
  initArcgisMap
}
)
class ArcgisMap extends Component {
  componentDidMount() {
    this.props.initArcgisMap('arcgis-map')
  }
  render() {
    return (
      <div id='arcgis-map'>

      </div>
    )
  }
}
export default ArcgisMap
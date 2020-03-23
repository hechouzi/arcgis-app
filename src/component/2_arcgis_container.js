import React, { Component } from 'react'
import ArcgisMap from './arcgisComponent/arcgis_map'
export default class ArcgisContainer extends Component {
  render() {
    return (
      <div>
        <ArcgisMap></ArcgisMap>
      </div>
    )
  }
}

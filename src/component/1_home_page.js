import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'


class HomePage extends Component {
  render() {
    const { url } = this.props.match
    return (
      <div>
        <nav>
          <Link to={`${url}arcgis`}>arcgis地图</Link>
        </nav>
      </div>
    )
  }
}
export default withRouter(HomePage)

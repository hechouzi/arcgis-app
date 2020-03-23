import React, { lazy, Suspense, Component } from 'react'
import { Switch, Route } from 'react-router-dom'
const LazyHomePage = lazy(() => import('./../component/1_home_page'))
const LazyArcgisContainer = lazy(() => import('./../component/2_arcgis_container'))

export default class IndexRoute extends Component {
  render() {
    return (
      <Suspense fallback={<div>Loading</div>}>
        <Switch>
          <Route exact component={LazyHomePage}
            path="/"
          />
          <Route component={LazyArcgisContainer}
            path="/arcgis"
          />
        </Switch>
      </Suspense>

    )
  }
}

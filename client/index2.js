import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import TodayKeywords from './modules/TodayKeywords'
import SubKeywords from './modules/SubKeywords'
import Articles from './modules/Articles'
import Home from './modules/Home'
import './index.css'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={TodayKeywords}/>
      <Route path="/about" component={About}/>
      <Route path="/" component={TodayKeywords}>
        <Route path="/:todayKeyword" component={SubKeywords}>
          <Route path="/:todayKeyword/:subKeyword" component={Articles}></Route>
        </Route>
      </Route>
    </Route>
  </Router>
), document.getElementById('app'))

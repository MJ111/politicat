import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/About'
import TodayKeywords from './modules/TodayKeywords'
import SubKeywords from './modules/SubKeywords'
import Articles from './modules/Articles'
import Home from './modules/Home'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/news" component={TodayKeywords}>
        <Route path="/news/:todayKeyword" component={SubKeywords}>
          <Route path="/news/:todayKeyword/:subKeyword" component={Articles}></Route>
        </Route>
      </Route>
      <Route path="/about" component={About}/>
    </Route>
  </Router>
), document.getElementById('app'))

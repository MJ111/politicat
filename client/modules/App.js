import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
  render() {
    return (
      <header className="app-header">
        <h1 className="app-name">Politicat</h1>
        <ul className="app-nav" role="nav">
          <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/news">News</NavLink></li>
        </ul>
        {this.props.children}
      </header>
    )
  }
})

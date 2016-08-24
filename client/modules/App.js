import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  handleSubmit(event) {
    event.preventDefault()
    const keyword = event.target.elements[0].value
    const path = `/search/${keyword}`
    this.context.router.push({ pathname: path })
  },

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <NavLink to="/" onlyActiveOnIndex>
            <h1 className="app-name">POLITICAT</h1>
          </NavLink>
          <div className="search">
            <form onSubmit={this.handleSubmit}>
              <input type="text" placeholder="키워드 검색"
                className="search-query"/>
            </form>
          </div>
          <ul className="app-nav" role="nav">
            <li><NavLink to="/about">
                <span className="nav-name">About</span>
            </NavLink></li>
          </ul>
        </header>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    )
  }
})

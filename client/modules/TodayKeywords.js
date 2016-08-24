import React from 'react'
import NavLink from './NavLink'
import axios from 'axios'

export default React.createClass({
  getInitialState() {
    return {data: []}
  },

  componentDidMount() {
    axios.get('/news/api/today')
      .then(function (resp) {
        this.setState({data: resp.data.slice(0,10)})
      }.bind(this));
  },

  render() {
    const todayKeywords = this.state.data.map((val, i) => {
      return (
        <li className="today-term-item" key={i}>
          <NavLink className="today-term" to={`/${val[0]}`} key={i}>
            <span className="today-term-name" key={i}>{val[0]}</span>
          </NavLink>
        </li>
      );
    });
    return (
      <section className="today-keywords">
        <h2 className="today-title">Trending</h2>
        <ul>
          <div className="today-terms">
            {todayKeywords}
          </div>
        </ul>
        {this.props.children}
      </section>
    )
  }
})

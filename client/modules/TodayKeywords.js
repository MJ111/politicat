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

  contextTypes: {
    router: React.PropTypes.object
  },

  handleSubmit(event) {
    event.preventDefault()
    const keyword = event.target.elements[0].value
    const path = `/news/${keyword}/ `
    this.context.router.push(path)
  },

  render() {
    const todayKeywords = this.state.data.map((val, i) => {
      return (
        <li className="today-term-item" key={i}>
          <NavLink className="today-term" to={`/news/${val[0]}`} key={i}>
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
          <li>
            <form onSubmit={this.handleSubmit}>
              <input type="text" placeholder="keyword"/>
              <button type="submit">Go</button>
            </form>
          </li>
        </ul>
        {this.props.children}
      </section>
    )
  }
})

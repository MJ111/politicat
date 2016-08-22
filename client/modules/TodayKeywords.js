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
    const userName = event.target.elements[0].value
    const repo = event.target.elements[1].value
    const path = `/repos/${userName}/${repo}`
    console.log(path)
    this.context.router.push(path)
  },

  render() {
    const todayKeywords = this.state.data.map((val, i) => {
      return (
        <li key={i}><NavLink to={`/news/${val[0]}`} key={i}>{`${i+1}. ${val[0]}`}</NavLink></li>
      );
    });
    return (
      <div>
        <h2>Trending</h2>
        <ul>
          <div class="today">
            {todayKeywords}
          </div>
          <li>
            <form onSubmit={this.handleSubmit}>
              <input type="text" placeholder="userName"/> / {' '}
              <input type="text" placeholder="repo"/>{' '}
              <button type="submit">Go</button>
            </form>
          </li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

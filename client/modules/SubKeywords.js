import React from 'react'
import NavLink from './NavLink'
import axios from 'axios'

export default React.createClass({
  getInitialState() {
    return {data: []}
  },

  componentDidMount() {
    axios.post('/news/api/sub', {
      data: this.props.params.todayKeyword
    })
    .then(function (resp) {
      console.log('resp: ', resp);
      this.setState({data: resp.data.slice(0,10)})
    }.bind(this));
  },

  render() {
    const subKeyword = this.state.data.map((val, i) => {
      return (
        <li key={i}><NavLink to={`/news/${this.props.params.todayKeyword}/${val.word}`} key={i}>{`${i+1}. ${val.word}`}</NavLink></li>
      );
    });

    return (
      <div>
        <h2>{this.props.params.todayKeyword}</h2>
        <ul>
          <div class="sub">
            {subKeyword}
          </div>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

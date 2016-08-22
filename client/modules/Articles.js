import React from 'react'
import NavLink from './NavLink'
import axios from 'axios'

export default React.createClass({
  getInitialState() {
    return {data: []}
  },

  componentDidMount() {
    axios.post('/news/api/article', {
      data: this.props.params.subKeyword
    })
    .then(function (resp) {
      console.log('resp: ', resp);
      this.setState({data: resp.data.slice(0,10)})
    }.bind(this));
  },

  render() {
    const articles = this.state.data.map((val, i) => {
      return (
        <li key={i}><a href={val[0].url} key={i}>{`${i+1}. ${val[0].title}`}</a></li>
      );
    });

    return (
      <div>
        <h2>{this.props.params.subKeyword}</h2>
        <div class="articles">
          {articles}
        </div>
      </div>
    )
  }
})

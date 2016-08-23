import React from 'react'
import NavLink from './NavLink'
import axios from 'axios'

export default React.createClass({
  getInitialState() {
    return {data: []}
  },

  getData(props) {
    axios.post('/news/api/article', {
      main: props.params.todayKeyword,
      sub: props.params.subKeyword
    })
    .then(function (resp) {
      console.log('resp: ', resp);
      this.setState({data: resp.data.slice(0,10)})
    }.bind(this));
  },

  componentDidMount() {
    this.getData(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps);
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

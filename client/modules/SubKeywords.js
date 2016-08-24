import React from 'react'
import NavLink from './NavLink'
import axios from 'axios'
import { createHistory, useQueries } from 'history'

const history = useQueries(createHistory)()

export default React.createClass({
  getInitialState() {
    return {data: [], searchPath: ''}
  },

  getData(props) {
    const options = {
      data: props.params.query
    };

    if (document.location.pathname.includes('search')) {
      options.range = 'all'
      this.setState({searchPath:'/search'})
    } else {
      this.setState({searchPath:''})
    }

    axios.post('/news/api/sub', options)
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
    const subKeyword = this.state.data.map((val, i) => {
      return (
        <li className="sub-term-item" key={i}>
          <NavLink className="sub-term" to={`${this.state.searchPath}/${this.props.params.query}/${val.word}`} key={i}>
            <span className="sub-term-name">
              {val.word}
            </span>
          </NavLink>
        </li>
      );
    });

    return (
      <section className="sub-keywords">
        <h2 className="sub-title">
          {this.props.params.query}
        </h2>
        <ul>
          <div className="sub-terms">
            {subKeyword}
          </div>
        </ul>
        {this.props.children}
      </section>
    )
  }
})

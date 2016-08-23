import React from 'react'
import NavLink from './NavLink'
import axios from 'axios'

export default React.createClass({
  getInitialState() {
    return {data: []}
  },

  getData(props) {
    axios.post('/news/api/sub', {
      data: props.params.todayKeyword
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
    const subKeyword = this.state.data.map((val, i) => {
      return (
        <li className="sub-term-item" key={i}>
          <NavLink className="sub-term" to={`/news/${this.props.params.todayKeyword}/${val.word}`} key={i}>
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
          {this.props.params.todayKeyword}
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

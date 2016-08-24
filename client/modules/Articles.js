import React from 'react'
import NavLink from './NavLink'
import axios from 'axios'

export default React.createClass({
  getInitialState() {
    return {data: [], posts: []}
  },

  getData(props) {
    const options = {
      main: props.params.query,
      sub: props.params.subKeyword
    };

    if (document.location.pathname.includes('search')) {
      options.range = 'all'
    }

    axios.post('/news/api/article', options)
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
        <article className="post-item" key={i}>
          <header className="post-header" key={i}>
            <a className="post-link" href={val[0].url} key={i}>
              {val[0].title}
            </a>
          </header>
          <section className="post-content" key={i+1}>
            {this.state.posts[i]}
          </section>
        </article>
      );
    });

    return (
      <section className="articles-section">
        <h2 className="articles-title">
          {this.props.params.subKeyword}
        </h2>
        <div className="posts">
          {articles}
        </div>
      </section>
    )
  }
})

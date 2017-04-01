import React from 'react';
import Article from './Article';


export default class Articles extends React.Component {

  render() {
    return (
      <div className="articles">
        <div className="top-title">文章</div>
        <ul>
          <Article />
          <Article />
          <Article />
          <Article />
          <Article />
        </ul>
      </div>
    );
  }
}

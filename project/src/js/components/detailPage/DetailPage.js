import React from 'react';
import _ from 'lodash';
import when from 'when';
import Helmet from 'react-helmet';
import Author from './Author';
import Content from './Content';

export default class LandingPage extends React.Component {

  static fetchApiData(host, params, query) {
    const detailPageData = {
      test: 'test'
    };
    return Promise.resolve(detailPageData);
  }

  render() {
    return (
      <div className="detail-page">
        <h1 className="title">你是什么时候学会向知识付费的？</h1>
        <Author />
        <Content />
        <div className="copyright">© 著作权归作者所有</div>
      </div>
    );
  }
}

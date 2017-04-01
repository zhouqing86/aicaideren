import React from 'react';
import _ from 'lodash';
import when from 'when';
import Helmet from 'react-helmet';
import Indexer from './Indexer';
import Articles from './Articles';

export default class LandingPage extends React.Component {

  static fetchApiData(host, params, query) {
    const landingPageData = {
      test: 'test'
    };
    return Promise.resolve(landingPageData);
  }

  render() {
    return (
      <div className="landing-page">
        <Indexer />
        <Articles />
      </div>
    );
  }
}

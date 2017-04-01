import React from 'react';
import expressUseragent from 'express-useragent';
import _ from 'lodash';
import Header from './common/Header';
import Footer from './common/Footer';

let isFirstCall = true;

export default class App extends React.Component {
  renderContent() {
    return React.cloneElement(this.props.children, {...this.props, ref: "content"});
  }

  componentDidUpdate() {
    window.DATA = window.DATA || {};
  }

  render() {
    return (
      <div className="app">
        <Header />
        {this.renderContent()}
        <Footer />
      </div>
    );
  }
}

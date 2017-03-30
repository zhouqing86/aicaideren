import React from 'react';
import expressUseragent from 'express-useragent';
import _ from 'lodash';

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
        This is Header
        {this.renderContent()}
        This is footer
      </div>
    );
  }
}

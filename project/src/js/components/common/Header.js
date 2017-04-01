import React from 'react';


export default class Header extends React.Component {

  render() {
    return (
      <a className="top" href="#">
        <div className="logo">
          <img src="/assets/img/aicaideren.jpg"/>
        </div>
        <div className="slogan">
          <div className="slogan-title">每天学一点理财知识</div>
        </div>
      </a>
    );
  }

}

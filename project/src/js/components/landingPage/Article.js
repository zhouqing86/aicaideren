import React from 'react';
import Author from './Author';


export default class Article extends React.Component {

  render() {
    return (
      <li className="have-img">
        <a href="/p/8fbeec7069bd" className="wrap-img">
          <img src="//upload-images.jianshu.io/upload_images/1414374-59f7587f698da23a.jpeg?imageMogr2/auto-orient/strip|imageView2/1/w/246/h/246" />
        </a>
        <div className="content">
          <a href="/a/caiwuziyou">
            <Author />
            <div className="title">30岁前的财务自由</div>
          </a>
        </div>
      </li>
    );
  }
}

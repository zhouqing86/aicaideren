import React from 'react';


export default class Author extends React.Component {

  render() {
    return (
      <div className="author">
        <a href="/u/5fd3fb391c23" className="avatar">
          <img src="//upload.jianshu.io/users/upload_avatars/1414374/7d76ee4352ff.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/44/h/44" />
        </a>
        <div className="name">
          <a href="/u/5fd3fb391c23">
            孟可可Coco
          </a>
        </div>
        <span className="time">昨天 18:14</span>
      </div>
    );
  }

}

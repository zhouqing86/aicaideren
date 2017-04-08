import React from 'react';

export default class Author extends React.Component {

  render() {
    return (
      <div className="author-info">
        <a className="avatar" href="/u/1939c693d394">
          <img src="//upload.jianshu.io/users/upload_avatars/4460877/57f71932a688.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/180/h/180" alt="180" />
          <div className="name">微光隐隐</div>
        </a>
        <span className="label">作者</span>

        <div className="meta">
          <span>2017.04.06 17:58</span>
        </div>
    </div>
    );
  }

}

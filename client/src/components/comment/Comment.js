// Comment.js
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Comment = props => (
  <div className="singleComment">
    <img alt="user_image" className="userImage" src={`https://picsum.photos/70?random=${props.id}`} />
    <div className="textContent">
      <div className="singleCommentContent">
        <div className="singleCommentButtons">
          <h3>{props.author}</h3>
          <span className="time">{moment(props.timestamp).fromNow()}</span>
          <a onClick={() => { props.handleUpdateComment(props.id); }}>update</a>
          <a onClick={() => { props.handleDeleteComment(props.id); }}>delete</a>
        </div>
        <ReactMarkdown source={props.children} />
        <div className="reply-wrapper">
          <img src="/src/public/img/hand-like.svg"/>&nbsp;&nbsp;&nbsp;
          <img src="/src/public/img/hand-dislike.svg"/>&nbsp;&nbsp;&nbsp;
          REPLY
        </div>
      </div>
    </div>
  </div>
);

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default Comment;

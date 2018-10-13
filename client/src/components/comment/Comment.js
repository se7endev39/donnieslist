// Comment.js
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import CommentReply from './CommentReply'

const Comment = props => (
  <div className="singleComment">
    {
      props.type === 'comment' ? (
        <img className="comment-user" src={ `https://picsum.photos/70?random=${props.id}` } />
      ) : (
        <img className="reply-user" src={ `https://picsum.photos/70?random=${props.id}` } />
      )
    }
    <div className="textContent">
      <div className="singleCommentContent">
        <div className="singleCommentButtons">
          <h3>{ props.author }</h3>
          <span className="time">{ moment(props.timestamp).fromNow() }</span>
          {/* <a onClick={ () => { props.handleUpdateComment(props.id); } }>update</a> */}
          <a onClick={ () => { props.handleDeleteComment(props.id); } }>delete</a>
        </div>
        <ReactMarkdown source={ props.children } />
        <div className="reply-wrapper">
          <div className="number">
            <img src="/src/public/img/hand-like.svg" onClick={ () => props.handleLike(props.id, props.num_like) }/>
            { props.num_like ? props.num_like : '' }
          </div>
          <div className="number">
            <img src="/src/public/img/hand-dislike.svg" onClick={ () => props.handleDislike(props.id, props.num_dislike) }/>
            { props.num_dislike ? props.num_dislike : '' }
          </div>
          <a onClick={ () => { props.handleReply(props.id, true) } }> REPLY </a>
        </div>
        <div className="form">
        {
          props.showReplyForm ? (
            <CommentReply
              id={ props.id }
              commentId = { props.commentId }
              handleChangeText={ props.handleChangeText }
              handleReply={ props.handleReply }
              handleLike={ props.handleLike }
              handleDislike={ props.handleDislike }
              submitReply={ props.submitReply }
            />
          ) : null
        }
        </div>
      </div>
    </div>
  </div>
)

Comment.propTypes = {
  id: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  num_like: PropTypes.number,
  num_dislike: PropTypes.number,
  children: PropTypes.string.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  handleReply: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDislike: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
}

export default Comment;

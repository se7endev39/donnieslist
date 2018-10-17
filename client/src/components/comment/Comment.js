// Comment.js
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import CommentForm from './CommentForm'

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
    {
      props.updateId == props.id ? (
        <div className="singleCommentContent">
          <div className="form">
            <CommentForm
              id = { props.id }
              text = { props.text }
              updateId = { props.updateId }
              parentId = { props.parentId }
              commentId = { props.commentId }
              handleChangeText = { props.handleChangeText }
              handleSetComment = { props.handleUpdateComment }
              submitComment = { props.submitComment }
            />
          </div>
        </div>
      ) : (
        <div className="singleCommentContent">
          <div className="singleCommentButtons">
            <h3>{ props.author }</h3>
            <span className="time">{ moment(props.timestamp).fromNow() }</span>
            <a onClick={ (e) => { props.handleUpdateComment(e, props.id, props.children); } }>update</a>
            <a onClick={ (e) => { props.handleDeleteComment(e, props.id); } }>delete</a>
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
            <a onClick={ (e) => { props.handleSetComment(e, props.id, '') } }> REPLY </a>
          </div>
          <div className="form">
          {
            props.commentId == props.id ? (
              <CommentForm
                id={ props.id }
                text={ props.text }
                parentId = { props.parentId }
                handleChangeText={ props.handleChangeText }
                handleSetComment={ props.handleSetComment }
                submitComment={ props.submitComment }
              />
            ) : null
          }
          </div>
        </div>
      )
    }
    </div>
  </div>
)

Comment.propTypes = {
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  commentId: PropTypes.string,
  author: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  num_like: PropTypes.number,
  num_dislike: PropTypes.number,
  children: PropTypes.string.isRequired,
  updateId: PropTypes.string,
  handleChangeText: PropTypes.func.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  handleSetComment: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDislike: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
  submitComment: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired
}

export default Comment;

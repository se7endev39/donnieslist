// Comment.js
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import CommentForm from './CommentForm'
import CommentMenu from './CommentMenu'

const Comment = props => (
  <div className="singleComment">
    {
      props.type === 'comment' ? (
        <img className="comment-user" src={ props.profileImage ? props.profileImage : '/src/public/img/person.jpg' } />
      ) : (
        <img className="reply-user" src={ props.profileImage ? props.profileImage : '/src/public/img/person.jpg' } />
      )
    }
    <div className="textContent" onMouseOver={ (e) => props.handleShowMenu(e, props.id, props.authorId) }>
    {
      props.updateId == props.id ? (
        <div className="singleCommentContent">
          <div className="form">
            <CommentForm
              id = { props.id }
              text = { props.text }
              placeholder=""
              buttonName = "Save"
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
            <h3>{ props.authorName }</h3>
            <span className="time">{ moment(props.timestamp).fromNow() }</span>
            {/* <a onClick={ (e) => { props.handleUpdateComment(e, props.id, props.children); } }>update</a>
            <a onClick={ (e) => { props.handleDeleteComment(e, props.id); } }>delete</a> */}
          </div>
          {
            props.menuId == props.id ? (
              <CommentMenu
                id={ props.id }
                text={ props.children }
                handleUpdateComment={ props.handleUpdateComment }
                handleDeleteComment={ props.handleDeleteComment }
              />
            ) : null
          }
          <ReactMarkdown source={ props.children } />
          <div className="reply-wrapper">
            <div className="number">
              <img src="/src/public/img/hand-like.svg" onClick={ (e) => props.handleLike(e, props.id) }/>
              { props.voters && props.voters.length ? props.voters.length : '' }
            </div>
            <div className="number">
              <img src="/src/public/img/hand-dislike.svg" onClick={ (e) => props.handleDislike(e, props.id) }/>
            </div>
            <a onClick={ (e) => { props.handleSetComment(e, props.id, '') } }> REPLY </a>
          </div>
          <div className="form">
          {
            props.commentId == props.id ? (
              <CommentForm
                id={ props.id }
                text={ props.text }
                placeholder="Add a public reply..."
                parentId = { props.parentId }
                buttonName = "Reply"
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
  authorId: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  profileImage: PropTypes.string,
  text: PropTypes.string.isRequired,
  voters: PropTypes.array,
  children: PropTypes.string.isRequired,
  updateId: PropTypes.string,
  menuId: PropTypes.string,
  handleShowMenu: PropTypes.func.isRequired,
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

Comment.defaultProps = {
  profileImage: '/src/public/img/person.jpg'
}

export default Comment;

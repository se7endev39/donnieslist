// CommentList.js
import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

const CommentList = (props) => {
  const commentNodes = props.data.map(comment => (
    <div>
      <Comment
        id={ comment._id }
        key={ comment._id }
        type={ 'comment' }
        author={ comment.author }
        text={ props.text }
        num_like={ comment.num_like }
        num_dislike={ comment.num_dislike }
        commentId={ props.commentId }
        parentId = { comment._id }
        timestamp={ comment.updatedAt }
        handleSetComment = { props.handleSetComment }
        handleLike={ props.handleLike }
        handleDislike={ props.handleDislike }
        handleChangeText = { props.handleChangeText }
        handleUpdateComment={ props.handleUpdateComment }
        handleDeleteComment={ props.handleDeleteComment }
        updateId = { props.updateId }
        submitComment = { props.submitComment }
        submitComment = { props.submitComment }
      >
        { comment.text }
      </Comment>
      <div className="reply-list">
      {
        comment.answers.map(answer => (
          <Comment
            id={ answer._id }
            key={ answer._id }
            type={ 'answer' }
            text={ props.text }
            author={ answer.author }
            num_like={ answer.num_like }
            num_dislike={ answer.num_dislike }
            commentId = { props.commentId }
            parentId = { comment._id }
            timestamp={ answer.updatedAt }
            handleSetComment = { props.handleSetComment }
            handleLike={ props.handleLike }
            handleDislike={ props.handleDislike }
            handleChangeText = { props.handleChangeText }
            handleUpdateComment={ props.handleUpdateComment }
            handleDeleteComment={ props.handleDeleteComment }
            updateId = { props.updateId }
            submitComment = { props.submitComment }
            submitComment = { props.submitComment }
          >
            { answer.text }
          </Comment>
        ))
      }
      </div>
    </div>
  ));
  return (
    <div>
      { commentNodes }
    </div>
  );
}

CommentList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
    answers: PropTypes.shape({
      id: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
      num_like: PropTypes.number,
      num_dislike: PropTypes.number,
      updatedAt: PropTypes.string,
      commentId: PropTypes.string
    }),
    updatedAt: PropTypes.string,
  })),
  text: PropTypes.string,
  commentId: PropTypes.string,
  updateId: PropTypes.string,
  handleDeleteComment: PropTypes.func.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  handleSetComment: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDislike: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
}

CommentList.defaultProps = {
  data: [],
}

export default CommentList;

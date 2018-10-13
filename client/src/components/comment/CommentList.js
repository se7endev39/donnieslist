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
        num_like={ comment.num_like }
        num_dislike={ comment.num_dislike }
        commentId={ comment._id }
        timestamp={ comment.updatedAt }
        handleReply = { props.handleReply }
        handleLike={ props.handleLike }
        handleDislike={ props.handleDislike }
        handleChangeText = { props.handleChangeText }
        handleUpdateComment={ props.handleUpdateComment }
        handleDeleteComment={ props.handleDeleteComment }
        showReplyForm = { props.showReplyForm[comment._id] }
        submitReply = { props.submitReply }
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
            author={ answer.author }
            num_like={ answer.num_like }
            num_dislike={ answer.num_dislike }
            commentId = { comment._id }
            timestamp={ answer.updatedAt }
            handleReply = { props.handleReply }
            handleLike={ props.handleLike }
            handleDislike={ props.handleDislike }
            handleChangeText = { props.handleChangeText }
            handleUpdateComment={ props.handleUpdateComment }
            handleDeleteComment={ props.handleDeleteComment }
            showReplyForm = { props.showReplyForm[answer._id] }
            submitReply = { props.submitReply }
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
      parentId: PropTypes.string
    }),
    updatedAt: PropTypes.string,
  })),
  showReplyForm: PropTypes.array,
  handleDeleteComment: PropTypes.func.isRequired,
  handleUpdateComment: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  handleReply: PropTypes.func.isRequired,
  handleReplyChangeText: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDislike: PropTypes.func.isRequired,
  submitReply: PropTypes.func.isRequired
}

CommentList.defaultProps = {
  data: [],
}

export default CommentList;

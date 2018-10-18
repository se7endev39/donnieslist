// CommentList.js
import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';
import { Panel, Glyphicon } from 'react-bootstrap';
import { Image_URL } from '../../actions/index';

const CommentList = (props) => {
  const commentNodes = props.data.map(comment => (
    <div>
      <Comment
        id={ comment._id }
        key={ comment._id }
        type={ 'comment' }
        authorId={ comment.authorId }
        authorName={ comment.authorName ? comment.authorName.firstName + ' ' + comment.authorName.lastName : '' }
        text={ props.text }
        voters={ comment.voters }
        commentId={ props.commentId }
        parentId = { comment._id }
        menuId = { props.menuId }
        timestamp={ comment.updatedAt }
        profileImage={ comment.profileImage ? `${Image_URL}` + comment.profileImage : '' }
        handleShowMenu = { props.handleShowMenu }
        handleShowReply = { props.handleShowReply }
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
      {
        comment.answers.length ? (
          <div className="reply-list">
            {
              !props.replyId[props.id] ? (
                <div className="toggle" onClick={ (e) => props.handleShowReply(e, comment._id) }>
                  View
                  {
                    comment.answers.length == 1 ?
                      ' ' + comment.answers.length + ' reply' :
                      ' all ' + comment.answers.length + ' replies'
                  }
                  &nbsp;
                  <Glyphicon glyph="chevron-down" />
                </div>
              ) : (
                <div className="toggle" onClick={ (e) => props.handleShowReply(e, comment._id) }>
                  {
                    comment.answers.length == 1 ?
                      'Hide reply' :
                      'Hide replies'
                  }
                  &nbsp;
                  <Glyphicon glyph="chevron-up" />
                </div>
              )
            }
            <Panel id="collapsible-panel-example-1" expanded={ props.replyId[comment._id] }>
              <Panel.Collapse>
                <Panel.Body>
                {
                  comment.answers.map(answer => (
                    <Comment
                      id={ answer._id }
                      key={ answer._id }
                      type={ 'answer' }
                      text={ props.text }
                      authorId={ answer.authorId }
                      authorName={ answer.authorName ? answer.authorName.firstName + ' ' + answer.authorName.lastName : '' }
                      voters={ answer.voters }
                      commentId = { props.commentId }
                      parentId = { comment._id }
                      menuId = { props.menuId }
                      timestamp={ answer.updatedAt }
                      profileImage={ answer.profileImage ? `${Image_URL}` + answer.profileImage : '' }
                      handleShowMenu={ props.handleShowMenu }
                      handleShowReply = { props.handleShowReply }
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
                </Panel.Body>
              </Panel.Collapse>
            </Panel>
          </div>
        ) : null
      }
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
    authorId: PropTypes.string,
    authorName: PropTypes.object,
    text: PropTypes.string,
    voters: PropTypes.array,
    answers: PropTypes.shape({
      id: PropTypes.string,
      authorId: PropTypes.string,
      authorName: PropTypes.object,
      text: PropTypes.string,
      voters: PropTypes.array,
      updatedAt: PropTypes.string,
      commentId: PropTypes.string
    }),
    updatedAt: PropTypes.string,
  })),
  text: PropTypes.string,
  commentId: PropTypes.string,
  updateId: PropTypes.string,
  menuId: PropTypes.string,
  replyId: PropTypes.array,
  handleShowMenu: PropTypes.func.isRequired,
  handleShowReply: PropTypes.func.isRequired,
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

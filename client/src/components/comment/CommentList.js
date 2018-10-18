// CommentList.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';
import { Panel, Glyphicon } from 'react-bootstrap';

const Index = _this => {
  const commentNodes = _this.props.data.map(comment => (
    <div>
      <Comment
        data={ comment }
        key={ comment._id }
        type={ 'comment' }
        author = { _this.props.author }
        expert = { _this.props.expert }
        parentId = { comment._id }
        handleShowModal = { _this.props.handleShowModal }
        handleLoadComments = { _this.props.handleLoadComments }
      >
        { comment.text }
      </Comment>
      {
        comment.answers.length ? (
          <div className="reply-list">
            {
              !_this.state.showReplies[comment._id] ? (
                <div className="toggle" onClick={ (e) => _this.handleShowReply(e, comment._id) }>
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
                <div className="toggle" onClick={ (e) => _this.handleShowReply(e, comment._id) }>
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
            <Panel id="collapsible-panel-example-1" expanded={ _this.state.showReplies[comment._id] }>
              <Panel.Collapse>
                <Panel.Body>
                {
                  comment.answers.map(answer => (
                    <Comment
                      key={ answer._id }
                      type={ 'answer' }
                      data={ answer }
                      author = { _this.props.author }
                      expert = { _this.props.expert }
                      parentId = { comment._id }
                      handleShowModal = { _this.props.handleShowModal }
                      handleLoadComments = { _this.props.handleLoadComments }
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

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplies: []
    };
    this.handleShowReply = this.handleShowReply.bind(this);
  }

  componentDidMount() {
  }

  handleShowReply = (e, id) => {
    e.preventDefault()
    let _showReplies = this.state.showReplies;
    _showReplies[id] = !_showReplies[id]
    this.setState({
      showReplies: _showReplies
    });
  }

  render() {
    return Index(this)
  }
}

CommentList.propTypes = {
  author: PropTypes.object,
  expert: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    authorId: PropTypes.string,
    authorName: PropTypes.object,
    text: PropTypes.string,
    voters: PropTypes.array,
    answers: PropTypes.shape({
      _id: PropTypes.string,
      authorId: PropTypes.string,
      authorName: PropTypes.object,
      text: PropTypes.string,
      voters: PropTypes.array,
      updatedAt: PropTypes.string,
      commentId: PropTypes.string
    }),
    updatedAt: PropTypes.string,
  })),
  handleLoadComments: PropTypes.func.isRequired,
  handleShowModal: PropTypes.func.isRequired
}

CommentList.defaultProps = {
  data: [],
  showReplies: []
}

export default CommentList;

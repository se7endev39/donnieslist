// CommentBox.js
import React, { Component } from 'react';
// import 'whatwg-fetch';
import cookie from 'react-cookie';
import { API_URL, Image_URL, errorHandler } from '../../actions/index';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import axios from 'axios'

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      error: null,
      author: '',
      comment: '',
      updateId: null,
      commentId: null,
      showCommentButton: false,
      showReplyForm: []
    };
    this.pollInterval = null;
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadCommentsFromServer, 60000);
    }
    const currentUser = cookie.load('user');
    if (currentUser) {
      let author = currentUser.firstName + ' ' + currentUser.lastName;
      this.setState({ author: author });
    }
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    e.target.style.height = "1px";
    e.target.style.height = (5 + e.target.scrollHeight) + "px";
    this.setState(newState);
  }

  onCommentFocus = (value) => {
    this.setState({ showCommentButton: value });
  }

  onUpdateComment = (id) => {
    const oldComment = this.state.data.find(c => c._id === id);
    if (!oldComment) return;
    this.setState({ author: oldComment.author, text: oldComment.text, updateId: id });
  }

  onDeleteComment = (id) => {
    axios.post(`${API_URL}/deleteComment`, { id })
      .then((res) => {
        console.log(res)
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.loadCommentsFromServer()
        }
      });
  }

  onReply = (id, value) => {
    let newState = { ...this.state };
    newState.showReplyForm[id] = value
    this.setState(newState);
  }

  submitComment = (e) => {
    e.preventDefault();
    const { author, text, updateId } = this.state;
    if (!author || !text) return;
    if (updateId) {
      this.submitUpdatedComment();
    } else {
      this.submitNewComment();
    }
    this.onCommentFocus(false)
  }

  submitReply = (e) => {
    e.preventDefault();
    let replyId = null;
    let commentId = null;
    if (e.target) {
      replyId = e.target.replyId.value
      commentId = e.target.commentId.value
    }
    const { author, reply_text } = this.state;
    axios.post(`${API_URL}/addCommentReply`, { author, commentId, reply_text, _id: Date.now().toString() })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error.message || res.error });
          this.onReply(replyId, false)
        } else
          this.setState({ reply_text: '', error: null });
          this.onReply(replyId, false)
          this.loadCommentsFromServer()
      });
  }

  submitNewComment = () => {
    const { author, text } = this.state;
    axios.post(`${API_URL}/addComment`, { author, text, _id: Date.now().toString() })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error.message || res.error });
        } else {
          this.setState({ text: '', error: null });
          this.loadCommentsFromServer()
        }
      });
  }

  submitUpdatedComment = () => {
    const { author, text, updateId } = this.state;
    axios.post(`${API_URL}/updateComment`, { updateId })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error.message || res.error });
        } else {
          this.setState({ text: '', updateId: null });
        }
      });
  }

  loadCommentsFromServer = () => {
    axios.get(`${API_URL}/getComments`)
      .then(res => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.setState({ data: res.data.data });
        }
      })
  }

  render() {
    return (
      <div className="container">
        <h2>Comments:</h2>
        <div className="form">
          <CommentForm
            author={ this.state.author }
            text={ this.state.text }
            showCommentButton = { this.state.showCommentButton }
            handleFocus = { this.onCommentFocus }
            handleChangeText={ this.onChangeText }
            submitComment={ this.submitComment }
          />
        </div>
        <div className="comment">
          <CommentList
            data={ this.state.data }
            showReplyForm = { this.state.showReplyForm }
            handleDeleteComment={ this.onDeleteComment }
            handleUpdateComment={ this.onUpdateComment }
            handleChangeText = { this.onChangeText }
            handleReply = { this.onReply }
            showReplyForm = { this.state.showReplyForm }
            handleReplyChangeText = { this.onChangeText }
            submitReply = { this.submitReply }
          />
        </div>
        { this.state.error && <p>{ this.state.error}</p>}
      </div>
    );
  }
}

export default CommentBox;

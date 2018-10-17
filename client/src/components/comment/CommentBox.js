// CommentBox.js
import React, { Component } from 'react';
// import 'whatwg-fetch';
import cookie from 'react-cookie';
import { API_URL, Image_URL, errorHandler } from '../../actions/index';
import CommentList from './CommentList';
import CommentNew from './CommentNew';
import axios from 'axios'

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      error: null,
      author: '',
      text: '',
      updateId: null,
      parentId: null,
      commentId: null
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
    this.setState({
      text: e.target.value
    });
  }

  onSetComment = (e, id, text) => {
    e.preventDefault()
    this.setState({
      commentId: id,
      updateId: null,
      text: text
    });
  }

  onUpdateComment = (e, id, text) => {
    e.preventDefault()
    this.setState({
      commentId: null,
      updateId: id,
      text: text
    })
    // this.setState({ author: oldComment.author, text: oldComment.text, updateId: id });
  }

  onDeleteComment = (e, id) => {
    e.preventDefault()
    axios.post(`${API_URL}/deleteComment`, { id })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.loadCommentsFromServer()
        }
      });
  }

  onLike = (id, value) => {
    axios.post(`${API_URL}/updateLikeNum`, { id, value })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.loadCommentsFromServer()
        }
      });
  }

  onDislike = (id, value) => {
    axios.post(`${API_URL}/updateDislikeNum`, { id, value })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.loadCommentsFromServer()
        }
      });
  }

  submitComment = (e) => {
    e.preventDefault();
    const { author, text, updateId } = this.state;
    if (!author || !text) return;
    if (updateId) {
      this.submitUpdatedComment(e);
    } else  {
      this.submitNewComment(e);
    }
  }

  submitNewComment = (e) => {
    e.preventDefault();
    let parentId = e.target.parentId.value;
    const { author, text } = this.state;
    if (!author || !text || !parentId) return;
    axios.post(`${API_URL}/addComment`, { author, text, parentId, _id: Date.now().toString() })
      .then((res) => {
        console.log(res.data)
        if (!res.data.success) {
          this.setState({ error: res.data.error.message || res.data.error });
        } else {
          this.onSetComment(e, null, '')
          this.loadCommentsFromServer()
        }
      });
  }

  submitUpdatedComment = (e) => {
    const { text, updateId } = this.state;
    console.log(updateId);
    axios.post(`${API_URL}/updateComment`, { text, updateId })
      .then((res) => {
        console.log(res)
        if (!res.data.success) {
          this.setState({ error: res.data.error.message || res.data.error });
        } else {
          this.onUpdateComment(e, null, '');
          this.loadCommentsFromServer();
        }
      });
  }

  loadCommentsFromServer = () => {
    axios.get(`${API_URL}/getComments`)
      .then(res => {
        if (!res.data.success) {
          this.setState({ error: res.data.error });
        } else {
          this.setState({ data: res.data.data });
        }
      })
  }

  render() {
    return (
      <div className="container">
        <h3>
        {
          this.state.data.length > 1 ?
            this.state.data.length + ' Comments' :
            this.state.data.length + 'Comment'
        }
        </h3>
        <div className="form">
          <CommentNew
            id = "-1"
            text = { this.state.text }
            commentId = { this.state.commentId }
            handleSetComment = { this.onSetComment }
            handleChangeText={ this.onChangeText }
            submitComment={ this.submitNewComment }
          />
        </div>
        <div className="comment">
          <CommentList
            data={ this.state.data }
            text={ this.state.text }
            commentId = { this.state.commentId }
            updateId = { this.state.updateId }
            handleSetComment = { this.onSetComment }
            handleLike={ this.onLike }
            handleDislike={ this.onDislike }
            handleChangeText = { this.onChangeText }
            handleDeleteComment={ this.onDeleteComment }
            handleUpdateComment={ this.onUpdateComment }
            submitComment = { this.submitComment }
          />
        </div>
        { this.state.error && <p>{ this.state.error }</p> }
      </div>
    );
  }
}

export default CommentBox;

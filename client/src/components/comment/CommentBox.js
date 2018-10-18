// CommentBox.js
import React, { Component } from 'react';
// import 'whatwg-fetch';
import axios from 'axios'
import cookie from 'react-cookie';
import { API_URL, Image_URL, errorHandler } from '../../actions/index';
import { browserHistory } from 'react-router';

import CommentModal from './CommentModal';
import CommentList from './CommentList';
import CommentNew from './CommentNew';

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
      author: '',
      name: '',
      text: '',
      updateId: null,
      parentId: null,
      commentId: null,
      menuId: null,
      replyId: [],
      showModal: null,
      modal: {
        title: '',
        text: ''
      }
    };
    this.pollInterval = null;
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadCommentsFromServer, 60000);
    }
    const currentUser = cookie.load('user');
    if (currentUser) {
      let name = currentUser.firstName + ' ' + currentUser.lastName;
      this.setState({
        author: {
          id: currentUser.slug,
          name: currentUser.firstName + ' ' + currentUser.lastName,
          role: currentUser.role
        }
      });
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

  onShowMenu = (e, id, authorId) => {
    e.preventDefault()
    if (authorId == this.state.author.id) {
      this.setState({
        menuId: id
      })
    }
  }

  onShowReply = (e, id) => {
    e.preventDefault()
    let _replyId = this.state.replyId;
    _replyId[id] = !_replyId[id]
    this.setState({
      replyId: _replyId
    })
  }

  onUpdateComment = (e, id, text) => {
    e.preventDefault()
    this.setState({
      commentId: null,
      updateId: id,
      text: text
    })
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

  onLike = (e, id) => {
    const { author } = this.state;
    if (!author) {
      this.setState({
        showModal: 'need_login'
      })
      return ;
    } else if (author.role !== 'Expert') {
      this.setState({
        showModal: 'need_expert'
      })
      return ;
    }
    axios.post(`${API_URL}/likeComment`, { id, author: author.id })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.loadCommentsFromServer()
        }
      });
  }

  onDislike = (e, id) => {
    const { author } = this.state;
    if (!author) {
      this.setState({
        showModal: 'need_login'
      })
      return ;
    } else if (author.role !== 'Expert') {
      this.setState({
        showModal: 'need_expert'
      })
      return ;
    }
    axios.post(`${API_URL}/dislikeComment`, { id, author: author.id })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.loadCommentsFromServer()
        }
      });
  }

  onModalLogin = (e) => {
    this.setState({
      showModal: null
    })
    this.redirectToLogin(e);
  }

  onModalClose = (e) => {
    this.setState({
      showModal: null
    })
  }

  submitComment = (e) => {
    e.preventDefault();
    const { author, text, updateId } = this.state;
    if (!text) return;

    if (!author) {
      this.setState({
        showModal: 'need_login'
      })
      return ;
    } else if (author.role !== 'Expert') {
      this.setState({
        showModal: 'need_expert'
      })
      return ;
    }

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
    const { expert } = this.props;
    if (!text || !parentId) return;

    axios.post(`${API_URL}/addComment`, { expert, author: author.id, text, parentId, _id: Date.now().toString() })
      .then((res) => {
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
    axios.post(`${API_URL}/updateComment`, { text, updateId })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.data.error.message || res.data.error });
        } else {
          this.onUpdateComment(e, null, '');
          this.loadCommentsFromServer();
        }
      });
  }

  loadCommentsFromServer = () => {
    let slug = this.props.expert;
    axios.get(`${ API_URL }/getComments/${ slug }`)
      .then(res => {
        if (!res.data.success) {
          this.setState({ error: res.data.error });
        } else {
          // console.log(res.data.data);
          this.setState({ data: res.data.data });
        }
      })
  }

  redirectToLogin(e) {
    if(e.target) {
      e.preventDefault()
    }
    browserHistory.push('/login');
  }

  handleModalClose() {
    this.setState({
      showModal: false
    })
  }

  render() {
    return (
      <div className="container">
        <h3>
        {
          this.state.data.length > 1 ?
            this.state.data.length + ' Comments' :
            ( this.state.data.length == 1 ?
                this.state.data.length + ' Comment' :
                'No Comment' )
        }
        </h3>
        <div className="form">
          <CommentNew
            id = "-1"
            text = { this.state.text }
            commentId = { this.state.commentId }
            handleSetComment = { this.onSetComment }
            handleChangeText={ this.onChangeText }
            submitComment={ this.submitComment }
          />
        </div>
        <div className="comment">
          <CommentList
            data={ this.state.data }
            text={ this.state.text }
            commentId = { this.state.commentId }
            updateId = { this.state.updateId }
            menuId = { this.state.menuId }
            replyId = { this.state.replyId }
            handleShowMenu = { this.onShowMenu }
            handleShowReply = { this.onShowReply }
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
        {
          this.state.showModal == 'need_login' ? (
            <CommentModal
              title = "Please log in..."
              text = "You need to login to submit or reply to comment."
              showModal = { this.state.showModal }
              handleModalClose = { this.onModalClose }
              handleModalLogin = { this.onModalLogin }
            />
          ) : (
            this.state.showModal == 'need_expert' ? (
              <CommentModal
                title = "Sorry..."
                text = "Only expert can submit or reply to comment."
                showModal = { this.state.showModal }
                handleModalClose = { this.onModalClose }
              />
            ) : null
          )
        }
      </div>
    );
  }
}

export default CommentBox;

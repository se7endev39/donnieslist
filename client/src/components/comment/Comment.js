// Comment.js
import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios'
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { API_URL, Image_URL } from '../../actions/index';

import CommentForm from './CommentForm';
import CommentMenu from './CommentMenu';

const Index = _this => (
  <div className="singleComment">
    {
      _this.props.type === 'comment' ? (
        <img className="comment-user" src={ _this.props.data.profileImage ? Image_URL + _this.props.data.profileImage : '/src/public/img/person.jpg' } />
      ) : (
        <img className="reply-user" src={ _this.props.data.profileImage ? Image_URL + _this.props.data.profileImage : '/src/public/img/person.jpg' } />
      )
    }
    <div
      className="textContent"
      onMouseOver={ (e) => _this.onShowMenu(e, true) }
      onMouseLeave={ (e) => _this.onShowMenu(e, false) }
    >
    {
      _this.state.showUpdate ? (
        <div className="singleCommentContent">
          <div className="form">
            <CommentForm
              text = { _this.state.text }
              placeholder=""
              buttonName = "Save"
              formType = "form_update"
              handleChangeText = { _this.onChangeText }
              handleSubmitComment = { _this.onSubmitComment }
              handleShowForm = { _this.onShowUpdate }
            />
          </div>
        </div>
      ) : (
        <div className="singleCommentContent">
          <div className="singleCommentButtons">
            <h3>{ _this.props.data.authorName ?  _this.props.data.authorName.firstName + ' ' + _this.props.data.authorName.lastName : '' }</h3>
            <span className="time">{ moment(_this.props.data.updatedAt).fromNow() }</span>
          </div>
          {
            _this.state.showMenu ? (
              <CommentMenu
                text={ _this.props.children }
                handleUpdateComment={ _this.onShowUpdate }
                handleDeleteComment={ _this.onDeleteComment }
              />
            ) : null
          }
          <ReactMarkdown source={ _this.props.children } />
          <div className="reply-wrapper">
            <div className="number">
              <img src="/src/public/img/hand-like.png" onClick={ (e) => _this.onLike(e) }/>
              { _this.props.data.voters && _this.props.data.voters.length ? _this.props.data.voters.length : '' }
            </div>
            <div className="number">
              <img src="/src/public/img/hand-dislike.png" onClick={ (e) => _this.onDislike(e) }/>
            </div>
            <a onClick={ (e) => { _this.onShowReply(e, true) } }> REPLY </a>
          </div>
          <div className="form">
          {
            _this.state.showReply ? (
              <CommentForm
                text={ _this.state.text }
                placeholder="Add a public reply..."
                buttonName = "Reply"
                formType = "form_reply"
                handleChangeText={ _this.onChangeText }
                handleShowForm={ _this.onShowReply }
                handleSubmitComment={ _this.onSubmitComment }
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

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.data._id,
      author: props.author,
      expert: props.expert,
      text: '',
      parentId: props.parentId,
      showMenu: false,
      showModal: null,
      showReply: false,
      showUpdate: false
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.onShowMenu = this.onShowMenu.bind(this);
    this.onShowReply = this.onShowReply.bind(this);
    this.onShowUpdate = this.onShowUpdate.bind(this);
    this.onLike = this.onLike.bind(this);
    this.onDislike = this.onDislike.bind(this);
    this.submitNewComment = this.submitNewComment.bind(this);
    this.submitUpdatedComment = this.submitUpdatedComment.bind(this);
  }

  componentDidMount() {
    // console.log(this.state);
  }

  onChangeText = (e) => {
    this.setState({
      text: e.target.value
    });
  }

  onShowReply = (e, value) => {
    e.preventDefault()
    this.setState({
      showReply: value,
      text: ''
    });
  }

  onShowMenu = (e, value) => {
    e.preventDefault()
    if (this.props.data.authorId == this.props.author.id) {
      this.setState({
        showMenu: value
      })
    }
  }

  onShowUpdate = (e, value) => {
    e.preventDefault()
    this.setState({
      showUpdate: value,
      text: this.props.data.text
    })
  }

  onDeleteComment = (e) => {
    e.preventDefault()
    const { id } = this.state
    axios.post(`${API_URL}/deleteComment`, { id })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.props.handleLoadComments()
        }
      });
  }

  onLike = (e) => {
    e.preventDefault()
    const { id, author } = this.state;
    if (!author) {
      this.props.handleShowModal(e, 'need_login')
      return ;
    } else if (author.role !== 'Expert') {
      this.props.handleShowModal(e, 'need_expert')
      return ;
    }
    axios.post(`${API_URL}/likeComment`, { id, author: author.id })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.props.handleLoadComments()
        }
      });
  }

  onDislike = (e) => {
    e.preventDefault()
    const { id, author } = this.state;
    if (!author) {
      this.props.handleShowModal(e, 'need_login')
      return ;
    } else if (author.role !== 'Expert') {
      this.props.handleShowModal(e, 'need_expert')
      return ;
    }
    axios.post(`${API_URL}/dislikeComment`, { id, author: author.id })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.error });
        } else {
          this.props.handleLoadComments()
        }
      });
  }

  onSubmitComment = (e) => {
    e.preventDefault();
    const { text, author } = this.state;
    if (!text) return;

    if (!author) {
      this.props.handleShowModal(e, 'need_login')
      return ;
    } else if (author.role !== 'Expert') {
      this.props.handleShowModal(e, 'need_expert')
      return ;
    }

    if (this.state.showUpdate) {
      this.submitUpdatedComment(e);
    } else  {
      this.submitNewComment(e);
    }
  }

  submitNewComment = (e) => {
    e.preventDefault();
    const { text, author, parentId, expert } = this.state;
    if (!text || !parentId) return;

    axios.post(`${API_URL}/addComment`, { expert, author: author.id, text, parentId, _id: Date.now().toString() })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.data.error.message || res.data.error });
        } else {
          this.onShowReply(e, false)
          this.props.handleLoadComments()
        }
      });
  }

  submitUpdatedComment = (e) => {
    const { id, text } = this.state;
    axios.post(`${API_URL}/updateComment`, { id, text })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.data.error.message || res.data.error });
        } else {
          this.onShowUpdate(e, false);
          this.props.handleLoadComments();
        }
      });
  }

  render() {
    return Index(this)
  }
}

Comment.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    authorId: PropTypes.string,
    authorName: PropTypes.object,
    text: PropTypes.string,
    voters: PropTypes.array,
    updatedAt: PropTypes.string
  })),
  type: PropTypes.isRequired,
  author: PropTypes.object,
  expert: PropTypes.string,
  parentId: PropTypes.isRequired,
  handleShowModal: PropTypes.func.isRequired,
  handleLoadComments: PropTypes.func.isRequired
}

export default Comment;

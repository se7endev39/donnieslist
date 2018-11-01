// CommentBox.js
import React, { Component } from 'react';
// import 'whatwg-fetch';
import cookie from 'react-cookie';
import axios from 'axios';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { API_URL } from '../../actions/index';

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
      showButton: false,
      showModal: null,
    };
    this.pollInterval = null;
    this.onModalClose = this.onModalClose.bind(this);
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadCommentsFromServer, 60000);
    }
    const currentUser = cookie.load('user');
    if (currentUser) {
      this.setState({
        author: {
          id: currentUser.slug,
          name: currentUser.firstName + ' ' + currentUser.lastName,
          /* role: currentUser.role */
          role: 'Expert',
        },
      });
    }
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

  onChangeText = (e) => {
    this.setState({
      text: e.target.value,
    });
  }

  onModalShow = (e, value) => {
    this.setState({
      showModal: value,
    });
  }

  onModalLogin = (e) => {
    this.setState({
      showModal: null,
    });
    this.redirectToLogin(e);
  }

  onModalClose = () => {
    this.setState({
      showModal: null,
    });
  }

  onShowButton = (e, value) => {
    this.setState({
      showButton: value,
      text: '',
    });
  }

  onSubmitComment = (e) => {
    e.preventDefault();
    const { author, text } = this.state;
    const { expert } = this.props;

    if (!text || !expert) return;

    if (!author) {
      this.onModalShow(e, 'need_login');
      return;
    } else if (author.role !== 'Expert') {
      this.onModalShow(e, 'need_expert');
      return;
    }

    const parentId = '-1';
    axios.post(`${API_URL}/addComment`, { expert, author: author.id, text, parentId, _id: Date.now().toString() })
      .then((res) => {
        if (!res.data.success) {
          this.setState({ error: res.data.error.message || res.data.error });
        } else {
          this.onShowButton(e, false);
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

  onModalClose() {
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
            showButton = { this.state.showButton }
            handleShowButton = { this.onShowButton }
            handleChangeText={ this.onChangeText }
            handleSubmitComment={ this.onSubmitComment }
          />
        </div>
        <div className="comment">
          <CommentList
            data={ this.state.data }
            author = { this.state.author }
            expert = { this.props.expert }
            handleShowModal = { this.onModalShow }
            handleLoadComments = { this.loadCommentsFromServer }
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

CommentBox.propTypes = {
  expert: PropTypes.string.isRequired
}

export default CommentBox;

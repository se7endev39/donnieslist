/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { API_URL, Image_URL } from '../../constants/api';

import CommentForm from './CommentForm';
import CommentMenu from './CommentMenu';

const Comment = props => {
  const _default = {
    id: props.data._id,
    author: props.author,
    expert: props.expert,
    text: "",
    parentId: props.parentId,
    showMenu: false,
    showModal: false,
    showReply: false,
    showUpdate: false,
  };
  useEffect(() => {
    // console.log('data_id',props.data);
    // console.log('author',props.author);
    // console.log('expert',props.expert);
    // console.log('parentId',props.parentId);
  }, []);
  const [state, setState] = useState(_default);

  const onChangeText = (text) => {
    setState({...state, text: text});
  };

  const onShowReply = (e, value) => {
    e.preventDefault();
    setState({...state, showReply: value, text: ""});
  };

  const onShowMenu = (value ) => {
    if(props.data.authorId === props.author?.id) {
      setState({...state, showMenu: value});
    }
  };

  const onShowUpdate = (e, value) => {
    e.preventDefault();
    setState({...state, showUpdate: value, text: props.data.text});
  };

  const onDeleteComment = e => {
    e.preventDefault();
    const { id } = state;
    axios.post(`${API_URL}/deleteComment`, { id }).then((res) => {
      if (!res.data.success) {
        setState({...state,  error: res.error });
      } else {
        props.handleLoadComments();
      }
    });
  };

  const onLike = e => {
    e.preventDefault();
    const {id, author} = state;
    if (!author) {
      props.handleShowModal(true);
      return;
    } else if (author.role !== "Expert") {
      props.handleShowModal(true);
      return;
    }
    axios
      .post(`${API_URL}/likeComment`, { id, author: author.id })
      .then((res) => {
        if (!res.data.success) {
          setState({...state, error: res.error });
        } else {
          props.handleLoadComments();
        }
      });
  }

  const onDislike = (e) => {
    e.preventDefault();
    const { id, author } = state;
    if (!author) {
      props.handleShowModal(true);
      return;
    } else if (author.role !== "Expert") {
      props.handleShowModal(true);
      return;
    }
    axios
      .post(`${API_URL}/dislikeComment`, { id, author: author.id })
      .then((res) => {
        if (!res.data.success) {
          setState({...state, error: res.error });
        } else {
          props.handleLoadComments();
        }
      });
  };

  const onSubmitComment = (e) => {
    e.preventDefault();
    const { text, author } = state;
    if (!text) return;

    if (!author) {
      props.handleShowModal(true);
      return;
    } else if (author.role !== "Expert") {
      props.handleShowModal(true);
      return;
    }

    if (state.showUpdate) {
      submitUpdatedComment(e);
    } else {
      submitNewComment(e);
    }
  };

  const submitNewComment = (e) => {
    e.preventDefault();
    const { text, author, parentId, expert } = state;
    if (!text || !parentId) return;

    axios
      .post(`${API_URL}/addComment`, {
        expert,
        author: author.id,
        text,
        parentId,
        _id: Date.now().toString(),
      })
      .then((res) => {
        if (!res.data.success) {
          setState({...state, error: res.data.error.message || res.data.error });
        } else {
          onShowReply(e, false);
          props.handleLoadComments();
        }
      });
  };

  const submitUpdatedComment = (e) => {
    const { id, text } = state;
    axios.post(`${API_URL}/updateComment`, { id, text }).then((res) => {
      if (!res.data.success) {
        setState({...state, error: res.data.error.message || res.data.error });
      } else {
        onShowUpdate(e, false);
        props.handleLoadComments();
      }
    });
  };

  return(
    <div className="singleComment">
      {props.type === "comment" ? (
        <img
          alt=""
          className="comment-user"
          src={
            props.data.profileImage
              ? Image_URL + props.data.profileImage
              : "/img/person.jpg"
          }
        />
      ) : (
        <img
          alt=""
          className="reply-user"
          src={
            props.data.profileImage
              ? Image_URL + props.data.profileImage
              : "/img/person.jpg"
          }
        />
      )}
      <div
        className="textContent"
        onMouseOver={() => onShowMenu(true)}
        onMouseLeave={() => onShowMenu(false)}
      >
        {state.showUpdate ? (
          <div className="singleCommentContent">
            <div className="form">
              <CommentForm
                text={state.text}
                placeholder=""
                buttonName="Save"
                formType="form_update"
                handleChangeText={(value) => onChangeText(value)}
                handleSubmitComment={(e) => onSubmitComment(e)}
                handleShowForm={(e, isShown) => onShowUpdate(e, isShown)}
              />
            </div>
          </div>
        ) : (
          <div className="singleCommentContent">
            <div className="singleCommentButtons">
              <h3> {props.data?.author.split("-")[0]} {props.data?.author.split("-")[1]}</h3>
              <span className="time">
                {moment(props.data.updatedAt).fromNow()}
              </span>
            </div>
            {state.showMenu && (
              <CommentMenu
                text={props.children}
                handleUpdateComment={(e, isShown) => onShowUpdate(e, isShown)}
                handleDeleteComment={(e) => onDeleteComment(e)}
              />
            )}
            <ReactMarkdown children={props.children} />
            <div className="reply-wrapper">
              <div className="number">
                <img
                  alt=""
                  src="/img/hand-like.png"
                  onClick={(e) => onLike(e)}
                />
                {props.data.voters && props.data.voters.length
                  && props.data.voters.length}
              </div>
              <div className="number">
                <img
                  alt=""
                  src="/img/hand-dislike.png"
                  onClick={(e) => onDislike(e)}
                />
              </div>
              <a
                onClick={(e) => {
                  onShowReply(e, true);
                }}
              >
                REPLY
              </a>
            </div>
            <div className="form">
              {state.showReply && (
                <CommentForm
                  text={state.text}
                  placeholder="Add a public reply..."
                  buttonName="Reply"
                  formType="form_reply"
                  handleChangeText={(value) => {onChangeText(value)}}
                  handleShowForm={(e, isShown) => {onShowReply(e, isShown)}}
                  handleSubmitComment={(e) => {onSubmitComment(e)}}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
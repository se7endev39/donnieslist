/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';

import CommentModal from './CommentModal';
import CommentList from './CommentList';
import CommentNew from './CommentNew';
import ReplyList from './ReplyList';

import { API_URL } from '../../constants/api';

let _isMounted = false;

const CommentBox = props => {
  const _default = {
    data: [],
    error: null,
    author: {},
    showButton: false,
    showModal: false,
    comments: [],
    replies: [],
    myData: ["1", "22", "333"],
    text: '',
  };
  const [state, setState] = useState(_default);
  const history = useHistory();
  const [cookies,] = useCookies();
  const abortController = new AbortController();
  const signal = abortController.signal;

  const loadCommentsFromServer = () => {
    axios.get(`${API_URL}/getComments/${props.expert}`, {signal: signal}).then((res) => {
      if (!res.data.success) {
        _isMounted && setState(state => ({...state, error: res.data.error }));
      } else {
        _isMounted && setState(state => ({...state, data: res.data.data }));
      }
    });
  };

  const likeComment = id => {
    var author = cookies.user?.slug;
    axios.post(`${API_URL}/likeComment`, { id, author }).then((res) => {
      if (!res.data.success) {
        setState({...state, error: res.data.error.message || res.data.error });
      } else {
        console.log("liked");
        loadCommentsFromServer();
      }
    });
  };

  const dislikeComment = id => {
    var author = cookies.user?.slug;
    axios.post(`${API_URL}/dislikeComment`, { id, author }).then((res) => {
      if (!res.data.success) {
        setState({...state, error: res.data.error.message || res.data.error });
      } else {
        console.log("disliked");
        loadCommentsFromServer();
      }
    });
  }

  const onChangeText = (value) => {
    setState({...state, text: value});
  };

  const onModalShow = (isShown) => {
    setState({...state, showModal: isShown});
  };

  const onModalLogin = () => {
    setState({...state, showModal: false});
    redirectToLogin();
  };

  const onModalClose = () => {
    setState({...state, showModal: false});
  };

  const onShowButton = (isShown, type) => {
    if(type === 'cancel') setState({...state, showButton: isShown, text: ''});
    else setState({...state, showButton: isShown});
  }

  const onSubmitComment = (e) => {
    e.preventDefault();
    const {author, text} = state;
    const {expert} = props;
    if(!text || !expert) return;

    if(!author) {
      onModalShow(true);
      return;
    } else if (author.role !== "Expert") {
      onModalShow(true);
      return;
    }
    const parentId = "-1";
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
          onShowButton(false, null);
          loadCommentsFromServer();
        }
      });
  };

  const redirectToLogin = () => {
    history.push("/login");
  };

  const addReply = (id) => {
    const author = props.author;
    const text = window.$(".reply_" + id).val();
    const expert = props.expert;

    window.$(".reply_field").val("");

    if (!text || !expert) return;
    if (!author) {
      //   props.onModalShow(e, 'need_login');
      return;
    }
    const parentId = id;
    axios
      .post(`${API_URL}/addComment`, {
        expert: expert.expert,
        author: author.id,
        text,
        parentId,
        _id: Date.now().toString(),
      })
      .then((res) => {
        if (!res.data.success) {
          setState({
            ...state,
            error: res.data.error.message || res.data.error,
          });
        } else {
          console.log("---new reply added---");
          // getReplies();
        }
      });
  };

  useEffect(() => {
    _isMounted = true;
    _isMounted && loadCommentsFromServer();
    const interval = setInterval(() => {
      _isMounted && loadCommentsFromServer();
    }, 60000);
    const currentUser = cookies.user;
    if(currentUser) {
      _isMounted && setState(state => ({...state, author: {
        id: currentUser.slug,
          name: currentUser.firstName + " " + currentUser.lastName,
          role: currentUser.role,
      }}));
    }
    return () => {
      clearInterval(interval);
      window.$(document).on("click", ".reply", function() {
        window.$(this).toggleClass("reply-show");
      });
      abortController.abort();
      _isMounted = false;
    }
  }, []);

  return (
    <div className="comment_inner_wrap">
      <h3>
      { state.data && state.data.length > 1
        ? state.data.length + " Comments"
        : state.data.length === 1
        ? state.data.length + " Comment"
        : "No Comment"
      }
      </h3>
      <div className="form">
        <CommentNew
          id="-1"
          text={state.text}
          commentId={state.commentId}
          showButton={state.showButton}
          handleShowButton={(isShown, type) => {onShowButton(isShown, type)}}
          handleChangeText={(value) => {onChangeText(value)}}
          handleSubmitComment={(e) => {onSubmitComment(e)}}
        />
      </div>
      <div className="comment list">
        {state.data &&
          state.data.map((comments, i) => (
              <div className="comments_list" key={`COMMENT_ITEM_${i}`}>
                <img
                  alt=""
                  src={
                    "/profile_images/" +
                    comments.users[0]?.profileImage
                  }
                  height="50px"
                  width="50px"
                />
                <a
                  href={
                    "/expert/" +
                    comments.users[0]?.expertCategories[0] +
                    "/" +
                    comments.users[0]?.slug
                  }
                  style={{ cursor: "pointer" }}
                >
                  {comments.users[0]?.profile.firstName +
                    " " +
                    comments.users[0]?.profile.lastName}
                </a>
                <p>{comments.text}</p>

                <div className="like_section list">
                  <span>
                    {comments.voters.length ? comments.voters.length : ""}
                  </span>

                  <i
                    className={
                      "fa fa-thumbs-up like " +
                      (comments.like_slugs.includes(state.author.id)
                        ? "green"
                        : "")
                    }
                    onClick={() => {
                      likeComment(comments._id);
                    }}
                    style={{ padding: "0 10px", fontSize: "18px" }}
                    data-status="no"
                    data-id={comments._id}
                  ></i>

                  <span>
                    {comments.voters_dislikes &&
                    comments.voters_dislikes.length
                      ? comments.voters_dislikes.length
                      : ""}
                  </span>
                  <i
                    className={
                      "fa fa-thumbs-down dislike " +
                      (comments.dislike_slugs.includes(state.author.id)
                        ? "red2"
                        : "")
                    }
                    onClick={() => {
                      dislikeComment(comments._id);
                    }}
                    data-status="no"
                    data-id={comments._id}
                    style={{ padding: "0 10px", fontSize: "18px" }}
                  ></i>

                  <label className="reply">Reply</label>

                  <div className="reply_wrap">
                    <div className="contents" style={{ display: "none" }}>
                      <img
                          alt=""
                        src={
                          "/profile_images/" +
                          comments.users[0]?.profileImage
                        }
                        height="50px"
                        width="50px"
                      />
                      <p className="text"></p>
                    </div>

                    <i
                      className={
                        "fa fa-thumbs-up like " +
                        (comments.like_slugs.includes(state.author.id)
                          ? "green"
                          : "")
                      }
                      data-likeslug={comments.like_slugs}
                      data-authordslug={state.author.id}
                      style={{
                        padding: "0 10px",
                        fontSize: "18px",
                        display: "none",
                      }}
                      data-status="no"
                      data-id={comments._id}
                    ></i>

                    <span style={{ display: "none" }}>
                      {comments.voters_dislikes &&
                      comments.voters_dislikes.length
                        ? comments.voters_dislikes.length
                        : ""}
                    </span>
                    <i
                      className={
                        "fa fa-thumbs-down dislike " +
                        (comments.dislike_slugs.includes(state.author.id)
                          ? "red2"
                          : "")
                      }
                      data-status="no"
                      data-id={comments._id}
                      style={{
                        padding: "0 10px",
                        fontSize: "18px",
                        display: "none",
                      }}
                    ></i>

                    <ReplyList
                      id={comments._id}
                      author={state.author}
                      expert={props}
                      openLoginRequestModal = {(isShown) => {onModalShow(isShown)}}
                      // ref={(cd) => (this.child = cd)}
                    />

                    <div
                      className="form-group-text"
                      style={{ display: "none" }}
                    >
                      <textarea
                        className={"form-control reply_" + comments._id}
                        placeholder="Type Something...."
                        rows="5"
                      ></textarea>
                      <button
                        data-id={comments._id}
                        onClick={() => {
                          addReply(comments._id);
                        }}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        }
      </div>
      {
        (state.data && state.data.length > 1) && (
          <div className="comment">
            <CommentList
              data={state.data}
              author={state.author}
              expert={props.expert}
              handleShowModal={(isShown) => {onModalShow(isShown)}}
              handleLoadComments={() => {loadCommentsFromServer()}}
            />
          </div>
        )
      }
      {
        state.error && <p>{state.error}</p>
      }
      {
        (state.showModal && !cookies.user) ? (
          <CommentModal
            title="Please log in..."
            text="You need to login to submit or reply to comment."
            showModal={state.showModal}
            handleModalClose={() => {onModalClose()}}
            handleModalLogin={() => {onModalLogin()}}
          />
        ) : state.showModal && cookies.user?.role !== 'Expert' ? (
          <CommentModal
            title="Sorry..."
            text="Only expert can submit or reply to comment."
            showModal={state.showModal}
            handleModalClose={() => {onModalClose()}}
          />
        ) : null
      }
    </div>
  );
};

export default CommentBox;
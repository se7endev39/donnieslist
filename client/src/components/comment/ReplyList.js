import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

import { API_URL } from "../../constants/api";

// import CommentModal from "./CommentModal";
// import CommentList from "./CommentList";
// import CommentNew from "./CommentNew";

const ReplyList = (props) => {
  const _default = {
    replies: [],
    error: null,
  };
  const [state, setState] = useState(_default);
  const [cookies] = useCookies();

  const getReplies = () => {
    let id = props.id;
    axios.post(`${API_URL}/get-replies`, { id }).then((res) => {
      if (!res.data.success) {
        setState((state) => ({
          ...state,
          error: res.data.error.message || res.data.error,
        }));
      } else {
        console.log("replies retrieved---1");
        setState((state) => ({ ...state, replies_list: res.data.data }));
        // res.data.data.map(function(it){
        // 	console.log(it.text);
        // })
      }
    });
  };

  const likeComment = (id) => {
    const author = cookies.user?.slug;
    axios.post(`${API_URL}/likeComment`, { id, author }).then((res) => {
      if (!res.data.success) {
        setState({
          ...state,
          error: res.data?.error?.message || res.data?.error,
        });
      } else {
        console.log("liked");
        getReplies();
      }
    });
  };

  const dislikeComment = (id) => {
    var author = cookies.user?.slug;
    axios.post(`${API_URL}/dislikeComment`, { id, author }).then((res) => {
      if (!res.data.success) {
        setState({ ...state, error: res.data.error.message || res.data.error });
      } else {
        console.log("disliked");
        // getReplies();
      }
    });
  };

  const addReply = (id) => {
    if (cookies.user === undefined) {
      props.openLoginRequestModal(true);
    } else {
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
      console.log("xxxxxxxxx");
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
    }
  };

  useEffect(() => {
    // getReplies();
  }, []);

  return (
    <div className="reply_list" style={{ marginLeft: "30px" }}>
      {state.replies.map((reply, i) => {
        return (
          <div>
            <div className="contents">
              <img
                alt=""
                src={"/profile_images/" + reply.users[0].profileImage}
                height="50px"
                width="50px"
              />
              <p className="text">{reply.text}</p>
            </div>

            <span>{reply.voters.length ? reply.voters.length : ""}</span>
            <i
              className={
                "fa fa-thumbs-up like " +
                (reply.like_slugs.includes(props.author.id) ? "green" : "")
              }
              data-likeslug={reply.like_slugs}
              data-authordslug={props.author.id}
              style={{ padding: "0 10px", fontSize: "18px" }}
              onClick={() => {
                likeComment(reply._id);
              }}
              data-status="no"
              data-id={reply._id}
            ></i>

            <span>
              {reply.voters_dislikes && reply.voters_dislikes.length
                ? reply.voters_dislikes.length
                : ""}
            </span>
            <i
              className={
                "fa fa-thumbs-down dislike " +
                (reply.dislike_slugs.includes(props.author.id)
                  ? "red2"
                  : "")
              }
              onClick={() => {
                dislikeComment(reply._id);
              }}
              data-status="no"
              data-id={reply._id}
              style={{ padding: "0 10px", fontSize: "18px" }}
            ></i>
          </div>
        );
      })}
      <div className="form-group-text">
        <textarea
          className={"form-control reply_field reply_" + props.id}
          placeholder="Add a reply.."
          rows="5"
        ></textarea>
        <button
          data-id={props.id}
          onClick={() => {
            addReply(props.id);
          }}
        >
          Add reply
        </button>
      </div>
    </div>
  );
};

export default ReplyList;

import React, { useState, useEffect } from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';

import Comment from './Comment';

const CommentList = props => {
  const [showReplies, setShowReplies] = useState([]);

  const handleShowReply = (id) => {
    let _showReplies = showReplies;
    _showReplies[id] = !_showReplies[id];
    setShowReplies(_showReplies);
  };

  useEffect(() => {
    // console.log('=======', props.author);
  }, []);

  return (
    <div>
      {
        props.data.map((comment, index) => (
          <div key={`COMMENT_KEY_${index}`}>
            <Comment
              data={comment}
              key={comment._id}
              type={"comment"}
              author={props.author?.id}
              expert={props.expert}
              parentId={comment._id}
              handleShowModal={(isShown) => {props.handleShowModal(isShown)}}
              handleLoadComments={() => {props.handleLoadComments()}}
            >
              {comment.text}
            </Comment>
            {
              comment.answers?.length && (
                <div className="reply-list">
                  {
                    !showReplies[comment._id] ? (
                      <div className="toggle" onClick={() => {handleShowReply(comment._id)}}>
                        View
                        {
                          comment.answers.length === 1 ? (
                            " " + comment.answers.length + " reply"
                          ) : (
                            " all " + comment.answers.length + " replies"
                          )
                        } &nbsp;
                        <Glyphicon glyph = "chevron-down" />
                      </div>
                    ) : (
                      <div className="toggle" onClick={(e) => {handleShowReply(comment._id)}} >
                        {
                          comment.answers.length === 1 ?
                            'Hide reply' :
                            'Hide replies'
                        }
                        &nbsp;
                        <Glyphicon glyph="chevron-up" />
                      </div>
                    )
                  }
                  <Panel id="collapsible-panel-example-1" expanded={ showReplies[comment._id] }>
                    <Panel.Collapse>
                      <Panel.Body>
                      {
                        comment.answers?.map(answer => (
                          <Comment
                            key={ answer._id }
                            type={ 'answer' }
                            data={ answer }
                            author={ props.author }
                            expert={ props.expert }
                            parentId={ comment._id }
                            handleShowModal={ props.handleShowModal }
                            handleLoadComments={ props.handleLoadComments }
                          >
                            { answer.text }
                          </Comment>
                        ))
                      }
                      </Panel.Body>
                    </Panel.Collapse>
                  </Panel>
                </div>
              )
            }
          </div>
        ))
      }
    </div> 
  );
};

export default CommentList;
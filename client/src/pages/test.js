import React, {useState} from 'react';

// import CommentBox from '../components/comment/CommentBox';

const Test = props => {
    const [state, ] = useState({
        expert: 'mohit-rv',
        email: '2@2.co',
        expertEmail: 'mohit-rv@rvtechnologies.co.in',
    });
    return(
        <div className="comment">
            <h1>TEST{state.expert}</h1>
        </div>
    );
};

export default Test;
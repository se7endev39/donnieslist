import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

const RequireAuth = ComposedPage => {
    const Authentication = props => {
        const {authenticated} = useSelector(state => state.auth);
        const history = useHistory();
    
        useEffect(() => {
            if(!authenticated)
                history.push('/login'); 
        }, [authenticated, history]);
        
        return (
            <>
                <ComposedPage />
            </>
        );
    }
    return Authentication;
};

export default RequireAuth;


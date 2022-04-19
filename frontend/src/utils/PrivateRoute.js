import { Route, Navigate } from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function PrivateRoute({children, ...rest}) {

    let {user} = useContext(AuthContext);
    const isAuthenticated = false;

    return !isAuthenticated ? <Navigate to ='/user/login' /> : children 
}

export default PrivateRoute;
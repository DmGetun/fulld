import { Route, Navigate, useLocation } from 'react-router-dom'
import { useContext, useNavigate } from 'react';
import AuthContext from '../context/AuthContext';

function PrivateRoute({children, ...rest}) {

    let {user} = useContext(AuthContext);
    const location = useLocation();
    const isAuthenticated = user ? true : false;

    return !isAuthenticated ? <Navigate to ='/user/login' state={{from: location}} /> : children 
}

export default PrivateRoute;
import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext(); 

export default  AuthContext;


export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    let [loading,setLoading] = useState(true);

    let loginUser = async(e) => {
        let username = e.target.username.value;
        let password = e.target.password.value;
        e.preventDefault();
        let response = await fetch('http://localhost:8000/api/token', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username' : username,'password': password})
        })
        let data = await response.json();

        if( response.status === 200 ){
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens',JSON.stringify(data));
        }else {
            alert("asd");
        }
    }

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    }

    let updateToken = async ()=> {
        console.log('Updated token!');
        let response = await fetch('http://localhost:8000/api/token/refresh', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': authTokens?.refresh})
        })
        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens',JSON.stringify(data));
        } else {
            logoutUser();
        }

        if(loading) {
            setLoading(false);
        }
    } 

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser: loginUser,
        logoutUser:logoutUser,
    } 

    useEffect(() => {

        if(loading){
            updateToken();
        }

        let fourMinutes = 1000 * 60 * 4;
        let interval =  setInterval(() => {
            if(authTokens){
                updateToken();
            }
        }, fourMinutes)
        return () => clearInterval(interval);

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
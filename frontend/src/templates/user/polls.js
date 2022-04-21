
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
function Polls(props) {
    
    let {authTokens, user} = useContext(AuthContext);

    async function get_add_polls() {
        const apiURL = 'http://127.0.0.1:8000/polls'
        let response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + String(authTokens?.access) 
            },
            body: JSON.stringify({'username': user.user_id})
        })

        let data = await response.json();
        console.log(JSON.parse(data));
    }

    useEffect(() => {
        get_add_polls();
    }, [])

}

export default Polls;
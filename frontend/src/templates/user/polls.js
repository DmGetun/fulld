
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import PollCard from "./PollCard";
import { API_URL_GET_USER_POLLS } from "../static/constants";
function Polls(props) {
    
    let {authTokens, user} = useContext(AuthContext);

    const [polls, setPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function get_add_polls() {
        const apiURL = API_URL_GET_USER_POLLS
        let response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + String(authTokens?.access) 
            },
            body: JSON.stringify({'username': user.user_id})
        })

        let data = await response.json();
        if(response.status === 200) {
            setPolls(JSON.parse(data));
            setIsLoading(true);
        }
        console.log(JSON.parse(data));
    }

    useEffect(() => {
            get_add_polls();
        
    }, [])

    return (
        <div>
        {
            isLoading ?
            polls.map(poll => (
                <PollCard title={poll.title} questions={poll.questions} slug={poll.slug} />
            ))
            : <h1>loading...</h1>
        }
        </div>
    )

}

export default Polls;
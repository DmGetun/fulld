
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import PollCard from "./PollCard";
import {API_URL_RESULT_POLL} from "../static/constants";
import { useParams } from "react-router";
import { cryptoSurvey } from "../../CryptoModule/cryptoSurvey";
function ResultPoll(props) {
    
    let {authTokens, user} = useContext(AuthContext);

    const [polls, setPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isNull, setIsNull] = useState(false);
    let params = useParams();
    let slug = params.slug;

    async function get_add_polls() {
        const apiURL = API_URL_RESULT_POLL + slug + '/';
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
            let polls = JSON.parse(data);
            console.log(polls)
            if (polls.length === 0) { 
                setIsNull(true);
                return;
            }
            setPolls(polls);
            setIsLoading(true);
        }
    }

    useEffect(() => {
            get_add_polls();
    }, [])

    return (
        <div>
        {
            isNull ? <h1 align='center'>У вас нет созданных опросов</h1> 
            : isLoading ?

                <PollCard title={polls.title} questions={polls.questions} />
            
            : <h1>loading...</h1>
        }
        </div>
    )

}

export default ResultPoll;
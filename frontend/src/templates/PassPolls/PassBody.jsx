import axios from 'axios';
import { Route, useParams } from "react-router";
import { Container } from "reactstrap";
import PassPollBody from './PassPollBody'
import { useState, useEffect } from "react";
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { API_URL_TAKE_POLL } from '../static/constants';

function PassBody(props) {
  const params = useParams();
  const slug = params.poll;
  const apiURL = API_URL_TAKE_POLL + slug + '/';
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  let {authTokens, logoutUser} = useContext(AuthContext);

  let getPoll = async () => {
      let response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens?.access)
        }
      })

      let data = await response.json();
      if(response.status === 200){
        setItems(data);
        setIsLoaded(true);
      } else if(response.statusText === 'Unauthorized') {
        logoutUser();
      }
  };

  useEffect(() => {
    getPoll();
  }, [])

  let content = 
    <div class="container">
        <div class=" ">
          { isLoaded ? <PassPollBody items={items}/> : <p>Loading...</p>}
        </div>
    </div>

  return content;
}


export default PassBody;

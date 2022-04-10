import axios from 'axios';
import { Route } from "react-router";
import { Container } from "reactstrap";
import PassPollBody from './PassPollBody'
import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";


function PassBody(props) {
  
  const apiURL = 'http://127.0.0.1:8000/get_opros';
  const n = 8;
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(async () => {
      const result = await axios(apiURL);
      setItems(result.data);
      setIsLoaded(true);
  }, []);

  let content = 
    <div class="container">
      <div class="row">
        <div class="col">
          asd
        </div>
        <div class="col-6">
          { isLoaded ? <PassPollBody items={items}/> : <p>Loading...</p>}
        </div>
        <div class="col">
        </div>
      </div>
    </div>

  return content;
}


export default PassBody;

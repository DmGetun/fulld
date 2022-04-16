import axios from 'axios';
import { Route, useParams } from "react-router";
import { Container } from "reactstrap";
import PassPollBody from './PassPollBody'
import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";


function PassBody(props) {
  const params = useParams();
  const slug = params.poll;
  const apiURL = 'http://127.0.0.1:8000/get_opros/' + slug + '/';
  const n = 8;
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(async () => {
      const result = await axios.get(
        apiURL);
      setItems(result.data);
      setIsLoaded(true);
  }, []);

  let content = 
    <div class="container">
        <div class="col-6">
          { isLoaded ? <PassPollBody items={items}/> : <p>Loading...</p>}
        </div>
    </div>

  return content;
}


export default PassBody;

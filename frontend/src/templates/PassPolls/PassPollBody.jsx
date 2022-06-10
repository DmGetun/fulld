import React, { useEffect, useState, useParams,useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import PassQuestionCard from '../General/PassQuestionCard';
import PassTitleField from './PassTitleField';
import Answers from '../General/Answers';
import PassAnswerField from './PassAnswerField';
import { Button } from 'reactstrap';
import axios from 'axios';
import { API_URL_TAKE_POLL } from '../static/constants';
import { cryptoSurvey } from '../../CryptoModule/cryptoSurvey';

function PassPollBody(props) {

    
    let {user, authTokens} = useContext(AuthContext);

    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [isExist, setIsExist] = useState(true);
    let [chooseValues, SetChooseValue] = useState([]);

    const apiURL = API_URL_TAKE_POLL + props.slug + '/';

    let getPoll = async () => {
      let response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens?.access)
        }
      })
      let data = await response.json();
      console.log(data);
      if(response.status === 200){
        setItems(data);
        setIsLoaded(true);
      } 
      else if(response.status === 404) {
        setIsExist(false);
      }
    };

    useEffect(() => {
      getPoll();
    }, [])

    function SetChoose(e) {
      let item = e.target;
      let name = item.name.slice(item.name.indexOf('_') + 1);
      let value = +item.id.slice(-1);
      SetChooseValue({ ...chooseValues,[name]: value });
      console.log(chooseValues);
      console.log(items)
    }

    let title = items.title;
    let questions = items.questions;

  return (
      !isExist ? <h1 align='center'>Указанного опроса не существует</h1> : 
      !isLoaded ? <h1 align='center'>Загрузка...</h1> : 
      <div class="container">
        <h1 align='center'>{ title }</h1>
        <form onSubmit={e => SendPoll(e)}>
         { questions.map((question,question_id) =>
            <PassQuestionCard key={question_id}>
              <PassTitleField Text={question.title} id={question.id} />
              <Answers>
                { questions[question_id]['options'].map((answer,answer_id) => 
                  <PassAnswerField Name={'question_' + question.id} id={answer_id} 
                  Text={answer.title} setChoose={SetChoose} key={answer_id}></PassAnswerField>
                )}
              </Answers>
            </PassQuestionCard>
         )}
          <Button type='submit'>Сохранить</Button>
        </form>
      </div>
)

  async function SendPoll(e) {
    e.preventDefault();
    const apiURL = 'http://localhost:8000/poll/receive'

    let chooses = {
      'user': user.user_id,
      'survey': items.id,
      'chooses': chooseValues
    }
    let experts = 999
    let encryptor = new cryptoSurvey(experts);
    let keys = encryptor.GenerateKey();
    encryptor.SetKey(keys);
    let p2 = JSON.parse(JSON.stringify(chooses));
    let result = encryptor.EncryptSurvey(p2)
    console.log(result)

    let response = await fetch(apiURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens?.access)
      },
      body: JSON.stringify(result)
    })
  }
}

export default PassPollBody;

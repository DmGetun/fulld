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
import { RangeCard } from './RangeCard';
import { QualitativeCard } from './QualitativeCard';
import { QuantitativeCard } from './QuantitativeCard';

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
      console.log(data.questions)
      if(response.status === 200){
        setItems(data);
        setStates(data.questions)
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

    const [states,setStates] = useState(questions)

    function changeAnswer(question){
      if (!!!question) return
      console.log(states)
      setStates(states.map(state => 
        state.order === question.order ? question : state
      ))
    }

    function cardToRender(question){
      let type = question.type;
      if (type === 'qualitative') return <QualitativeCard onChange={changeAnswer} question={question}/>
      if (type === 'quantitative') return <QuantitativeCard onChange={changeAnswer} question={question}/>
      if (type === 'range') return <RangeCard onChange={changeAnswer} question={question}/>
    }

  return (
      !isExist ? <h1 align='center'>Указанного опроса не существует</h1> : 
      !isLoaded ? <h1 align='center'>Загрузка...</h1> : 
      <div class="container">
        <h1 align='center'>{ title }</h1>
        <form onSubmit={e => SendPoll(e)}>
         { questions.map((question,question_id) =>
            cardToRender(question)
         )}
         <div className='center'>
          <Button className='button' type='submit'>Сохранить</Button>
         </div>
        </form>
      </div>
)

  async function SendPoll(e) {
    e.preventDefault();
    const apiURL = 'http://localhost:8000/poll/receive'

    let chooses = {
      'user': user.user_id,
      'survey': items.id,
      'answers': chooseValues
    }
    let experts = 999
    let encryptor = new cryptoSurvey(experts);
    let keys = encryptor.GenerateKey();
    encryptor.SetKey(keys);
    let p2 = JSON.parse(JSON.stringify(chooses));
    console.time('time to decrypt answers')
    let result = encryptor.EncryptSurvey(p2)
    console.timeEnd('time to decrypt answers')
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

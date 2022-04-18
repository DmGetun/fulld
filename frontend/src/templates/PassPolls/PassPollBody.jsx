import React, { useEffect, useState } from 'react';
import PassQuestionCard from '../General/PassQuestionCard';
import PassTitleField from './PassTitleField';
import Answers from '../General/Answers';
import PassAnswerField from './PassAnswerField';
import { Button } from 'reactstrap';
import axios from 'axios';

function PassPollBody(props) {

    let items = props.items;
    let title = items['title'];
    let questions = items['questions'];

    let [chooseValues, SetChooseValue] = useState([]);

    function SetChoose(e) {
      let item = e.target;
      let name = item.name.slice(item.name.indexOf('_') + 1);
      let value = item.id.slice(-1);
      SetChooseValue({ ...chooseValues,[name]: value });
      console.log(chooseValues);
      console.log(items)
    }

    let cards = questions.map((question,question_id) =>
    <PassQuestionCard key={question_id}>
      <PassTitleField Text={question.title} id={question.id} />
      <Answers>
        { questions[question_id]['answers'].map((answer,answer_id) => 
          <PassAnswerField Name={'question_' + question.id} id={answer_id + 1} 
                            Text={answer.title} setChoose={SetChoose} key={answer_id}></PassAnswerField>
        ) }
      </Answers>
    </PassQuestionCard>
   )

  return (
      <div class="container">
        <h1 align='center'>{ title }</h1>
        <form onSubmit={e => SendPoll(e)}>
          {
            cards.map(card => (<div>{card}</div>))
          }
          <Button type='submit'>Сохранить</Button>
        </form>
      </div>
  );

  function SendPoll(e) {
    e.preventDefault();
    const apiURL = 'http://localhost:8000/poll/receive'

    let username = 'dmitry';
    let chooses = {
      'username': username,
      'poll': items.id,
      'chooses': chooseValues
    }
    
    axios({
      method: 'post',
      url: apiURL,
      data: chooses
    })
  }
}

export default PassPollBody;

import CreateQuestionCard from '../General/CreateQuestionCard';
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'reactstrap';
import Answers from '../General/Answers';
import { findDOMNode } from 'react-dom';
import QTitleField from './QTitleField';
import AnswerField from './AnswerField';
import AddAnswerButton from './AddAnswerButton';
import PollTitleField from './PollTitleField';
import AuthContext from '../../context/AuthContext'
import { API_URL_CREATE_POLL } from '../static/constants';

function CreatePoll(props){

  const apiURL = API_URL_CREATE_POLL;
  let {user, authTokens} = useContext(AuthContext);

  // Добавить карточку с вопросом
  const [numberCards,addCard] = useState(1);
  function addNewCard() {
    addCard(numberCards + 1);
    let question = 'question_' + numberCards;
    addAnswer({...countAnswers,[question] : 2});
    setTitleValue({...qTitleValues,[numberCards]: ''});
  }
  
  // Добавить вариант ответа к вопросу
  const [countAnswers, addAnswer] = useState({'question_0' : 2});
  function addNewAnswer(e) {
    let question_id = e.target.id;
    let count = countAnswers[question_id];
    addAnswer({...countAnswers,[question_id] : count + 1});
  }
  
  const [pollTitle, setQuestion] = useState('');

  // Установить название Опроса
  function setPollTitle(e) {
    let title = e.target.value;
    setQuestion(title)
  }

  // Установить название вопроса
  const [qTitleValues, setTitleValue] = useState({});
  function setQuestionTitle(e) {
    let title = e.target.value;
    let id = e.target.id.slice(e.target.id.indexOf('_') + 1);
    setTitleValue({...qTitleValues,[id] :title});
  }

  const [answersValue, setAnswerValue] = useState({});
  function setAnswer(e) {
    let text = e.target.value;
    let name = e.target.name;
    let answer_id = e.target.id;
    setAnswerValue({...answersValue,[name]: {...answersValue[name],[answer_id]: text}})
  }

  let cards = [...Array(numberCards)].map((card,question_id) =>
  <CreateQuestionCard>
    <QTitleField key={question_id} id = {'title_' + question_id} changeValue={setQuestionTitle}/>
    <Answers>
      { [...Array(countAnswers['question_' + question_id])].map((answer,answer_id) => 
        <AnswerField name={question_id} question_id={question_id} id={answer_id} changeValue={setAnswer}></AnswerField>
      ) }
    </Answers>
    <AddAnswerButton id={question_id} onClick={(e) => addNewAnswer(e)}></AddAnswerButton>
  </CreateQuestionCard>
 );


  return (
    <div class="container">
        <div class="">
          <form onSubmit={SendPoll}>  
            <PollTitleField changeValue={setPollTitle}/>
            {cards}
            <div class='add-question-button'>
              <Button onClick={(e) => addNewCard(e)}>Добавить вопрос</Button>
            </div>
            <div class='add-question-button'>
              <Button type='submit'>Сохранить</Button>
            </div>
          </form>
        </div>
    </div>
  );

  async function SendPoll(e) {
    e.preventDefault(); 
    let questions = [];
    let titleValues = Object.values(qTitleValues);
    let answersValues = Object.values(answersValue);

    for(let i = 0; i < numberCards;i++){
      let answers = []
      for(let j = 0; j < countAnswers['question_' + i];j++){
        let answer = {'order': j, 'title': answersValues[i][j]};
        answers.push(answer);
      }
      questions.push({'title': titleValues[i], 'answers': answers});
    }

    let poll = {
      'title': pollTitle,
      'creator': user.user_id,
      'questions':questions
    }

    let response = await fetch(apiURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens?.access)
      },
      body: JSON.stringify(poll)
    })

    let data = await response.json();
    console.log(data)
  }
}

export default CreatePoll;
import CreateQuestionCard from '../General/CreateQuestionCard';
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import Answers from '../General/Answers';
import { findDOMNode } from 'react-dom';
import QTitleField from './QTitleField';
import AnswerField from './AnswerField';
import AddAnswerButton from './AddAnswerButton';
import PollTitleField from './PollTitleField';
import AuthContext from '../../context/AuthContext'

function CreatePoll(props){

  const apiURL = 'http://127.0.0.1:8000/poll/create';
  let {user, authTokens} = useContext(AuthContext);

  const [numberCards,AddCard] = useState(1);
  const [answersCount,AddAnswer] = useState({'question_1': 2});
  const [answers,AddAnswer_] = useState([]);
  const [questionsValue, AddQuestion] = useState({});
  const [pollTitle, ChangePollTitle] = useState();

  const [questions, SetQuestion] = useState([]);

  function SetQuestionTitle(e) {
    let title = e.target.value;
    SetQuestion(...questions,[{'title':title}])
  }

  function AddQuestionAnswer(event) {
    let id = event.target.id;
    let question = answersCount[id];
    AddAnswer({...answersCount,[id]: question + 1})
  }

  function AddNewCard(event) {
    AddCard(numberCards + 1);
    AddAnswer({...answersCount,['question_' + (numberCards + 1)]: 2});
  }

  function ChangeAnswerValue(event) {
    AddAnswer_({...answers,[event.target.id]: event.target.value})
  }

  function ChangeQuestionValue(event) {
    let id = event.target.id;
    AddQuestion({...questionsValue,[id]:event.target.value});
  }

  let cards = [...Array(numberCards)].map((card,question_id) =>
  <CreateQuestionCard AddAnswer={AddAnswer} key={question_id}>
    <QTitleField id={question_id} changeValue={ChangeQuestionValue} key={question_id}/>
    <Answers key='asad2'>
      { [...Array(answersCount['question_'+ (question_id + 1)])].map((answer,answer_id) => 
        <AnswerField id={question_id + 1 + '_' + (answer_id + 1)} changeValue={ChangeAnswerValue} type='text'></AnswerField>
      ) }
    </Answers>
    <AddAnswerButton id={question_id + 1} AddAnswer={AddQuestionAnswer}></AddAnswerButton>
  </CreateQuestionCard>
 );


  return (
    <div class="container">
        <div class="">
          <form onSubmit={SendPoll}>  
            <PollTitleField changeValue={ChangePollTitle}/>
            {cards}
            <div class='add-question-button'>
              <Button onClick={(e) => AddNewCard(e)}>Добавить вопрос</Button>
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
    console.log(answers); // Массив с текстом каждого ответа
    console.log(answersCount); // Массив с количеством ответов для каждого вопроса
    console.log(numberCards); // Количество карт с вопросом

    let poll = {
      'title': pollTitle,
      'creator': user.user_id,
    };
    poll['questions'] = [];
    let questions = {};
    let keys = Object.keys(answers);
    for (let i = 1; i < numberCards + 1; i++) {
      let question_number = 'question_' + i;
      let result = keys.filter(key => key.startsWith(i));
      let answers_t = [];

      for (let i = 1; i < result.length + 1;i++){
        let answer = {"title": answers[result[i - 1]],"order": i};
        answers_t.push(answer);
        console.log(answers_t);
      }
      let qValue = questionsValue[i-1];
      let question = {};
      question['title'] = qValue;
      question['answers'] = answers_t;
      poll['questions'].push(question);
    }
    console.log(poll);
    console.log(questionsValue);
    console.log(user)
    let response = fetch(apiURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens?.access),
      },
      body: JSON.stringify(poll)
    })
  }

}

export default CreatePoll;
import QuestionCardTemplate from './QuestionCardTemplate'
import React, { useState } from 'react';
import { Button } from 'reactstrap';
import '../static/style.css'
import axios from 'axios';

function CreatePoll(){

  const apiURL = '';
  const [Questions,AddQuestion] = useState([]);
  const [Answers, AddAnswers] = useState([]);
  
  updateData = (question,answers) => {
    AddQuestion(question);
    AddAnswers(answers);
  }

  const [numberCards,AddCards] = useState(1);
  let cards = [...Array(numberCards)].map((e, i) => <QuestionCardTemplate holder='Введите вопрос' updateData={UpdateData}/>);

  return (
    <div class="container">
      <div class="row">
        <div class="col">
        </div>
        <div class="col-6">
          <form onSubmit={SendPoll}>
            {cards}
            <div class='add-question-button'>
              <Button onClick={() => AddCards(numberCards + 1)}>Добавить вопрос</Button>
            </div>
            <div class='add-question-button'>
              <Button type='submit'>Сохранить</Button>
            </div>
          </form>
        </div>
        <div class="col">
        </div>
      </div>
    </div>
  );

  function SendPoll(e) {
    e.preventDefault();
    cards.map((card) => {

    })
    axios({
      method: 'post',
      url: apiURL,
      data: {

      }
    })
  }
}

export default CreatePoll;
import QuestionCardTemplate from './QuestionCardTemplate'
import React, { useState } from 'react';
import { Button } from 'reactstrap';
import '../static/style.css'

function QuestionTemplate(){

  const [numberCards,AddCards] = useState(1);
  let card = [...Array(numberCards)].map((e, i) => <QuestionCardTemplate holder='Введите вопрос'/>);

  return (
    <div class="container">
      <div class="row">
        <div class="col">
        </div>
        <div class="col-6">
          {card}
          <div class='add-question-button'>
            <Button onClick={() => AddCards(numberCards + 1)}>Добавить вопрос</Button>
          </div>
        </div>
        <div class="col">
        </div>
      </div>
    </div>
  );
}

export default QuestionTemplate;
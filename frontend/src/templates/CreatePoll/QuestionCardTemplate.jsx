import React, { useState } from 'react';
import { Button } from 'reactstrap';
import '../static/style.css'

function QuestionCardTemplate(props){

    const [AnswersCount,AddAnswer] = useState(2)
    let answers = [...Array(AnswersCount)].map((e, i) => <AnswerField/>);

  return (
    <div class="card question_card">
      <div class="card-body">
          <div>
            <input type='text' placeholder={props.holder} class='mb question-field'/>
          </div>
          <div>
            {answers}
          </div>
        <Button color='link' onClick={() => AddAnswer(AnswersCount + 1)}>
            Добавить ответ
        </Button>
      </div>
    </div>
  )
}

function AnswerField() {
    return(
        <div>
            <input type='text' placeholder="Введите ответ" class='answer-field'/>
        </div>
    );
}

export default QuestionCardTemplate;
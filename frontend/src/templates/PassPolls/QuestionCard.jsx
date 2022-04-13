import React from 'react';
import '../static/style.css'

function QuestionCard(props){
  return (
    <div class="question-card card  question_card ">
      <div class="card-body">
        <h5 class="card-title">{props.title}</h5>
          {props.answers.map((item) =>
           <p class="card-text">{item}</p>
          )}
      </div>
    </div>
  )
}

export default QuestionCard;
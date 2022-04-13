import React, { useState } from 'react';
import { Button } from 'reactstrap';
import '../static/style.css'
import Answers from './Answers';
import AnswerField from './AnswerField';

function QuestionCardTemplate(props){


  return (
    <div class="card question_card question-card">
      <div class="card-body">
          { props.children[0] }
          { props.children[1] }
          { props.children[2] }
      </div>
    </div>
  )
}

export default QuestionCardTemplate;
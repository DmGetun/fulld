import React, { useState } from 'react';

function PassQuestionCard(props){

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

export default PassQuestionCard;
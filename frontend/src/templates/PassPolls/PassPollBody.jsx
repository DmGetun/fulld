import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard'
import PollTitle from '../Cards/PollTitle'

function PassPollBody(props) {
    let items = JSON.parse(props.items);
    let title = items['poll_title'];
    let questions = items['questions'];
    let card = questions.map((item,i) => <QuestionCard key={i} title={item.title} answers={item.answers}/> );

  return (
    <div class="container">
      <div class="row">
        <div class="col">
        </div>
        <div class="col-6">
          {card}
        </div>
        <div class="col">
        </div>
      </div>
    </div>
  );
}


export default PassPollBody;

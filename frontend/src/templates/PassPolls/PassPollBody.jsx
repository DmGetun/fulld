import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard'
import PollTitle from '../Cards/PollTitle'

function PassPollBody(props) {
    let items = props.items;
    let title = items['title'];
    let questions = items['questions'];
    let cards = questions.map((item,i) => <QuestionCard key={i} title={item.title} answers={item.answers}/> );

  return (
    <div class="container">
        <div class="col-6">
          {
            cards.map(card => (<div>{card}</div>))
          }
        </div>
    </div>
  );
}


export default PassPollBody;

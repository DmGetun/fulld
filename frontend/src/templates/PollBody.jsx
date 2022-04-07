import React from 'react';
import QuestionCard from './QuestionCard'

function PollBody() {

  const n = 8;
  let card = [...Array(n)].map((e, i) => <QuestionCard/>);

  return (
    <div class="container">
      <div class="row">
        <div class="col">
          Одна колонка
        </div>
        <div class="col-6">
          {card}
        </div>
        <div class="col">
          Одна колонка
        </div>
      </div>
    </div>
  );
}

export default PollBody;

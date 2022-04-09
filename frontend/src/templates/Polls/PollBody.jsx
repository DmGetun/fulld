import React, { useEffect, useState } from 'react';
import QuestionCard from './QuestionCard'
import PollTitle from '../Cards/PollTitle'

function PollBody() {

  return (
    <div class="container">
      <div class="row">
        <div class="col">
        </div>
        <div class="col-6">
          <PollTitle title={items.poll_title}/>
          {card_}
        </div>
        <div class="col">
        </div>
      </div>
    </div>
  );
}


export default PollBody;

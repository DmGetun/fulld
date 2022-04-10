import React, { useEffect, useState } from 'react';
import QuestionCard from '../PassPolls/QuestionCard'
import PollTitle from '../Cards/PollTitle'

function PollBody(props) {

  return (
    <div class="container">
      <div class="row">
        <div class="col">
        </div>
        <div class="col-6">
          <PollTitle title={props.items.poll_title}/>
        </div>
        <div class="col">
        </div>
      </div>
    </div>
  );
}


export default PollBody;

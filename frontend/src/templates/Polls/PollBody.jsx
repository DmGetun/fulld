import React, { useEffect, useState } from 'react';
import QuestionCard from '../PassPolls/QuestionCard'
import PollTitle from '../Cards/PollTitle'

function PollBody(props) {

  return (
    <div class="container">
          <PollTitle title={props.items.poll_title}/>
    </div>
  );
}


export default PollBody;

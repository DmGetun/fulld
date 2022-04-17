import React, { useEffect, useState } from 'react';
import PassQuestionCard from '../General/PassQuestionCard';
import PassTitleField from './PassTitleField';
import Answers from '../General/Answers';
import PassAnswerField from './PassAnswerField';

function PassPollBody(props) {
    let items = props.items;
    let title = items['title'];
    let questions = items['questions'];

    let [chooseValue, SetChooseValue] = useState([]);

    function SetChoose(e) {
      let name = e.target.name;
      let value = e.target.id.slice(-1);
      SetChooseValue({ ...chooseValue,[name]: value });
      console.log(chooseValue);
    }

    let cards = questions.map((card,question_id) =>
    <PassQuestionCard key={question_id}>
      <PassTitleField Text={card.title} key='asd'/>
      <Answers key='asad2'>
        { questions[question_id]['answers'].map((answer,answer_id) => 
          <PassAnswerField Name={'question_' + (question_id + 1)} id={question_id + 1 + '_' + (answer_id + 1)} 
                            Text={answer.title} setChoose={SetChoose}></PassAnswerField>
        ) }
      </Answers>
    </PassQuestionCard>
   )

  return (
      <div class="container">
        <h1 align='center'>{ title }</h1>
        <form onSubmit={SendPoll}>
          {
            cards.map(card => (<div>{card}</div>))
          }
          <Button type='submit'>Сохранить</Button>
        </form>
      </div>
  );

  function SendPoll() {
    //create a PassPoll API
  }
}


export default PassPollBody;

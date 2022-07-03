import PassQuestionCard from '../General/PassQuestionCard';
import PassTitleField from './PassTitleField';
import Answers from '../General/Answers';
import PassAnswerField from './PassAnswerField';
import { useState } from 'react';

export function QualitativeCard(props) {

    let question = props.question
    let options = question.options
    let onChange = props.onChange


    function changeValue(e){
        let value = +e.target.id + 1
        question['answer'] = value
        onChange(question)
    }
    return (
        <PassQuestionCard key={question.id}>
        <PassTitleField Text={question.title} id={question.id} />
        <Answers>
          { options.map((answer,answer_id) => 
      	<label class='pass-label'>
          <input id={answer_id} type="radio" name={question.id + answer_id} class='pass-input' onChange={e => changeValue(e)}/>
          <span class='pass-span'>{ answer.title }</span>
      </label>
          )}
        </Answers>
      </PassQuestionCard>
    )
}
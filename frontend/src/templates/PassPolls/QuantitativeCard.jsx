import PassQuestionCard from '../General/PassQuestionCard';
import PassTitleField from './PassTitleField';
import Answers from '../General/Answers';
import PassAnswerField from './PassAnswerField';
import { Fragment } from 'react';

export function QuantitativeCard(props) {

    let question = props.question
    let options = question.options

    let minValue = options[1].title
    let maxValue = options[2].title

    let onChange = props.onChange

    function changeValue(e) {
        let answer = +e.target.value
        question['answer'] = answer

        onChange(question)
    }

    return (
        <PassQuestionCard key={question.id}>
        <PassTitleField Text={question.title} id={question.id} />
        <Fragment>
            <div className='center' style={{display: 'inline-block'}}>
                <p>Минимальное значение: {minValue}</p>
                <p>Максимальное значение: {maxValue}</p>
            </div>
        <div class='answer-block'>
          <input required placeholder=' '
          question_id ={props.question_id} name={props.name} onChange={e => changeValue(e)}></input>
          <label>Укажите ответ</label>
        </div>
        </Fragment>
      </PassQuestionCard>
    )
}
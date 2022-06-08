
import cross from '../static/icons/cross.svg';

function AnswerField(props) {
    let src = {cross}
    let changeValue = props.changeValue;
    let id = props.id;
    let type = props.type;
    return(
      <div>
        <div class='answer-block'>
          <input onChange={(e) => changeValue(e)} id={id} type={type} required placeholder=' '
          question_id ={props.question_id} name={props.name}></input>
          <label>Вариант ответа</label>
          <div class='krest'></div>
        </div>
      </div>
    );
}

export default AnswerField;
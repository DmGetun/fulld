import '../static/style.css'

function AnswerField(props) {

    let changeValue = props.changeValue;
    let id = props.id;
    return(
      <div class='input-group'>
        <input onChange={(e) => changeValue(e)} id={id} type='text' class='answer-field' required placeholder=' '></input>
        <label class='answer-label'>Вариант ответа</label>
      </div>
    );
}

export default AnswerField;
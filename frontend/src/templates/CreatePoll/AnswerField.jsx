
function AnswerField(props) {

    let changeValue = props.changeValue;
    let id = props.id;
    let type = props.type;
    return(
      <div class='input-group'>
        <input onChange={(e) => changeValue(e)} id={id} type={type} class='answer-field' required placeholder=' '
        question_id ={props.question_id} name={props.name}></input>
        <label class='answer-label'>Вариант ответа</label>
      </div>
    );
}

export default AnswerField;
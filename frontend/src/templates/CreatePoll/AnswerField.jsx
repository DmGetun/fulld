function AnswerField(props) {

    let changeValue = props.changeValue;
    let id = props.id;
    return(
      <input onChange={(e) => changeValue(e)} id={id} type='text' placeholder="Введите ответ" class='answer-field'/>
    );
}

export default AnswerField;
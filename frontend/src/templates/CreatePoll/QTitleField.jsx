function QTitleField(props){

    let changeValue = props.changeValue;
    let id = props.id;
    return(
        <div>
          <input id={id} type='text' onChange={(e) => changeValue(e)} 
          placeholder="Введите вопрос" class='question-field'/>
        </div>
    );
}

export default QTitleField;
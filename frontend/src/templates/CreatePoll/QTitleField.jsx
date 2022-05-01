function QTitleField(props){

    let changeValue = props.changeValue;
    let id = props.id;
    return(
        <div class='title-block'>
          <input id={id} type='text' onChange={(e) => changeValue(e)} 
            placeholder=" "/>
          <label>Название вопроса</label>
        </div>
    );
}

export default QTitleField;
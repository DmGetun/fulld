function PollTitleField(props) {

    let changeValue = props.changeValue;

    return(
        <input onChange={(e) => changeValue(e)} class="form-control form-control-lg" 
        type="text" placeholder="Введите название опроса"></input>
    );

}

export default PollTitleField;
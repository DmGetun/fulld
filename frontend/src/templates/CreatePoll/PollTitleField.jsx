function PollTitleField(props) {

    let changeValue = props.changeValue;

    return(
        <div class="card question_card question-card">
          <div class='card-body'>
            <div class="poll-title">
              <input onChange={(e) => changeValue(e)} type="text" placeholder=" "></input>
              <label>Название опроса</label>
            </div>
          </div>
        </div>
    );

}

export default PollTitleField;
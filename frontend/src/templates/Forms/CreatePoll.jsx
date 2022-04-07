
function CreatePoll(){
    
    const n = 8;
    let cards = [...Array(n)].map((e, i) => <QuestionCard/>);
  
    return (
      <div class="container">
        <div class="row">
          <div class="col">
            Одна колонка
          </div>
          <div class="col-6">
            {cards}
          </div>
          <div class="col">
            Одна колонка
          </div>
        </div>
      </div>
    );       
}

export default CreatePoll;
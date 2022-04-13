import CreatePoll from "./CreatePoll";


function CreatePollBody(props) {

  let content = 
    <div class="container">
      <div class="row">
        <div class="col">
        </div>
        <div class="col-12">
            <CreatePoll />
        </div>
        <div class="col">
        </div>
      </div>
    </div>

  return content;
}


export default CreatePollBody;

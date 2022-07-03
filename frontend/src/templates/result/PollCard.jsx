import { Button } from 'reactstrap';

function PollCard(props) {

    let question = props.question
    return (
        <div class="card question_card question-card">
          <div class="card-body">
                <h1 class="text-dark">{question.title}</h1>
                <div>
                    {
                        question.options.map((question) => 
                            <h4 class="text-dark">{question.title} </h4> 
                        )
                    }
                </div>
          </div>
        </div>
    );
}

export default PollCard;
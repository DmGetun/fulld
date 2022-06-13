import { Button } from 'reactstrap';

function PollCard(props) {

    return (
        <div class="card question_card question-card">
          <div class="card-body">
                <h1 class="text-dark">{props.title}</h1>
                <div>
                    {
                        props.questions.map(question => (
                            <h4 class="text-dark">{question.title} {question.sum}</h4>
                        ))
                    }
                </div>
          </div>
        </div>
    );
}

export default PollCard;
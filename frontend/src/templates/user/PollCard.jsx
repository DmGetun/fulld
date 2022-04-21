import { Button } from 'reactstrap';

function PollCard(props) {

    return (
        <div class="card question_card question-card">
          <div class="card-body">
                <h1 class="text-dark">{props.title}</h1>
                <div>
                    {
                        props.questions.map(question => (
                            <h4 class="text-dark">{question.title}</h4>
                        ))
                    }
                </div>
                <Button onClick={() => window.location.assign("/opros/" + props.slug + '/')}>Подробнее</Button>
          </div>
        </div>
    );
}

export default PollCard;
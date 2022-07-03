import { Button } from 'reactstrap';
import AddQuestionButton from '../CreatePoll/AddQuestionButton';

function PollCard(props) {

    let question = props.question
    return (
        <div class="card question_card question-card">
          <div class="card-body">
                <h1 class="text-dark">{question.title}</h1>
                <div>
                {
                    question.type === 'quantitative' ?
                    <QuantitativeCard question={question}/> : 
                    <QualitativeCard question={question}/> 
                }
                </div>
          </div>
        </div>
    );

    function QualitativeCard(props) {
        let question = props.question
        return (
            question.options.map((question,q_id) => 
            <h4 class="text-dark">{question.title}: {question.result[q_id]} </h4> 
        )
        )
    }

    function QuantitativeCard(props) {
        let question = props.question   
        return (
            question.result
        )

    }
}

export default PollCard;
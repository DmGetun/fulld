import { Button } from 'reactstrap';

function AddQuestionButton(props) {

    let id = 'question_' + props.id;
    let addQuestion = props.onClick;
    let name = props.type;
    return(
        <div class='add-question-button'>
            <Button onClick={(e) => addQuestion(e)} name={name}>
                Добавить {name !== 'Quantitative' ? 'количественный' : 'качественный'} вопрос
            </Button>
        </div>
    );
}

export default AddQuestionButton;
import { Button } from 'reactstrap';

function AddAnswerButton(props) {

    let id = 'question_' + props.id;
    let addAnswer = props.AddAnswer;
    return(
        <Button id={id} color='link' onClick={(e) => props.AddAnswer(e) }>
            Добавить ответ
        </Button>
    );
}

export default AddAnswerButton;
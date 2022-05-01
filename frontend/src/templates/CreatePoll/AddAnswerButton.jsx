import { Button } from 'reactstrap';

function AddAnswerButton(props) {

    let id = 'question_' + props.id;
    let addAnswer = props.onClick;
    return(
        <Button id={id} color='link' className='add-answer-button' onClick={(e) => addAnswer(e) }>
            Добавить ответ
        </Button>
    );
}

export default AddAnswerButton;
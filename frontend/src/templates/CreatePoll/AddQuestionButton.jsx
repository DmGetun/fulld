import { Button } from 'reactstrap';
import './buttons.scss'

function AddQuestionButton(props) {

    let id = 'question_' + props.id;
    let addQuestion = props.onClick;
    let name = props.type;
    return(
            <a className='btn btn-white btn-animate' onClick={(e) => addQuestion(e)} name={name}>
                Добавить {name !== 'Quantitative' ? 'количественный' : 'качественный'} вопрос
            </a>
    );
}

export default AddQuestionButton;
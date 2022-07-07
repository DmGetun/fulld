import { Button } from 'reactstrap';
import './save.css'

function AddQuestionButton(props) {

    let id = 'question_' + props.id;
    let addQuestion = props.onClick;
    let name = props.type;
    return(
            <a  className='button blue' onClick={(e) => addQuestion(e)} name={name}>
                Добавить {
                name === 'quantitative' ? 'качественный' : 
                (name === 'range' ? 'ранжированный' : 
                'количественный')
                } вопрос
            </a>
    );
}

export default AddQuestionButton;
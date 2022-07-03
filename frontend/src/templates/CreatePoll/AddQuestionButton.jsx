import { Button } from 'reactstrap';
import './buttons.scss'

function AddQuestionButton(props) {

    let id = 'question_' + props.id;
    let addQuestion = props.onClick;
    let name = props.type;
    return(
            <a className='btn-white btn-save btn-animate' onClick={(e) => addQuestion(e)} name={name}>
                Добавить {
                name === 'quantitative' ? 'качественный' : 
                (name === 'range' ? 'ранжированный' : 
                'количественный')
                } вопрос
            </a>
    );
}

export default AddQuestionButton;
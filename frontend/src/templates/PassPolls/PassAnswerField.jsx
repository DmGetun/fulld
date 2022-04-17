import '../static/style.scss';

function PassAnswerField(props) {

    let id = props.id;
    let text = props.Text;
    let name = props.Name;
    let setChoose = props.setChoose;
    return(
      	<label class='pass-label'>
            <input id={id} type="radio" name={name} class='pass-input' onChange={e => setChoose(e)} />
            <span class='pass-span'>{ text }</span>
        </label>
    );
}

export default PassAnswerField;
function PollCard(props) {

    let question = props.question
    if (question === undefined) return
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
}

export function QualitativeCard(props) {
    let question = props.question
    return (
        question.options.map((option,q_id) => 
        <h4 class="text-dark">{option.title}: {question['result'][q_id + 1]} </h4> 
    )
    )
}

export function QuantitativeCard(props) {
    let question = props.question   
    return (
        <h2>Средняя оценка: {question.result}</h2>
    )

}

export default PollCard;
export function PassQuestionCard(props) {

    q_id = props.question_id
    question = props.question
    return (
        <PassQuestionCard key={question_id}>
        <PassTitleField Text={question.title} id={question.id} />
        <Answers>
          { questions[question_id]['options'].map((answer,answer_id) => 
            <PassAnswerField Name={'question_' + question.id} id={answer_id} 
            Text={answer.title} setChoose={SetChoose} key={answer_id}></PassAnswerField>
          )}
        </Answers>
      </PassQuestionCard>
    )
}
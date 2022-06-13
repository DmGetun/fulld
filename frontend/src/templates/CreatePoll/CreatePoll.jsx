import CreateQuestionCard from '../General/CreateQuestionCard';
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'reactstrap';
import Answers from '../General/Answers';
import { findDOMNode } from 'react-dom';
import QTitleField from './QTitleField';
import AnswerField from './AnswerField';
import AddAnswerButton from './AddAnswerButton';
import PollTitleField from './PollTitleField';
import AuthContext from '../../context/AuthContext'
import { API_URL_CREATE_POLL } from '../static/constants';
import { useNavigate } from 'react-router';
import { cryptoSurvey } from '../../CryptoModule/cryptoSurvey';
import AddQuestionButton from './AddQuestionButton';

function CreatePoll(props){

  const apiURL = API_URL_CREATE_POLL;
  let {user, authTokens} = useContext(AuthContext);

  let qualitative = 'Qualitative'
  let quantitative = 'Quantitative'

  const answerTemplate = [{title: ''},{title: ''}]

  const [questions, addQuestion] = useState([{
    'title': '',
    'options': answerTemplate,
    'type': qualitative
  }]);

  const[survey, AddItem] = useState({
    'title': '',
    'creator': user.user_id,
    'questions' : questions
  });

    // Установить название Опроса
    function setPollTitle(e) {
      let title = e.target.value;
      AddItem({...survey, title: title});
    }

    // Установить название вопроса
    function setQuestionTitle(e) {
      let title = e.target.value;
      let id = parseInt(e.target.id.slice(e.target.id.indexOf('_') + 1));
      addQuestion(questions.map((question, q_id) => 
        q_id === id ? {...question,title:title} : question ));
    }

    // Добавить карточку с вопросом
    function addNewQualitativeCard(e) {
      addQuestion([...questions,{title: '', options: answerTemplate, type:qualitative}])
    }

    function addNewQuantitativeCard(e) {
      addQuestion([...questions,{title:'',type: quantitative, options:[] }])
    }

    // Добавить вариант ответа к вопросу
    function addNewAnswer(e) {
      let question_id = +e.target.id.slice(e.target.id.indexOf('_') + 1);
      addQuestion(questions.map((question,q_id) => 
      question_id === q_id && question.type !== quantitative ? 
      {...question, options: [...question['options'],{title: ''}]} : question))
    }

    // Добавить текст ответа в поле ответа
    function setAnswer(e) {
      let text = e.target.value;
      let name = +e.target.name; // question id
      let answer_id = +e.target.id;
      addQuestion(questions.map((question, q_id) => 
      name === q_id ? {...question, options: question.options.map((answer,id) => 
        answer_id === id ? {...answer, title: text} : answer) } : question ))
    }

  let cards = questions.map((card,question_id) =>
  <CreateQuestionCard>
    <QTitleField key={question_id} id = {'title_' + question_id} changeValue={setQuestionTitle}/>
    <Answers>
      { card['options'].map((answer,answer_id) => 
        <AnswerField name={question_id} question_id={question_id} id={answer_id} changeValue={setAnswer}></AnswerField>
      ) }
    </Answers>
    {card.type === qualitative ?
    <AddAnswerButton id={question_id} onClick={(e) => addNewAnswer(e)}></AddAnswerButton>
    : ''
    }
  </CreateQuestionCard>
 );

  return (
    <div class="container">
        <div class="">
          <form onSubmit={SendPoll}>  
            <PollTitleField changeValue={setPollTitle}/>
            {cards}
            <div className='add-button-group'>
              <AddQuestionButton onClick={addNewQuantitativeCard} type={qualitative}></AddQuestionButton>
              <AddQuestionButton onClick={addNewQualitativeCard} type={quantitative}></AddQuestionButton>
            </div>
            <div className='button-center'>
              <Button type='submit' className=''>Сохранить</Button>
            </div>
          </form>
        </div>
    </div>
  );

  async function SendPoll(e) {
    e.preventDefault(); 
    
    survey['questions'] = questions.map((question,q_id) => ({...question, order: q_id + 1, 
    options: question['options'].map((answer,id) => ({...answer,order: id + 1}))}))

    survey['experts_number'] = 999
    let encryptor = new cryptoSurvey();
    let keys = encryptor.GenerateKey();
    survey['keys'] = {
      'public_key': keys.public_key.toString(16), 
      'public_exponent': keys.public_exponent.toString(16),
      'private_key': keys.private_key.toString(16),
      'private_exponent': keys.private_exponent.toString(16)};
    console.log(survey)
    localStorage.setItem(`${survey.title}`,JSON.stringify({'private_key': keys.private_key.toString(16),
    'private_exponent': keys.private_exponent.toString(16)}))
    
    let response = await fetch(apiURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens?.access)
      },
      body: JSON.stringify(survey)
    })

    let data = await response.json();
    if(response.status === 200) {
      console.log(data);
    }
  }
}

export default CreatePoll;
import PassQuestionCard from '../General/PassQuestionCard';
import PassTitleField from './PassTitleField';
import Answers from '../General/Answers';
import PassAnswerField from './PassAnswerField';
import { useState } from 'react';

export function RangeCard(props) {

    let question = props.question
    let options = question.options

    

    const [cardList,setCardList] = useState([
        {id:1,order:1,text:'Карточка1'},
        {id:2,order:2,text:'Карточка2'},
        {id:3,order:3,text:'Карточка3'},
        {id:4,order:4,text:'Карточка4'},
      ])
     
      const [currentCard, setCurrentCard] = useState(null)
     
      function dragStartHandler(e,card){
         setCurrentCard(card)
      }
      function dragEndHandler(e){
       e.target.style.background = 'white'
      }
      function dragOverHandler(e){
       e.preventDefault()
       e.target.style.background = 'lightgray'
      }
      function dragDropHandler(e,card){
       e.preventDefault()
       changeValue()
       setCardList(cardList.map(c => {
         if (c.id === card.id) {
           return {...c,order: currentCard.order}
         }
         if (c.id === currentCard.id) {
           return {...c,order: card.order}
         }
         return c
       }))
       e.target.style.background = 'white'
      }
     
      const sortCards = (a,b) => {
       if (a.order > b.order) {
         return 1;
       }
       return -1;
      }

      let onChange = props.onChange

      function changeValue() {
          let id_list = cardList.map(card => card.id)
          question['answer'] = id_list
          onChange(question)
      }

    return (
        <PassQuestionCard key={question.id}>
        <PassTitleField Text={question.title} id={question.id} />
        <Answers>
        {
          cardList.sort(sortCards).map((card,i) =>
            <div 
            draggable={true} className={'card'}
            onDragStart={(e) => dragStartHandler(e, card)}
            onDragLeave={(e) => dragEndHandler(e)}
            onDragEnd={(e) => dragEndHandler(e)}
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dragDropHandler(e, card)}> 
              {i + 1}: {card.text}
            </div>)
        }
        </Answers>
      </PassQuestionCard>
    )
}
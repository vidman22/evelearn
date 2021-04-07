import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import CardEnzoSVG from '../../assets/svg/CardEnzoSVG';

import './LessonCard.css';

const LessonCard = (props) => {
    const dateToFormat = props.created;
    const classuniqid = props.classuniqid
    let link;
    if (classuniqid){
      link = `/${props.activeurl}/${props.uniqid}/${classuniqid}`
    } else {
      link = `/${props.activeurl}/${props.uniqid}`
    }
    return (
      
        <Link className="LessonCardTab" to={link}>
          <div className="LessonCardContainer">
            <div className="LessonCardTitle">
              <h1 id="LessonCardInner">{props.title}</h1>
            </div>
          
          <CardEnzoSVG classname={"QuizIcon"}/>
          <div className="CardSentences">
            <p id="smallTitle">{props.title}</p>
            <hr/>
            {props.sentences && props.sentences.map((sentence, idx) => {
                	const index = sentence.sentence.indexOf(sentence.answer); 
                  const index2 = index + sentence.answer.length;
                
                  let s1 = index === 0 ? null : sentence.sentence.slice(0, index);
        
                  if (s1){
                   if (s1.indexOf('.') !== -1 ){
                     
                     s1 = s1.slice(s1.indexOf('.')+1); 
                   }
                  }
                  const s2 = sentence.sentence.slice(index2, sentence.sentence.length);
              if (idx < 2){
                return (
                <div key={idx} className="CardSentenceInline">
                  <p id="smallOrdinal">{idx +1}.</p>
                  <p id="smallFirstSentence">{s1}</p>
                  <p id="smallHint" style={{textDecoration: "underline"}}>{sentence.hint}</p>
                  <p id ="smallSeconSentence">{s2 && s2}</p>
                </div>
                )
              } else return null;
            }) }
          </div>
        <div className="BottomSegment">
            
            
        
          <div className="LessonCardAuthor">
              {props.author}
          </div>
          <div className="CreatedCardDate">
              <Moment format="MMM Do" date={dateToFormat} />
          </div>
        </div>
        </div>
        </Link>
    )
}

export default LessonCard;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter} from 'react-router';
import { Query, graphql } from 'react-apollo';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlusCircle,faStar,faShareSquare, faTimes} from '@fortawesome/free-solid-svg-icons';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import CreateQuiz from '../CreateQuiz/CreateQuiz';
import DeleteModal from '../../components/Modals/DeleteModal/DeleteModal';
import Sentence from '../../components/Sentence/Sentence';
import * as actionTypes from '../../store/actionTypes';

import './Quiz.css';



const QUIZ = gql`
  query($uniqid: String!){
    quiz(uniqid: $uniqid ) {
      id
      uniqid
      title
      username
      authorID
      sentences{
        alts
        answer
        hint
        sentence
      }
    }
  }
`;


class Quiz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      answers: [],
      id: null,
      title: '',
      sentences: [],
      editMode: false,
      wordBank: false,
      deleteModal: false,
      uniqid: '',
    }
    
  }

 componentDidMount() {
        window.scrollTo(0, 0);
}

  inputChangedHandlerX(e, index){
    const updatedSentences = [...this.state.sentences];

    const updatedSentence = {
      ...updatedSentences[index]
    }

    updatedSentence.value = e.target.value;
    updatedSentence.checked = '';
    updatedSentences[index] = updatedSentence;

    this.setState({
      sentences: updatedSentences,
    })
  }

  handleCheckX(e, index) {
    e.preventDefault();
    const updatedSentences = [...this.state.sentences];


    const updatedSentence = {
      ...updatedSentences[index]
    }

    const value = updatedSentence.value.trim().toLowerCase();
    const answer = updatedSentence.answer.trim().toLowerCase();
    const alts = updatedSentence.alts;
    updatedSentence.checked =  'incorrect';
    if ( value === answer ) {
      updatedSentence.checked =  'correct';
      this.updateWordBank(index);
    } else if (alts.length !== 0 && alts !== undefined) {
        for (let i = 0; i < alts.length; i++) {
          if ( value === alts[i].trim().toLowerCase()) {
            updatedSentence.checked =  'correct';
            this.updateWordBank(index);
            break;
          }
        }
      }

    updatedSentences[index] = updatedSentence;

    this.setState({
      sentences: updatedSentences,
    });
  } 

  back() {
      this.props.history.push('/');
  }

  editMode(){
    if (this.props.user && this.props.user.id === this.state.authorID ){
      this.setState( prevState => {
        return {editMode: !prevState.editMode }
      });
    } 
  }

  submitTest(){
    
    let numCorrect = 0;
    let indices = [];
    const updatedSentences = [...this.state.sentences];
    for (let i = 0; i < this.state.sentences.length; i++){

      const updatedSentence = {
        ...updatedSentences[i]
      }
  
      const value = updatedSentence.value.trim().toLowerCase();
      const answer = updatedSentence.answer;
      const alts = updatedSentence.alts;
  
      if ( value === answer ) {
        numCorrect++;
        indices.push(i);
        updatedSentence.checked =  'correct';
      } else if (alts.length !== 0 && alts !== undefined) {
        updatedSentence.checked =  'incorrect';
          for (let j = 0; j < alts.length; j++) {
            if ( value === alts[j]) {
              numCorrect++;
              indices.push(i);
              updatedSentence.checked =  'correct';
              break;
            }
          }
        } else {
          updatedSentence.checked =  'incorrect';
      }
      updatedSentences[i] = updatedSentence;
    }
    this.setState({
      sentences: updatedSentences,
    });
    const quizUID = this.props.match.params.id;
    const classUID = this.props.match.params.class;
    const userUID = this.props.user.userID;
    this.testSubmission(quizUID, classUID, userUID,  indices, numCorrect, this.state.sentences.length, "quiz");
    console.log("numCorrect", `${numCorrect}/${this.state.sentences.length}`)
  }

  requestEdit() {
    console.log('edit requested');
  }

  completed(data) {
    
    const title = data.quiz.title;
    let sentences = data.quiz.sentences;
    let answers = [];
    sentences = sentences.map((sentence, index) => {
      let rObj = {
        alts : sentence.alts,
        answer : sentence.answer,
        hint : sentence.hint,
        sentence : sentence.sentence,
        value : '',
        checked : '',
      }
      const aObj = {
        value: sentence.answer,
        used: false,
        index
      }
      answers.push(aObj);
      return rObj;
    });
    answers = this.shuffle(answers);
    this.setState({
      authorID : data.quiz.authorID, 
      uniqid: data.quiz.uniqid,
      answers,
      sentences,
      title,
      id: data.quiz.id
    });
  }

  shuffle(array) {
    let i = 0,
        j = 0,
        temp = null
  
    for ( i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array;
  }

  updateWordBank(index) {

    const updatedAnswers = [...this.state.answers];
  
    for (let i = 0; i < updatedAnswers.length; i++) {
      const answerObject = updatedAnswers[i];
      // eslint-disable-next-line
      if (index == answerObject.index) {
        answerObject.used = true;
        updatedAnswers[i] = answerObject;
      }
    }

    this.setState({
      answers: updatedAnswers
    });
  }

  toggleWordBank() {
    this.setState( prevState => {
      return { wordBank: !prevState.wordBank}
    })
  }

  toggleDeleteModal() {

    this.setState( prevState => {
      return { 
        deleteModal: !prevState.deleteModal,
        
        }
    })
  }

  handleDelete(type) {
    console.log('delete fired');
    if (type){
      this.deleteQuiz(this.state.id);
    }
    this.toggleDeleteModal();
  }


  render() {
    let userCanEdit;
    const sentences = [];
    for (let key in this.state.sentences) {
      sentences.push({
          id: key,
          config: this.state.sentences[key]
      });
    }
    
    return (
      <div>
      {this.state.deleteModal ? <DeleteModal show={this.state.deleteModal} modalmessage='delete the quiz?' togglemodal={() => this.toggleDeleteModal()} onclick={(type) => this.handleDelete(type)}/> : null}
      {!this.state.editMode ? (
      
      <Query 
      query={QUIZ}
      variables={{uniqid: this.props.match.params.id}}
      fetchPolicy='network-only'
      onCompleted={data => this.completed(data)}>
      {({ loading, error, data}) => {
        if (loading)  return <div className="spinner spinner-1"></div>;
        if (error) return <span>Something went wrong. Please try again later.</span>;
        if (this.props.user){
          userCanEdit = this.props.user.id === data.quiz.authorID;
        } 
        return (
          
           <div className="LessonSentencesWrapper">
            <button className="BackButtonLesson" onClick={() => this.back()}>Back</button>
            { this.props.user ? <div className="LessonAwesomeOptions">
             <div className="LessonAwesomeIcons" id="lessonadd"> <FontAwesomeIcon   onClick={() => this.toggleAddClassModal()} size="2x" color="#ccc" icon={faPlusCircle} /><span className="QuizToolTip">Add to Class</span></div>
             <div className="LessonAwesomeIcons" id="lessonstar"> <FontAwesomeIcon   onClick={() => this.toggleAddClassModal()} size="2x" color="#ccc" icon={faStar} /><span className="QuizToolTip">Favorite</span></div>
             <div className="LessonAwesomeIcons" id="lessonshare"> <FontAwesomeIcon   onClick={() => this.toggleAddClassModal()} size="2x" color="#ccc" icon={faShareSquare} /><span className="QuizToolTip">Share</span></div>
              { userCanEdit ? <div className="LessonAwesomeIcons" id="lessondelete"><FontAwesomeIcon    onClick={() => this.toggleDeleteModal()} size="2x" color="#ccc" icon={faTimesCircle} /> <span className="QuizToolTip">Delete Class</span></div> : null}
              </div> : null}
                  <div className="LessonTitle">
                    <h1>{data.quiz.title}</h1>
                    <h4>{data.quiz.username}</h4>
                  </div>
          <div className="LessonTab">
            
           <div className="LessonOptions">
            
                {!this.props.test ? <div className="HomeFlex">
                  
                  <Link to={`/solo-play/${this.props.match.params.id}`} onClick={() => this.props.sendLesson(data.quiz)} >
                    Solo Play
                  </Link>
                 
                  <Link to={`/host-game/${this.props.match.params.id}`} onClick={() => this.props.sendLesson(data.quiz)} >
                     
                     Host Game
                    
                 </Link>
                 
                 <div onClick={() => this.toggleWordBank()}>
                  Word Bank
                 </div>

                {userCanEdit ? <div onClick={() => this.editMode()}>
                  Edit Quiz
                </div> 
                : 
                <div onClick={() => this.requestEdit()}>
                  Request Edit
                </div> }

                </div> : null}
                {this.state.wordBank ? <div className="WordBank">
            
                <h2>Word Bank</h2>
                <FontAwesomeIcon onClick={() => this.toggleWordBank()} className="WordBankTimes" icon={faTimes} size="lg" />
                {this.state.answers.map((answer, index) => (
                  <div className="WordBankAnswer" key={index}>
                    {answer.used ? (
                      <div className="UsedWord"><p>{answer.value}</p></div>
                      ) : (
                      <div className="UnusedWord"><p>{answer.value}</p></div>
                      )}
                  </div>
                  ))}
                </div> : null}
                
                  {sentences.map((sentence, index) => (
                    <div className="LessonSentence" key={sentence.id}>
                      <p>{index + 1}</p>
                      <Sentence 
                        handlechange={(event) => this.inputChangedHandlerX(event, index)}
                        handlesubmit={(e) => this.handleCheckX(e, sentence.id)}
                        value={sentence.config.value}
                        sentence={sentence.config.sentence} 
                        correctanswer={sentence.config.answer}
                        message={sentence.config.checked}
                        testmode={this.props.test}
                        placeholder={sentence.config.hint}
                        onclick={(e)=> this.handleCheckX(e, sentence.id)} />
                        
                    </div>))}
                  {userCanEdit && !this.props.test ? <button onClick={() => this.editMode()} className="CreateButton">Edit</button> : null}
                  {this.props.test ?  <button onClick={() => this.submitTest()} className="CreateButton">Submit Test</button> : null}
                </div>
           </div>
          </div>
        );
     }}
      </Query> ) : <CreateQuiz
                      editmode={this.state.editMode} 
                      back={() => this.editMode()} 
                      sentences={this.state.sentences} 
                      title={this.state.title} 
                      id={this.state.id}
                      togglemodal={this.props.togglemodal} />}</div>

      )
  }

testSubmission = async (quizUID, classUID, userUID, indices, numCorrect, length) => {
  await this.props.testSubmission({
    variables : {
      quizUID,
      classUID,
      userUID,
      indices,
      numCorrect,
      length
    },
    update: (cache, {data: {testSubmission}}) => {

      let alreadyTaken = false;
        const classQuizzes = cache.readQuery({
          query: CLASS_QUIZZES, variables: {classID: classUID, offset: 0}
        });
        let update = classQuizzes.classQuizzes;
       
        for (let i = 0; i < update.length; i++){
          if (update[i].uniqid === quizUID){
            if (update[i].scores) {
             
              for (let j = 0; j < update[i].scores[j].length; j++){
                if (update[i].scores[j].userID === userUID) {
                  
                  alreadyTaken = true;
                  break;
                }
              }
              if (!alreadyTaken){
                update[i].scores.concat([testSubmission]);
              } 
            } else {
              
              update[i].scores = testSubmission;
            }
          }
        }
        if (alreadyTaken){
          console.log("looks like you've already taken the test");
        }
        
        cache.writeQuery({
          query: CLASS_QUIZZES,
          variables: {classID: classUID, offset: 0}, 
          data: { classQuizzes : update}
        });
      } 
    
  });
  this.props.history.push(`/class/${classUID}`);
}

  deleteQuiz = async (id) => {
    let authorID = this.props.user.id
    await this.props.deleteQuiz({
      variables: {
        id
      },
      update: (cache) => {
        const data = cache.readQuery({ query : USER_QUIZZES, variables: {authorID}});
				const filtered = data['userQuizzes'].filter( q => q.uniqid !== this.props.match.params.id);
						cache.writeQuery({
							query: USER_QUIZZES,
							variables: {authorID},
							data: {userQuizzes: filtered}
						})
      }
    });
    this.props.history.push('/');
  };
};

const USER_QUIZZES = gql`
  query ( $authorID: Int! ){
    userQuizzes( authorID: $authorID ) {
      title
      username
			authorID
			uniqid
			created_at
    }
  }
`;

const DELETE_LESSON = gql`
  mutation ($id: Int!){
    deleteQuiz(id: $id)
  }
`;

const SUBMIT_TEST = gql`
  mutation TestSubmission($quizUID: String!, $classUID: String!, $userUID: String!, $indices: [Int], $numCorrect: Int, $length: Int, $type: String ){
    testSubmission(quizUID: $quizUID, classUID: $classUID, userUID: $userUID,  indices: $indices, numCorrect: $numCorrect, length: $length, type: $type){
        userID
        username
        indices
        numCorrect
        length
    }
  }
`;
const CLASS_QUIZZES = gql`
  query ClassQuizzes( $classID: String!, $offset: Int ){
    classQuizzes( classID: $classID, offset: $offset ) @client{
		id
    title
    username
		authorID
		uniqid
    updated_at
    scores{
			userID
			username
			indices
			numCorrect
			length
		}
    }
  }
`;

const mapDispatchToProps = dispatch => {
  return {
    sendLesson: (lesson) => dispatch({type: actionTypes.LESSON_SET, lesson:lesson })
  }
}

const mapStateToProps = state => {
  return {
    lesson: state.quiz,
    user: state.user
  }
}

const Container = compose(
  graphql(DELETE_LESSON, { name: 'deleteQuiz' }),
    graphql(SUBMIT_TEST, {name: 'testSubmission' })
  )( withRouter(Quiz));
export default connect( mapStateToProps, mapDispatchToProps )( Container );

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { Query, graphql } from 'react-apollo';
import { gql } from '@apollo/client';

import DeleteModal from '../../components/Modals/DeleteModal/DeleteModal';
import InsertTextButton from '../../components/InsertTextButton/InsertTextButton';
import ReadingOmission from '../../components/ReadingOmission/ReadingOmission';
import OmissionWithOptions from '../../components/ReadingOmissionWithOptions/ReadingOmissionWithOptions';
import ReadingCompQuestion from '../../components/ReadingCompQuestion/ReadingCompQuestion';
import ReadingTable from '../../components/ReadingTable/ReadingTable';
import ReactTimer from '../../components/ReactTimer/ReactTimer';
// import Slate from '../Slate/Slate';
// import StyledWord from '../../components/StyledWord/StyledWord';


import * as actionTypes from '../../store/actionTypes';

import './ReadingLesson.css';

let key = 0;

function getReadingKey(){
  return `reading_${key++}`
}

// const BLOCK_TAGS = {
//     blockquote: 'block-quote',
//     p: 'paragraph',
//     pre: 'code',
//     ul: 'bulleted-list',
//     h1: 'heading-one',
//     h2: 'heading-two',
//     li: 'list-item',
//     ol: 'numbered-list',
//     img: 'img',
//     tr: 'table_row',
//     th: 'table_cell',
//     td: 'table_cell'
//   }
  // Add a dictionary of mark tags.
  // const MARK_TAGS = {
  //   em: 'italic',
  //   strong: 'bold',
  //   u: 'underlined',
  //   span: 'highlight',
  //   code: 'code',
  //   mark: 'insertText',
  //   slot: 'omission',
  //   ins: 'omissionWithOptions'
  // }

class Lesson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeValue: false,
      backgroundColors: [{color: 'white', checked:false}, {color: 'peach', checked:false}, {color: 'blue', checked: false}, {color: 'turquoise', checked: false}],
      backgroundColorSelected: 'white',
      contentState: '',
      checkedAnswers: {},
      checkDisabled: false,
      elements: [],
      hideClass: 'hide0',
      html: null,
      omissions: [],
      questions: [],
      readingSpeeds: [75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 400, 450, 500],
      readingSpeedValue: 75,
      readingSpeedRunning: false,
      readingTimerMinuteValue: '',
      readingTimerSecondValue: '',
      readingStyles: [{kind: 'underline', checked: false}, {kind: 'color', checked: false }, {kind:'highlight', checked: false}],
      scrollY: window.pageYOffset,
      speedReadingIndex: 0,
      showDeleteModal: false,
      textArray: [],
      textTransparency: 0,
      transform: false,
      values: {},

    }
    // eslint-disable-next-line
    // var timerVar;
    this.onOptionCheck = this.onOptionCheck.bind(this);
    this.omWithOptionsRef = React.createRef();
    
  }

  scrollToOmissionRef = () => {
    window.scrollTo(0, this.omWithOptionsRef.current.offsetBottom);
  }
  // componentWillMount(){
  //    window.addEventListener('scroll', this.handleScroll);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timerVar);
  //   window.removeEventListener('scroll', this.handleScroll);
  // }

  completed(data){
    // console.log("data", data);

    // const textArray = data.readingLesson.text.split(' ').map( word => {
  //     let obj = {
  //           word: word,
  //           before: false,
  //           after: false,
  //           style: false
  //         }
  //     return obj;
  // });
    let value = JSON.parse(data.readingLesson.text);
    // let contentState = Plain.deserialize(text)
    
    const elementArray = [];
    const omissions = [];
  
    // eslint-disable-next-line
    const elements = data.readingLesson.elements && JSON.parse(data.readingLesson.elements);
      for (var prop in elements){
        switch(elements[prop].type){
          case "comprehension":
          let obj = {}
            obj['type'] = elements[prop].type;
            obj['number'] = prop;
            obj['question'] = elements[prop].question;
            obj['options'] = elements[prop].options;
            obj['correct'] = false;
          let options = [];
          let trueCount = 0;
          for (let i = 0; i < elements[prop].options.length; i++){
            options.push({
                value: elements[prop].options[i].value, 
                correct: elements[prop].options[i].correct,
                checked: false});
            if (elements[prop].options[i].correct === true){
              trueCount++
            }
          }
            if (trueCount > 1){
              obj['multiple'] = true;
            } else {
              obj['multiple'] = false;
            }
            obj['options'] = options;
            elementArray.push(obj);
            
        break;
        case "omission":
          let omObj = {
            type: elements[prop].type,
            number: elements[prop].number,
            omission: elements[prop].omission,
            index: elements[prop].index,
            hint: elements[prop].hint,
            value: '',
            touched: false,
            correct: false,
            msg: '', 
          }
          
          omissions.push(omObj);
          elementArray.push(omObj);
        break;
        case "omissionWithOptions" :
          let omWOb = {
            type: elements[prop].type,
            number: elements[prop].number,
            omission: elements[prop].omission,
            index: elements[prop].index,
            options: elements[prop].options,
            correctValue: elements[prop].correctValue,
            correct: false,
            active: '',
            msg: '',
          };
         
          elementArray.push(omWOb);
        break;
        case "insertText":
          let insertObj = {
            type: elements[prop].type,
            number: elements[prop].number,
            insertText: elements[prop].insertText,
            correctAnswer: elements[prop].checked,
            correct: null,
            msg: '',
          };
          elementArray.push(insertObj);
        break;
        case "table":
          elementArray.push(elements[prop]);
        break;
        default:
        return null;
      }
    }

    this.setState({
      elements: elementArray,
      omissions
    }, () => {
      this.getHTML(value);
    });

  }

  getHTML(value) {
    const rules = [
      {
        serialize(obj, children) {
            // eslint-disable-next-line
          if (obj.object == 'block') {
            switch (obj.type) {
              case 'table': 
              const headers = null;
              const rows = children;
              const split = (!headers || !rows || !rows.size || rows.size===1)
                  ?  { header: null, rows: rows }
                  : {
                  header: rows.get(0),
                  rows: rows.slice(1),
                  }

              return (
                  <table>
                  {headers && 
                      <thead>{split.header}</thead>
                  }
                  <tbody>{split.rows}</tbody>
                  </table>
              );
              case 'table_row': return <tr>{children}</tr>;
              case 'table_cell': return <td>{children}</td>;
              case 'code':
                  
                  return (
                      <pre>
                          <code>{children}</code>
                      </pre>
                  )
                  
              case 'paragraph':
                  
                  return <span>{children}</span>
                  
              case 'block-quote':
                  
                  return <blockquote>{children}</blockquote>
                  
              case 'bulleted-list':
                  
                  return <ul>{children}</ul>
                  
              case 'heading-one':
                  
                  return <h1>{children}</h1>
                  
              case 'heading-two':
                  
                  return <h2>{children}</h2>
                  
              case 'list-item':
                  
                  return <li>{children}</li>
                  
              case 'numbered-list':
                  
                  return <ol>{children}</ol>
                  
              case 'heading':    
                  
                  return <h1>{children}</h1>
                  
              case 'subheading': 
                  
                  return <h2>{children}</h2>
                  
              default:
               break;
            }
            // eslint-disable-next-line
          if (obj.object == 'inline' && obj.type == 'link') {
              
              return React.createElement(
                  'a',
                  null,
                  children
              );
          }
          }
        },
      },
      
      {
        serialize(obj, children) {
          // eslint-disable-next-line
          if (obj.object == 'mark') {
            switch (obj.type) {
              case 'bold':  
                  return <strong>{children}</strong>
                  
              case 'code':  
                  return <code>{children}</code>
                  
              case 'italic':  
                  return <em>{children}</em>
                  
              case 'underlined':  
                  return <u>{children}</u>
                  
              case 'highlight':
                  return <span style={{backgroundColor: '#d5f4e6'}}>{children + ' '}</span>
                  
              case 'insertText':
                  
                  return <span formindex={obj.data.formIndex} insertindex={obj.data.insertIndex}  text={obj.data.insertText} name={children[0]} id="insertText"></span>
                  
              case 'omission':
                 
                  return <span answer={obj.data.answer} formindex={obj.data.number} placeholder={children[0]} id="omission"></span>
              case 'omissionWithOptions':
                  
                  return <span answer={obj.data.answer} formindex={obj.data.number} placeholder={children[0]} id="omissionWithOptions"></span> 
              default :
                return null;
            }
          }
        },
      },
    ]

//   const htmlSerialize = new Html({ rules })
//   const serialize = htmlSerialize.serialize(value);

  const options = {
      replace: ({ attribs, children }) => {
        if (!attribs) return;
     
        if (attribs.id === 'insertText') {
            
            
          return (
              <InsertTextButton 
                key={getReadingKey()} 
                insertText={attribs.text}
                formIndex={attribs.formindex}
                insertIndex={attribs.insertindex}
                buttonname={attribs.name} /> 
          );
        }
        if (attribs.id === 'omission') {
          
          
          return (
            <ReadingOmission 
              key={getReadingKey()}
              value={this.state.omissions[0].value}
              placeholder={attribs.placeholder}
              correctAnswer={attribs.answer}
              formIndex={attribs.formindex}
              strictMode={true}
            /> 
          );
        }
        if (attribs.id === 'omissionWithOptions') {
          
          
          return (
            <OmissionWithOptions
              key={getReadingKey()}
              ref={this.omWithOptionsRef}
              formindex={attribs.formindex}       
            /> 
          );
        }
      }
    };
     
    // const staticMarkup = parse(serialize, options);

    this.setState({
    //   html: staticMarkup
    })
  }

// READING CONTROLS =====================================================================================
// READING CONTROLS =====================================================================================
  // handleSpeedChange(event) {
  //   this.setState({
  //     readingSpeedValue: event.target.value
  //   });
  // }

  // startReading(){
  //   const textArray = [...this.state.textArray];
  //   let i = this.state.speedReadingIndex;

  //     this.timerVar = setInterval(() => {
  //       if ( i < textArray.length) {
  //         textArray[i].style = true;
  //         textArray[i].before = false;
  //         textArray[i].after = false;
  //         if (i > 0) {
  //           textArray[i-1].style = false;
  //           textArray[i-1].before = true;
  //           if (i < textArray.length -1 ){
  //             textArray[i+1].after = true;
  //           }
  //         } if (i > 1) {
  //           textArray[i-2].before = false;
  //         }
  //         this.setState({
  //           textArray,
  //           speedReadingIndex: i++
  //         });
  //       }else this.restartReading();
    
  //     }, 60000/this.state.readingSpeedValue);
  
  //     this.setState({
  //       readingSpeedRunning: true
  //     });
  // }

  // pauseReading(){
  //   clearInterval(this.timerVar);
  //   this.setState({
  //       readingSpeedRunning: false,
  //   });
  // }

  // restartReading(){
  //     const textArray = [...this.state.textArray];
  //   console.log("reading index", this.state.speedReadingIndex);

  //   clearInterval(this.timerVar);
  //   this.timerVar = null;
  //   textArray[this.state.speedReadingIndex].style = false;
  //   if (this.state.speedReadingIndex > 0 ){
  //     textArray[this.state.speedReadingIndex-1].before = false;
  //   }
  //   if (this.state.speedReadingIndex < textArray.length -1 ){
  //     textArray[this.state.speedReadingIndex+1].after = false;
  //   }
  //   this.setState({
  //       textArray,
  //       readingSpeedRunning: false,
  //       speedReadingIndex: 0
  //     });
  // }

  // changeColor(type){
  //   this.setState({
  //     backgroundColorSelected: type
  //   })
  // }

  // onCheck(type){
  //   const readingStyles =[...this.state.readingStyles];
  //   if (type === 'underline'){
  //     readingStyles[0].checked = !readingStyles[0].checked;
  //   } if ( type === 'color') {
  //     readingStyles[1].checked = !readingStyles[1].checked;
  //   } if (type === 'highlight') {
  //     readingStyles[2].checked = !readingStyles[2].checked;
  //   } 
  //   this.setState({
  //     readingStyles
  //   })
  // }

  onOptionCheck(multiple, questionIndex, optionIndex){
   
    const updatedElements = [...this.state.elements];

    const updatedElement = {
      ...updatedElements[questionIndex]
    };
    const updatedOptions = [...updatedElement.options];
    const updatedOption = {...updatedOptions[optionIndex]};
    if (multiple){
      //if there are multiple correct options allow more than one options to be checked
      updatedOption.checked = !updatedOption.checked;
      
    } else {
      // set the checked option for the radio button
      updatedElement.checkedOption =  optionIndex;
    } 
    

    updatedOptions[optionIndex] = updatedOption;
    updatedElement.options = updatedOptions
    updatedElements[questionIndex] = updatedElement;
    

    this.setState({
      elements: updatedElements,
    }, () => {
      this.checkValidity();
    });

  };

  checkValidity() {
    const elements = [...this.state.elements];

  //eslint-disable-next-line
    var checkDisabled = true;
    for ( let i = 0; i< elements.length; i++){

      if (elements[i].checkedOption === -1) {

        checkDisabled = true;
      } else checkDisabled = false;
    }

    this.setState({
      checkDisabled: false
    })
  }

  checkLesson(){
    const elements = [...this.state.elements];
  
    
      for ( let i = 0; i< elements.length; i++) {
        if (elements[i].type === 'comprehension'){
          var compCorrect = true;
          for ( let j = 0; j < elements[i].options.length; j ++){
            // if multiple answers are correct loop through and set a flag to make sure all are equal to each other
            if (elements[i].multiple){
              compCorrect = compCorrect && elements[i].options[j].correct === elements[i].options[j].checked;
              console.log("comp correct", elements[i].options[j].correct === elements[i].options[j].checked); 
            } else if (elements[i].options[j].correct ){ 
                elements[i].correct = compCorrect && j === elements[i].checkedOption;
              } 
            }
            elements[i].correct = compCorrect;
        }
        if (elements[i].type === 'omission'){
          console.log("omission check", this.props.omissions);
          const omissions = this.props.omissions.byId;
          let checkedOmissions;
          for (let prop in omissions){
            const omission = omissions[prop]
            console.log("omission", omission);
            if (omission.value === omission.correctAnswer){
              console.log("correct omission");
              checkedOmissions = {
                omissions: {
                  byId: {
                    [prop]: {
                      message: 'correct'
                    }
                  }
                }
              }
              this.props.handleCheckedOmissions(checkedOmissions)
            } else {
              console.log("incorrect omission", omissions[prop]);
              checkedOmissions = {
                omissions: {
                  byId: {
                    [prop]: {
                      message: 'incorrect'
                    }
                  }
                }
              }
            }
            this.props.handleCheckedOmissions(checkedOmissions)
          }
          
        }
        if (elements[i].type === 'omissionWithOptions'){
          
          elements[i].msg = `correct answer ${elements[i].correctValue}`;
            // eslint-disable-next-line
            
            elements[i].correct = true;
            elements[i].msg = 'correct';
            break;
            
        }
        if (elements[i].type === 'insertText'){
          
          if (elements[i].correctAnswer === `option${this.props.insertTexts.byId[`formIndex${i}`].activeIndex}`){
            
            elements[i].msg = 'correct';
            this.props.handleCheckedInsertTexts({
              insertTexts: {
                byId: {
                  [`formIndex${i}`]: {
                    msg: 'correct',
                  }
                }
              }
            })
          } else {
            elements[i].msg = 'incorrect';
            this.props.handleCheckedInsertTexts({
              insertTexts: {
                byId: {
                  [`formIndex${i}`]: {
                    msg: 'incorrect',
                  }
                }
              }
            })
          }
          

        }
        if (elements[i].type === 'table'){
          console.log("table", elements[i]);
        }
    }
    
    this.setState({
      elements
    });
  }

  back() {
    this.props.history.push('/');
  }

  slider(e) {
    e.preventDefault();
    this.setState({
      textTransparency: e.target.value,
      hideClass: `hide${e.target.value}`
    })
  }

  toggleModal(){
    this.setState( prevState => {
      return { showDeleteModal: !prevState.showDeleteModal }
    });
  }

  handleScroll= () => {
    const {scrollY} = this.state;

    const currentScrollY = window.pageYOffset;
    const transform = scrollY > currentScrollY;
    this.setState({scrollY: window.scrollY, transform});
  }

  handleOmissionWithOptions(formIndex, option){
    this.props.sendActiveOption({
                                  omissionsWithOptions: 
                                      {
                                        byId: 
                                          {
                                            [`formIndex${formIndex}`]: 
                                              {
                                                id: formIndex, 
                                                option 
                                              }
                                          }
                                      }
                                  });
    this.scrollToOmissionRef();

    const updatedElements = [...this.state.elements];
    const updatedElement = {...updatedElements[formIndex]};
    updatedElement['active'] = option;

    updatedElements[formIndex] = updatedElement;

    this.setState({
      elements: updatedElements,
    })
  }

  render() {
    const cssReadingPassage = [
      "ReadingPassage",
      this.state.backgroundColorSelected
    ];
    
    const formArray = [];
        if (this.state.elements){
          for (let i = 0; i < this.state.elements.length; i++){
            formArray.push({
                id: i,
                config: this.state.elements[i]
            });
          }
        }
        
      return (
          <Query 
            query={LESSON_SET}
            variables={{uniqid: this.props.match.params.id}}
            fetchPolicy='network-only'
            onCompleted={data => this.completed(data)}>
            {({ loading, error, data}) => {
              if (loading)  return <div className="spinner spinner-1"></div>;
              if (error) return `Error!: ${error}`;

              // eslint-disable-next-line
              let userCanDelete;
              if (this.props.user){
                userCanDelete = this.props.user.id === data.readingLesson.authorID;
              }
          return (
            <div className="ReadingLessonWrapper" >
              {this.state.showDeleteModal ? <DeleteModal show={this.state.showDeleteModal} togglemodal={() => this.toggleModal()} modalmessage="delete the reading?" onclick={() => this._deleteLesson()} /> : null}
              <div className="ReadingHeaderWrapper">
                <button className="BackButtonLesson" onClick={() => this.back()}>Back</button>
                { userCanDelete ? <button className="DeleteReading" onClick={() => this.toggleModal()}><FontAwesomeIcon icon={faTimes} size="2x" /></button> : null}
                
                <div className="LessonTitle">
                <h1>{data.readingLesson.title}</h1>
                <div className="ReactTimerWrapper"><ReactTimer initialTime={10000} startImmediately={true} showControls={false} /></div>
                
              </div>
            
            <div className="ReadingEnvironment">
              <div className="ReadingCompQuestionsWrapper">
                
                  {formArray.map( (element) => {
                    
                    if (element.config.type === 'comprehension'){

                      return (
                        <ReadingCompQuestion
                          key={element.id}
                          index={element.id} 
                          question={element.config.question}
                          options={element.config.options}
                          correct={element.config.correct}
                          changed={this.onOptionCheck}
                          checked={element.config.checkedOption}
                          multiple={element.config.multiple}
                          msg={element.config.msg}
                          
                        />
                        )
                    }
                    if (element.config.type === 'omissionWithOptions'){
                      return (
                        <div className="OmissionWithOptionsElement" key={element.id}>
                          <p>{element.config.number +1}.</p>
                            <div className="OmissionWithOptionsButtonWrapper">
                            {element.config.options.map((option, index) => {
                              return <button className="OmissionWithOptionsButton" disabled={option.value === element.config.active} key={index} onClick={() => this.handleOmissionWithOptions( element.id, option.value)}>{option.value}</button>
                            })}
                            </div>
                            <p>{element.config.msg}</p>
                        </div>
                      )
                    }
                    if (element.config.type === 'insertText'){
                      return (
                        <div className="InsertTextWrapper" key={element.id}>
                          <p>{element.config.number +1}.</p>
                          <span className="InsertTextHeader">Click on the options in passage to place text:</span> 
                          <span className="InsertTextString">{element.config.insertText}</span>
                          <p className="InsertTextString">{element.config.msg}</p>
                        </div>
                      )
                    }
                    if (element.config.type === 'table'){
                      return (
                          <ReadingTable
                            key={element.id}
                            formIndex={element.id} 
                            table={element.config.table}
                            ondrop={this.onDrop}
                            ondragover={this.onDragOver}
                            ondragstart={this.onDragStart}
                            ondragexit={this.onDragExit}
                            options={element.config.options}/>
                        )
                    }
                    return null;
                  })}
                </div>
                <div className={cssReadingPassage.join(' ')}> 
          
                  {this.state.html}
      
                </div>
                

              </div>  
                <button 
                  className="CheckLessonButton"
                  disabled={this.state.checkDisabled}
                  onClick={()=> this.checkLesson()}>Check
                </button> 
      

          </div>
        </div>
        )}}
     </Query>  
    )
  }

  onDrop = (e, formIndex, row, col) => {
    let value = e.dataTransfer.getData("value");
    let optionIndex = e.dataTransfer.getData("optionIndex");
    console.log("args", value, optionIndex, row, col);
    // let value = e.dataTransfer.getData("text");

    const updatedElements = [
      ...this.state.elements
    ];

    const updatedElement = {
      ...updatedElements[formIndex]
    };
    
    let updatedTable = [...updatedElement.table];

    let updatedRow = [...updatedTable[row]];

    let updatedCol = {...updatedRow[col]};

    updatedCol.value = value;



    // ================================================
    // updated the options 
    const updatedOptions = [...updatedElement.options];
    const updatedOption = {...updatedOptions[optionIndex]};

    updatedOption.hidden = true;
    updatedOption.draggable = false;

    updatedOptions[optionIndex] = updatedOption;
    updatedElement.options = updatedOptions;
// =============================================================


    updatedRow[col] = updatedCol;
    updatedTable[row] = updatedRow;
    updatedElement.table = updatedTable;
    updatedElements[formIndex] = updatedElement;

    this.setState({
      elements: updatedElements,
    })

  }

  onDragOver = (e, formIndex, row, col) => {
    e.preventDefault();
    // const updatedElements = [
    //   ...this.state.elements
    // ];

    // const updatedElement = {
    //   ...updatedElements[formIndex]
    // };

    
    // let updatedTable = [...updatedElement.table];

    // let updatedRow = [...updatedTable[row]];

    // let updatedCol = {...updatedRow[col]};

    // let updatedStyle = {...updatedCol.style};

    // updatedStyle.backgroundColor = "#eee";

    // updatedCol.style = updatedStyle;
    // updatedRow[col] = updatedCol;
    // updatedTable[row] = updatedRow;
    // updatedElement.table = updatedTable;
    // updatedElements[formIndex] = updatedElement;

    // this.setState({
    //   elements: updatedElements,
    // })
  }

  onDragExit = (e, formIndex, row, col) => {
    e.preventDefault();
    const updatedElements = [
      ...this.state.elements
    ];

    const updatedElement = {
      ...updatedElements[formIndex]
    };

    let updatedTable = [...updatedElement.table];

    let updatedRow = [...updatedTable[row]];

    let updatedCol = {...updatedRow[col]};

    let updatedStyle = {...updatedCol.style};

    updatedStyle.backgroundColor = "white";

    updatedCol.style = updatedStyle;
    updatedRow[col] = updatedCol;
    updatedTable[row] = updatedRow;
    updatedElement.table = updatedTable;
    updatedElements[formIndex] = updatedElement;

    this.setState({
      elements: updatedElements,
    })
  }

  onDragStart = (ev, formIndex, index, value, optionIndex) =>{
  
    ev.dataTransfer.setData("value", value);
    ev.dataTransfer.setData("optionIndex", optionIndex);


    const updatedElements = [
      ...this.state.elements
    ];

    const updatedElement = {
      ...updatedElements[formIndex]
    };
    
    const updatedOptions = [...updatedElement.options];
    const updatedOption = {...updatedOptions[index]};

    updatedOption.hidden = true;

    updatedOptions[index] = updatedOption;
    updatedElement.options = updatedOptions;
    updatedElements[formIndex] = updatedElement;
    
    this.setState({
      elements: updatedElements,
    })

  }

  _deleteLesson = async () => {
    await this.props.deleteLesson({
      variables: {
        uniqid: this.props.match.params.id
      }
    });
    this.props.history.push('/lessons');
  };
};


const LESSON_SET = gql`
  query ReadingLesson($uniqid: String!){
    readingLesson(uniqid: $uniqid ) {
      uniqid
      title
      authorID
      text
      elements
    }
  }
`;


const DELETE_LESSON = gql`
  mutation ($uniqid: String!){
      deleteCompLesson( uniqid: $uniqid )
  }
`;


// const mapDispatchToProps = dispatch => {
//   return {
//     sendLesson: (lesson) => dispatch({type: actionTypes.LESSON_SET, lesson:lesson }),
//     handleCheckedOmissions: (omissions) => dispatch({type: actionTypes.OMISSIONS, omissions}),
//     handleCheckedInsertTexts: (insertTexts) => dispatch({type: actionTypes.INSERT_TEXTS, insertTexts}),
//     sendActiveOption: (omissionsWithOptions) => dispatch({ type: actionTypes.OMISSION_WITH_OPTIONS, omissionsWithOptions}),
//   }
// }

// const mapStateToProps = state => {
//   return {
//     lesson: state.lessonSet,
//     user: state.user,
//     insertTexts: state.insertTexts,
//     omissions: state.omissions,
//     activeOption: state.activeOption
//   }
// }

const Container = graphql(DELETE_LESSON, { name: 'deleteLesson' })( Lesson);
export default Container;

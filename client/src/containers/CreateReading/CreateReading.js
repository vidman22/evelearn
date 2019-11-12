import React, { Component } from 'react';
import { Prompt, withRouter } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import { Value, Mark} from 'slate';
import Slate from '../Slate/Slate';
import InputReadingOmission from '../../components/InputReadingOmission/InputReadingOmission';
import InputCompOption from '../../components/InputCompOption/InputCompOption';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import MinusSVG from '../../components/SVG/MinusSVG';
import PlusSVG from '../../components/SVG/PlusSVG';
import XMarkSVG from '../../components/SVG/XMarkSVG';

import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

import './CreateReadingLesson.css';

let n = 0;

function getHighlightKey() {
	return `highlight_${n++}`
}

const initialValue = Value.fromJSON({
    "object": "value",
    "document": {
      "object": "document",
      "nodes": [
        {
          "object": "block",
          "type": "paragraph",
          "nodes": [
            {
              "object": "text",
              "text":
                ""
            }
          ]
        }
      ]
    }
});

class CreateReadingLesson extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: {
    			value: '',
    			validation: {
    			  required: true,
    			  msg: ''
    			},
    			valid: false,
    			touched: false	
			},
			value: initialValue,
    		textarea: {
    			value: '',
    			validation: {
    				required: true,
    				msg: ''
    			},
    			valid: false,
    			touched: false
    		},
    		lessonCompForm: {
				type: {value: 'comprehension', valid: true},
    			question: {  
    			  value: '',
    			  validation: {
    			    required: true,
    			     msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			options:[{
				  value: '',
				  checked: false,
    			  correct: false,
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
					},
    			{
				  value: '',
				  checked: false,
    			  correct: false,
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			{
				  value: '',
				  checked: false,
    			  correct: false,
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			{
				value: '',
				checked: false,
    			correct: false,
    			validation: {
    			  required: false,
    			  msg: ''
    			},
    			valid: false,
    			touched: false
				}],
				highlight:{
					show: false,
					value:'',
					validation: {
						required: false,
						msg: ''
					},
					indices: [],
					valid: true,
					touched: false
				},
			},
			lessonOmissionForm: {
				type: {value: 'omission', valid: true},
    			omission: {  
				  value: '',
				  index: null,
				  indices: [],
				  offset: null,
    			  validation: {
    			    required: true,
    			     msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			hint: {
    			  value: '',
    			  validation: {
    			    required: false,
    			    msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			}
			},
			lessonOmissionWithOptions: {
				type: {value: 'omissionWithOptions', valid: true},
    			omission: {  
				  value: '',
				  index: null,
				  indices: [],
				  offset: null,
    			  validation: {
    			    required: true,
    			     msg: ''
    			  },
    			  valid: false,
    			  touched: false
    			},
    			options:[{
					value: '',
					checked: false,
					correct: false,
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
					  },
				  {
					value: '',
					checked: false,
					correct: false,
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
				  },
				  {
					value: '',
					checked: false,
					correct: false,
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
				  },
				  {
				  value: '',
				  checked: false,
				  correct: false,
				  validation: {
					required: false,
					msg: ''
				  },
				  valid: false,
				  touched: false
				  }],
			},
			lessonInsertTextForm: {
				type: {value: 'insertText', valid: true},
    			insertText: {  
				  value: '',
				  correctIndex: null,
    			  validation: {
    			    required: true,
    			     msg: ''
    			  },
    			  valid: false,
				  touched: false,
				},
				checked:{ value: "", valid: false },
				insertIndices: [{
					value: '',
					index: null,
					checked: false,
					correct: false,
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
					  },
				  {
					value: '',
					index: null,
					checked: false,
					correct: false,
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
				  },
				  {
					value: '',
					index: null,
					checked: false,
					correct: false,
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
				  },
				  {
				  value: '',
				  index: null,
				  checked: false,
				  correct: false,
				  validation: {
					required: false,
					msg: ''
				  },
				  valid: false,
				  touched: false
				  }],
			},
			lessonTableForm: {
				type: {value: 'table', valid: true},
				table: [ [ {
							value: '',
							validation: {
							  required: false,
							  msg: ''
							},
							valid: false,
							touched: false} ]
						],
				options:[{
					value: '',
					checked: false,
					column: "any",
					row: "any",
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
				},
				{
					value: '',
					checked: false,
					column: "any",
					row: "any",
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
				},
				{
					value: '',
					checked: false,
					column: "any",
					row: "any",
					validation: {
					  required: false,
					  msg: ''
					},
					valid: false,
					touched: false
				},
				{
				  value: '',
				  checked: false,
				  column: "any",
				  row: "any",
				  validation: {
					required: false,
					msg: ''
				  },
				  valid: false,
				  touched: false
				}],
			},
    		formIsValid: false,
    		formIsHalfFilledOut: false,
			lessonFormNum: 1,
			lessonFormArray: [], 
			readingModeOmission: false,
			showHighlightOption: false,
			transitionType: "addandremove",
			textLength: 0,
		}
		
		this.ref = React.createRef()
	}
	

	componentDidMount() {

    	const lessonFormArray = [];
    	const lessonCompForm = {...this.state.lessonCompForm};

		for (let i = 0; i < this.state.lessonFormNum; i++ ) {
			lessonFormArray.push(lessonCompForm);
			}
    	this.setState({lessonFormArray});
	  }

	onChange = ({ value }) => {
		this.setState({ value });
	}
	  
  	addForm = () => {
		const lessonFormArray = [...this.state.lessonFormArray];
		let lessonForm;
		if (lessonFormArray.length){
			const type = lessonFormArray[lessonFormArray.length -1].type.value;
			switch(type){
				case 'comprehension':
					lessonForm = this.state.lessonCompForm;
					
				break;
				case 'omission':
					lessonForm = this.state.lessonOmissionForm;
					
				break;
				case 'omissionWithOptions':
					lessonForm = this.state.lessonOmissionWithOptions;
					
				break;
				case 'insertText':
					lessonForm = this.state.lessonInsertTextForm;
					
				break;
				case 'table':
					lessonForm = this.state.lessonTableForm;
				break;
				default:
					lessonForm = this.state.lessonCompForm;
					
			}
		} else {
			lessonForm = this.state.lessonCompForm;
		}
			lessonFormArray.push(lessonForm);

		this.setState({
			lessonFormArray,
		}, () => {
			this.checkFormValidity();
		});

  	}

  	removeElement = (index) => {
  		let updatedLessonForms = [
      		...this.state.lessonFormArray
    	];
    	// eslint-disable-next-line
    	const removed = updatedLessonForms.splice(index, 1);
    	
    	this.setState({
		lessonFormArray: updatedLessonForms,
    	}, () => {
			this.checkFormValidity();
		  });
	  }
	rotateType = (direction, index, type) => {
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
		
		const {lessonCompForm, 
				lessonOmissionForm, 
				lessonOmissionWithOptions, 
				lessonInsertTextForm, 
				lessonTableForm }  = this.state;

		const array = [lessonCompForm, lessonOmissionForm, lessonOmissionWithOptions, lessonInsertTextForm, lessonTableForm];
		if (type === "comprehension"){
			let i = 0 + direction < 0 ? 4 : 0 + direction
			updatedLessonForms.splice(index, 1, array[i]);
		}
		if (type ==="omission"){
			updatedLessonForms.splice(index, 1, array[1 + direction]);
		}
		if (type === "omissionWithOptions"){
			updatedLessonForms.splice(index, 1, array[2 + direction]);
		}
		if (type === "insertText"){
			updatedLessonForms.splice(index, 1, array[3 + direction]);
		}
		if (type === "table"){
			// if index of array exceeds 3 then set it back to zero;
			let i = direction + array.length > array.length ? 0 : array.length - 2;
			
			updatedLessonForms.splice(index, 1, array[i]);
		}
		
		this.setState({
			lessonFormArray: updatedLessonForms
		}, () => {
			this.checkFormValidity();
		});
	}

	handleTitleChange = (e) => {
    
    	const updatedTitle = {
    	  ...this.state.title
    	}
	
    	updatedTitle.value = e.target.value;
    	updatedTitle.touched = true;
	
    	const updatedTitleValidation = {
    	  ...updatedTitle.validation
    	}
    	updatedTitleValidation.msg = '';
	
    	if (updatedTitle.value.trim() === '') {
    	  updatedTitleValidation.msg = 'add a title';
    	  updatedTitle.valid = false;
    	} else if (updatedTitle.value.length >= 40) {
    	  updatedTitleValidation.msg = 'title is too long';
    	  updatedTitle.valid = false;
    	} else {
    	  updatedTitle.valid = true;
    	}
	
    	updatedTitle.validation = updatedTitleValidation;
	
		this.setState({ 
			title: updatedTitle
		}, () => {
        this.checkFormValidity()
      });
  	}


  	handleChange = (e) => {
  		const updatedTextarea = {
  			...this.state.textarea
  		};

  		const updatedValidation = {
  			...updatedTextarea.validation
  		}

		  updatedTextarea.value = e.target.value;
		// eslint-disable-next-line
		const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
		const regex = new RegExp(expression);
		
		const hasUrl = updatedTextarea.value.match(regex);
		// console.log(hasUrl);
  		if (updatedTextarea.value.trim() === '') {
    	  updatedValidation.msg = 'add your text';
    	  updatedTextarea.valid = false;
    	} else if (updatedTextarea.value.length >= 5440) {
    	  updatedValidation.msg = 'text is too long';
    	  updatedTextarea.valid = false;
    	} else if (hasUrl){
			updatedValidation.msg = `please remove ${hasUrl}`;
			updatedTextarea.valid = false;
		}else {
    	  updatedTextarea.valid = true;
    	}

    	updatedTextarea.validation = updatedValidation;

  		this.setState({
  			textarea: updatedTextarea,
  			formIsHalfFilledOut: true,
  		}, () => {
    	  this.checkFormValidity();
    	});

	  };

  	addAnswer = (index) => {
    	  
    	let optionForm = {
    	  ...this.state.lessonCompForm.options[0]
    	};
	
    	const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[index]
    	};
	
    	const updatedOptions = [
    	  ...updatedForm.options
    	];
	
    	// if (updatedOptions.length >= 4 ) {
    	//   this.setState({addAnswerDisabled: true});
    	// }
	
    	updatedOptions.push(optionForm);

	    updatedForm.options = updatedOptions;  
    	updatedLessonForms[index] = updatedForm;
	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
	}
	  
	addIndex = (index) => {
		const indexForm = {
			...this.state.lessonInsertTextForm.insertIndices[0]
		}
		
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];

		const updatedForm = {
			...updatedLessonForms[index]
		};

		const updatedIndices = [
			...updatedForm.insertIndices
		];

		updatedIndices.push(indexForm);

		updatedForm.insertIndices = updatedIndices;

		updatedLessonForms[index] = updatedForm;

		this.setState({
			lessonFormArray: updatedLessonForms,
		}, () => {
			this.checkFormValidity();
		});

	}

	removeIndex = (formIndex, indexIndex) => {
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
	  
		const updatedForm = {
			...updatedLessonForms[formIndex]
		  };
	  
		const updatedIndices = [
			...updatedForm.insertIndices
		  ];
		  // eslint-disable-next-line
		const removed = updatedIndices.splice(indexIndex, 1);
	  
		updatedLessonForms[formIndex] = updatedForm;
		updatedForm.insertIndices = updatedIndices;   	
	
		this.setState({
			lessonFormArray: updatedLessonForms,
		}, () => {
			this.checkFormValidity();
		});
	}

  	removeAnswer = (index, answerIndex) => {
	
    	const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[index]
    	};
	
    	const updatedOptions = [
    	  ...updatedForm.options
    	];
    	// eslint-disable-next-line
    	const removed = updatedOptions.splice(answerIndex, 1);
	
    	updatedLessonForms[index] = updatedForm;
    	updatedForm.options = updatedOptions;   	
	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
	  }


  	inputChangedHandler = (event, inputIdentifier, index) => {
  		const updatedLessonForms = [
            ...this.state.lessonFormArray
        ];
        const updatedForm = { 
            ...updatedLessonForms[index]
        };
        const updatedElement = {
          ...updatedForm[inputIdentifier]
        }
        const updatedValidation = {
          ...updatedElement.validation
        }
        if (inputIdentifier === 'hint') {
          const hint = event.target.value.trim();
          updatedValidation.msg = '';
          if ( hint === '' ){
            updatedValidation.msg = 'add a hint';
            updatedElement.valid = false;
          } else if ( hint.length >= 50 ) {
            
            updatedValidation.msg = 'hint is too long';
            updatedElement.valid = false;
          } else {
			updatedElement.valid = true;
			
          }
        }

        if (inputIdentifier === 'question') {

        	const question = event.target.value.trim();
        	updatedValidation.msg = '';
        	if (question === ''){
        		updatedValidation.msg = 'add a question';
        		updatedElement.valid = false;
        	} else if (question.length >= 180 ) {
        		updatedValidation.msg = 'too long';
            	updatedElement.valid = false;
        	} else {
        		updatedElement.valid = true;
        	}
		}

		if (inputIdentifier === 'insertText'){
			const text = event.target.value.trim();
        	updatedValidation.msg = '';
        	if (text === ''){
        		updatedValidation.msg = 'add a question';
        		updatedElement.valid = false;
        	} else if (text.length >= 580 ) {
        		updatedValidation.msg = 'too long';
            	updatedElement.valid = false;
        	} else {
        		updatedElement.valid = true;
        	}
		}
  
        updatedElement.value = event.target.value;
        updatedElement.touched = true;
		updatedElement.validation = updatedValidation;
        updatedLessonForms[index] = updatedForm;
        updatedForm[inputIdentifier] = updatedElement;
        
        this.setState({
		  lessonFormArray: updatedLessonForms,
        }, () => {
          this.checkFormValidity();
        });
	  }

	omissionHandler = (event, inputIdentifier, index) =>{
		const updatedLessonForms = [
            ...this.state.lessonFormArray
        ];
        const updatedForm = { 
            ...updatedLessonForms[index]
        };
        
        const updatedElement = {
          ...updatedForm.omission
        }
        const updatedValidation = {
          ...updatedElement.validation
		}
            
        const omission = event.target.value.trim();
		const offsets = this.highlightOmission(omission, inputIdentifier);
		
        updatedValidation.msg = '';
        updatedElement.valid = false;
        if (omission === '') {
          	updatedValidation.msg = 'add word from text';
          	updatedElement.valid = false;
        } else if (offsets.length === 0 ) {
          	updatedElement.valid = false;
          	updatedValidation.msg = 'text to be omitted not found in passage';
		} else {
			updatedElement.value = omission;
			if (offsets.length > 1 ){
				updatedElement.valid = false;
				updatedElement.index = 0;
				updatedElement.indices = offsets;
				updatedElement.value = omission;
				updatedValidation.msg = 'more than one omission found';
			}  else {
				updatedElement.index = 0;
				updatedElement.valid = true;
				updatedElement.offset = offsets.length === 1 && offsets[0];
				updatedElement.indices = offsets;
				updatedElement.value = omission;
				updatedValidation.msg = '';
			}
		}

		updatedElement.value = event.target.value;
		updatedElement.touched = true;
		updatedElement.validation = updatedValidation;
		updatedLessonForms[index] = updatedForm;
		updatedForm.omission = updatedElement;
		
		this.setState({
		  lessonFormArray: updatedLessonForms,
		  value: this.ref.current.value
		}, () => {
		  this.checkFormValidity();
		});

	}

	highlightOmission = (string, inputIdentifier) => {

		const editor = this.ref.current;
		const { value } = editor;
		const { document, annotations } = value;
  
		const offsets = [];
		// Make the change to annotations without saving it into the undo history,
		// so that there isn't a confusing behavior when undoing.
		if (inputIdentifier === 'omission'){
			editor.withoutSaving(() => {
			  annotations.forEach(ann => {
				if (ann.type === 'searchHighlight') {
				  editor.removeAnnotation(ann)
				}
			  })
			  for (const [node, path] of document.texts()) {

				const { key, text } = node
				const parts = text.split(string);
				let offset = 0;

				parts.forEach((part, i) => {
				  if (i !== 0) {
					editor.addAnnotation({
					  key: getHighlightKey(),
					  type: 'searchHighlight',
					  anchor: { path, key, offset: offset - string.length },
					  focus: { path, key, offset },
					})
					let sendOffset = offset - string.length;
					offsets.push({path, key, sendOffset, length: string.length});
				  }
				  offset = offset + part.length + string.length;
				})
			  }
			})
		} else {
			editor.withoutSaving(() => {
				annotations.forEach(ann => {
				  if (ann.type === 'searchHighlightOptions') {
					editor.removeAnnotation(ann)
				  }
				})
				for (const [node, path] of document.texts()) {
				
				  const { key, text } = node
				  const parts = text.split(string);
				  let offset = 0;
				
				  parts.forEach((part, i) => {
					if (i !== 0) {
					  editor.addAnnotation({
						key: getHighlightKey(),
						type: 'searchHighlightOptions',
						anchor: { path, key, offset: offset - string.length },
						focus: { path, key, offset },
					  })
					  let sendOffset = offset - string.length;
					  offsets.push({path, key, sendOffset, length: string.length});
					}
					offset = offset + part.length + string.length;
				  })
				}
			})
		}
		return offsets;
	}

	omissionChooser = (formIndex, inputIdentifier) => {
		
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
		
		const updatedForm = {
			...updatedLessonForms[formIndex]
		};

		const updatedElement = {
			...updatedForm.omission
		};

		const updatedValidation = {
			...updatedElement.validation
		};

		// ==============================================================================
		updatedValidation.msg = '';
		// ==============================================================================
		// get offsets of the form
		// eslint-disable-next-line
		let offsets = updatedElement.indices;
		
		const editor = this.ref.current;
		let index = updatedElement.index;
		const {path, key, sendOffset, length} = offsets[index];
		const { value } = editor;
		const {  annotations } = value;
  
		// Make the change to annotations without saving it into the undo history,
		// so that there isn't a confusing behavior when undoing.
		if (inputIdentifier === 'omission'){
			annotations.forEach(ann => {
			if (ann.type === 'searchHighlight') {
			  editor.removeAnnotation(ann)
			}
			})

			editor.addAnnotation({
				key: getHighlightKey(),
				type: 'searchHighlight',
				anchor: { path, key, offset: sendOffset },
				focus: { path, key, offset: sendOffset + length},
			});
 
		} else {
			annotations.forEach(ann => {
				if (ann.type === 'searchHighlightOptions') {
				  editor.removeAnnotation(ann)
				}
				})
	
				editor.addAnnotation({
					key: getHighlightKey(),
					type: 'searchHighlightOptions',
					anchor: { path, key, offset: sendOffset },
					focus: { path, key, offset: sendOffset + length},
				});
		}


		updatedElement.offset = offsets[index];
		
		index = index === offsets.length -1 ? 0  : index+1;
		updatedElement.index = index;
		
		updatedElement.validation = updatedValidation;
		updatedForm.omission = updatedElement;	
		updatedLessonForms[formIndex] = updatedForm; 

		
		this.setState({
		  lessonFormArray: updatedLessonForms,
		  value: this.ref.current.value,
		}, () => {
		  this.checkFormValidity();
		});

	}

	omissionCreator = (formIndex, hint, inputIdentifier) => {
		
		const editor = this.ref.current;
		  
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
		
		const updatedForm = {
			...updatedLessonForms[formIndex]
		};

		const updatedElement = {
			...updatedForm.omission
		};

		const updatedValidation = {
			...updatedElement.validation
		}

		let offset = updatedElement.offset;
		// console.log("creator offset", offset);
		// const offsets = updatedElement.indices;

      	const {key, sendOffset, length} = offset;
      	// console.log("key, offset, length", key, sendOffset, length);
		if (inputIdentifier === 'omission'){
			
			const mark = Mark.create({data: {answer: updatedForm.omission.value, number: formIndex }, type:'omission'})
			
			editor.removeTextByKey(key, sendOffset, length)
				  .insertTextByKey(key, sendOffset, hint)
				  .addMarkByKey(key, sendOffset, hint.length, mark)
				  .focus()
				  .removeMark(mark)
				  .insertText(" ");
		
		} else {
			
			const mark = Mark.create({data: {answer: updatedForm.omission.value, number: formIndex }, type:'omissionWithOptions'})
			const formNum = Number(formIndex) + 1;
			
			// const stringForm = stringify(formNum);
			editor.removeTextByKey(key, sendOffset, length)
				  .insertTextByKey(key, sendOffset, formNum.toString())
				  .addMarkByKey(key, sendOffset, formIndex.length, mark)
				  .focus()
				  .removeMark(mark)
				  .insertText(" ");
		}
		updatedElement.valid = true;
		updatedValidation.msg = '';
		updatedElement.validation = updatedValidation;
		updatedForm.omission = updatedElement;	
		updatedLessonForms[formIndex] = updatedForm; 
		
		this.setState({
		  lessonFormArray: updatedLessonForms,
		  value: this.ref.current.value,
		}, () => {
		  this.checkFormValidity();
		});
	}

	addInputPlaceholder = (formIndex, index ) => {
		
		const editor = this.ref.current;
		const {value} = editor;
		const {selection} = value;
		const {start} = selection;
		const {path, key, offset} = start;
		
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
		
		const updatedForm = {
			...updatedLessonForms[formIndex]
		};

		const updatedIndices = [
			...updatedForm.insertIndices
		];

		const updatedIndexForm = {
			...updatedIndices[index]
		};

		const insertText = updatedForm.insertText.value;
		const name = updatedIndexForm.value;
		const omIndex = { path, key, offset};
		
		let mark = Mark.create({data: {formIndex: formIndex, insertIndex: index, insertText}, type: 'insertText'})
		editor.focus().addMark(mark)
			  .insertText(name)
			  .focus()
			  .removeMark(mark)
			  .insertText(" ");
		
		updatedIndexForm.index = omIndex;
		updatedIndices[index] = updatedIndexForm;
		updatedForm.insertIndices = updatedIndices;	
		updatedLessonForms[formIndex] = updatedForm; 
		
		this.setState({
			lessonFormArray: updatedLessonForms,
			value: this.ref.current.value,
		}, () => {
		this.checkFormValidity();
		});
		
	}

  	optionChangedHandler = (event, formIndex, index) => {
  		const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[formIndex]
    	};
	
    	const updatedOptions = [
    	  ...updatedForm.options
    	];

    	const updatedOptionForm = {
    		...updatedOptions[index]
    	}

		const updatedValidation = {
			...updatedOptionForm.validation
		}

		updatedOptionForm.value = event.target.value;
		updatedValidation.msg = '';

		if (updatedOptionForm.value.trim() === '') {
    	  updatedValidation.msg = 'add an answer';
    	  updatedOptionForm.valid = false;
    	} else if (updatedOptionForm.value.length >= 140) {
    	  updatedValidation.msg = 'answer is too long';
    	  updatedOptionForm.valid = false;
    	} else {
    	  updatedOptionForm.valid = true;
    	}

    	updatedOptionForm.validation = updatedValidation;
		updatedOptions[index] = updatedOptionForm;
    	updatedForm.options = updatedOptions;
    	updatedLessonForms[formIndex] = updatedForm;   	
	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
	}

  	optionChecked = (formIndex, index) => {

  		const updatedLessonForms = [
    	  ...this.state.lessonFormArray
    	];
	
    	const updatedForm = {
    	  ...updatedLessonForms[formIndex]
		};
		
    	const updatedOptions = [
			...updatedForm.options
		  ];
  
		const updatedOptionForm = {
			...updatedOptions[index]
		}
		

    	updatedOptionForm.checked = !updatedOptionForm.checked;

    	updatedOptions[index] = updatedOptionForm;
    	updatedForm.options = updatedOptions;
    	updatedLessonForms[formIndex] = updatedForm;  	
	
    	this.setState({
    	  lessonFormArray: updatedLessonForms,
    	}, () => {
    	  this.checkFormValidity();
    	});
	}
	  
	handleRadioChange = (formIndex, index) => {
		const updatedLessonForms = [...this.state.lessonFormArray];

		const updatedForm = {
			...updatedLessonForms[formIndex]
		};
		const updatedElement = {...updatedForm.checked}

		updatedElement.value = `option${index}`;
		updatedElement.valid = true;
		updatedForm.checked = updatedElement;
		updatedLessonForms[formIndex] = updatedForm;

		this.setState({
			lessonFormArray: updatedLessonForms,
		}, () => {
			this.checkFormValidity();
		});

	}

  	checkFormValidity = () => {
    	const lessonFormArray = this.state.lessonFormArray;
    	let formIsValid = true;
		//NEED TO ADD VALIDATION FOR TEXTAREA DRAFT
    	for ( let i = 0; i < lessonFormArray.length; i++) {
    	  for ( let property in lessonFormArray[i] ) {
			// console.log("property", property);
			
			if ( lessonFormArray[i][property].length && property !== "table"){
				for ( let j = 0; j < lessonFormArray[i][property].length; j++) {

					// console.log("option time", j + " " + lessonFormArray[i][property][j].valid)
					// console.log("question",lessonFormArray[i]['question'].valid ) && lessonFormArray[i]['question'].valid
					// console.log("form", formIsValid );
					// console.log("title", this.state.title.valid);
					// console.log("text", this.state.textarea.valid);
					formIsValid = lessonFormArray[i][property][j].valid  && formIsValid && this.state.title.valid;
					// console.log("form is valid", formIsValid);
				}
			} else if (property === "omission" || property === "hint") {
				// console.log("else if is fired");
				formIsValid = lessonFormArray[i][property].valid && formIsValid && this.state.title.valid;
			} else if (property === "table") {
				formIsValid = formIsValid && this.state.title.valid;
			} else {
				// console.log("else if is fired");
				formIsValid = lessonFormArray[i][property].valid && formIsValid && this.state.title.valid;
			}
    	  } 
    	}

		// console.log("form is valid outside", formIsValid);
    	if (formIsValid === true ){
    	  this.setState({ formIsValid, formIsHalfFilledOut: false });
    	 
    	} else {
			// console.log("form isn't valid");
    	  this.setState({formIsValid, formIsHalfFilledOut: true });
    	}
  	}

  	formData = () => {
		const form = [...this.state.lessonFormArray];
		let elementNumber = 0;
		let omNumber =0;
		let questions = {};
		for (let i = 0; i < form.length; i++){
			if (form[i].type.value === "comprehension"){
					let rObj = {};
					let options = [];
					rObj['type'] = "comprehension";
					rObj['number'] = i;
					rObj['question'] = form[i].question.value;
					rObj['options'] = options;
				  	// rObj['highlight'] =  {value: form[i].highlight.value, indices: form[i].highlight.indices};
					for ( let j = 0; j < form[i].options.length; j ++ ){
						options.push({value: form[i].options[j].value, correct: form[i].options[j].checked, checked: false});
					}
					questions[`${elementNumber++}`] = rObj;
					// questions.push(rObj)
			}
			if (form[i].type.value === "omission"){
					omNumber++;
  					let obj = {
						type: "omission",
						number: i,
						omNumber: omNumber,
						omission: form[i].omission.value,
						index: form[i].omission.index,
  						hint: form[i].hint.value
  					}
  					questions[`${elementNumber++}`] = obj;
			}
			if (form[i].type.value === "omissionWithOptions"){
				let rObj = {};
				
				rObj['type'] = "omissionWithOptions";
				rObj['number'] = i;
				rObj['omission'] = form[i].omission.value;
				rObj['index'] =  form[i].omission.index;
				
				let options = [];
				for ( let j = 0; j < form[i].options.length; j ++ ){
					if (form[i].options[j].checked){
						rObj['correctValue'] = form[i].options[j].value;
					}
					options.push({
							value: form[i].options[j].value, 
							correct: form[i].options[j].checked, 
							active: false});
				}
				rObj['options'] = options;
				questions[`${elementNumber++}`] = rObj;
			}
			if (form[i].type.value === "insertText"){
				let rObj = {};
				rObj['type'] = "insertText";
				rObj['number'] = i;
				rObj['insertText'] = form[i].insertText.value;
				rObj['checked'] = form[i].checked.value;
				let insertIndices = [];
				for (let j = 0; j < form[i].insertIndices.length; j++){

					insertIndices.push({
								value: form[i].insertIndices[j].value, 
								index: form[i].insertIndices[j].index, 
								correct: form[i].insertIndices[j].checked, 
								checked: false
							})
				}
				rObj['indices'] = insertIndices;
				questions[`${elementNumber++}`] = rObj;
			}
			if (form[i].type.value === "table"){
				let rObj = {};
				rObj['type'] = "table";
				let table = [];
				for (let k = 0; k < form[i].table.length; k++){
					let row = []
					for (let l = 0; l < form[i].table[k].length; l++){
						console.log("table value", form[i].table[k][l].value);
						if (form[i].table[k][l].value){
							row.push({value: form[i].table[k][l].value, style: {backgroundColor: "white"}, draggable: false });
						} else {
							row.push({value: form[i].table[k][l].value, style: {backgroundColor: "white"}, draggable: true });
						}
					}
					table.push(row);
				}
				rObj['table'] = table;
				let options = [];
				for ( let j = 0; j < form[i].options.length; j ++ ){
					options.push({value: form[i].options[j].value, hidden: false, draggable: true, row: form[i].options[j].row, column: form[i].options[j].column});
				}
				rObj['options'] = options;
				questions[`${elementNumber++}`] = rObj;
			}
		}
		return JSON.stringify(questions);
  	}

  	completed = (data) => {
      	this.props.history.push(`/reading/${data['createReadingLesson'].uniqid}`);
  	}
    
    back = () => {
      this.props.history.push('/create-lesson');
	}

	createTable = (formIndex) => {
		let table = [];

		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
	  
		const updatedForm = {
			...updatedLessonForms[formIndex]
		};

		const updatedTable = [
			...updatedForm.table
		];

		for (let i = 0; i < updatedTable.length; i++){
			let children = [];
			
			for (let j = 0; j < updatedTable[i].length; j++){
				// console.log("property", j);
				children.push(<td key={j}><input type="text" className="ReadingQuestionTableInput" onChange={(event) => this.tableInput(event, formIndex, i, j)} value={this.state.lessonFormArray[formIndex].table[i][j].value} /></td>)
			}

			table.push(<tr key={i}>{children}</tr>)
		}

		return table;
	}

	tableInput = (event, formIndex, row, column) => {
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
	  
		const updatedForm = {
			...updatedLessonForms[formIndex]
		};

		const updatedTableArray = [
			...updatedForm.table
		];

		const updatedTableRow = [
			...updatedTableArray[row]
		];

		const updatedTableCell ={
			...updatedTableRow[column]
		};

		const updatedValidation = {
			...updatedTableCell.validation
		};

		updatedTableCell.value = event.target.value;
		updatedValidation.msg = '';

		if (updatedTableCell.value.length >= 140) {
			updatedValidation.msg = 'answer is too long';
			updatedTableCell.valid = false;
		} else {
			updatedTableCell.valid = true;
		}
		
		updatedTableCell.validation = updatedValidation;
		updatedTableRow[column] = updatedTableCell;
		updatedTableArray[row] = updatedTableRow;
		updatedForm.table = updatedTableArray;
		updatedLessonForms[formIndex] = updatedForm; 
		
		this.setState({
			lessonFormArray: updatedLessonForms,
		});
	}

	modifyTable(formIndex, type, element){
		
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
	  
		const updatedForm = {
			...updatedLessonForms[formIndex]
		};

		const updatedTableArray = [
			...updatedForm.table
		];

		const updatedTableRow = [
			...updatedTableArray[0]
		];

		const newTableCell = {
								value: '',
								validation: {
									required: false,
									msg: ''
								  },
								valid: true,
								touched: false
							};
		

		switch(type){
			case 'add':
				if (updatedTableArray.length < 15){
					if (element === "column"){
						for (let i = 0; i < updatedTableArray.length; i++){
							updatedTableArray[i].push(newTableCell);
						}
					} else {
						let rowArray = [];
						for (let i = 0; i < updatedTableRow.length; i++){
							rowArray.push(newTableCell);
						}
						updatedTableArray.push(rowArray);
					}
				} 

			break;
			case 'remove':
				
					if (element === "column"){
						
						if (updatedTableArray[0].length > 1 && updatedTableArray[0].length < 15 ){
							
							for (let i = 0; i < updatedTableArray.length; i++){
								// eslint-disable-next-line
								const remove = updatedTableArray[i].splice(updatedTableArray[i].length -1, 1);
							}
						}
					} else if (updatedTableArray.length > 1 && updatedTableArray.length < 15 ){
						// eslint-disable-next-line
						const remove = updatedTableArray.splice(updatedTableArray.length -1, 1);
					}
				
			break;
			default:
			break;
		}
		// updatedTableArray[row] = updatedTableRow;
		updatedForm.table = updatedTableArray;
		updatedLessonForms[formIndex] = updatedForm; 
		
		this.setState({
			lessonFormArray: updatedLessonForms,
		}, () => {
			this.checkFormValidity();
		});	

	}

	

	inputIndexInput = (event, formIndex, index) => {
		const updatedLessonForms = [
			...this.state.lessonFormArray
		  ];
	  
		  const updatedForm = {
			...updatedLessonForms[formIndex]
		  };
	  
		  const updatedIndices = [
			...updatedForm.insertIndices
		  ];
  
		  const updatedIndexForm = {
			  ...updatedIndices[index]
		  }
  
		  const updatedValidation = {
			  ...updatedIndexForm.validation
		  }
		  updatedIndexForm.value = event.target.value;
		  updatedValidation.msg = '';

		  if (updatedIndexForm.value.trim() === '') {
			updatedValidation.msg = 'add an answer';
			updatedIndexForm.valid = false;
		  } else if (updatedIndexForm.value.length >= 14) {
			updatedValidation.msg = 'answer is too long';
			updatedIndexForm.valid = false;
		  } else {
			updatedIndexForm.valid = true;
		  }
  
		  updatedIndexForm.validation = updatedValidation;
		  updatedIndices[index] = updatedIndexForm;
		  updatedForm.insertIndices = updatedIndices;
		  updatedLessonForms[formIndex] = updatedForm;   	
	  
		  this.setState({
			lessonFormArray: updatedLessonForms,
		  }, () => {
			this.checkFormValidity();
		  });
	}

	handleTableSelectChange(event, formIndex, index, type){
		
		const updatedLessonForms = [
			...this.state.lessonFormArray
		];
	  
		const updatedForm = {
			...updatedLessonForms[formIndex]
		};
	
		const updatedOptions = [
			...updatedForm.options
		];

		const updatedOptionForm = {
			...updatedOptions[index]
		}
		// console.log("1st updatedOptionForm", updatedOptionForm);
		const updatedValidation = {
			...updatedOptionForm.validation
		}
		updatedValidation.msg = '';
		updatedOptionForm.valid = true;

		updatedOptionForm[type] = event.target.value;

		updatedOptions[index] = updatedOptionForm;
		updatedForm.options = updatedOptions;
		updatedLessonForms[formIndex] = updatedForm;
		// console.log("updatedOptionForm", updatedOptionForm);
		this.setState({
			lessonFormArray: updatedLessonForms,
		}, () => {
			this.checkFormValidity();
		});
	}

	render(){
		const formArray = [];
      	for (let key in this.state.lessonFormArray) {
        	formArray.push({
          		id: key,
          		config: this.state.lessonFormArray[key]
        	});
		  }

		
      	let form = (
          <Mutation
            mutation={ADD_COMP_LESSON}
            onCompleted={data => this.completed(data)}>
              {mutation => (
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    if (!this.props.user) {
                        this.props.togglemodal();
                      } else {
							const value = this.ref.current.value;
                        	const title = this.state.title.value;
							const text = JSON.stringify(value.toJSON());
  							const authorID = this.props.user.id;
 							const data = this.formData();
							
  							mutation({
  								variables: {
  									title,
  									authorID,
  									text,
  									elements: data
  								}
  							});
  						}
                  }}>
				<CSSTransitionGroup
					transitionName="addandremove"
					transitionEnterTimeout={400}
					transitionLeaveTimeout={300}>
                {formArray.map((formElement) => {
                  return (

                    <div className="InputReadingSentenceWrapper" key={formElement.id}>
                      <p>{Number(formElement.id) + 1}</p>
							<XMarkSVG classname="DeleteSentence" onclick={() => this.removeElement(formElement.id)} />
                    	{formElement.config.type.value === 'omission' && (
                    	<InputReadingOmission
  	
                    	  	omissionValue={formElement.config.omission.value}
                    	  	omissionInvalid={!formElement.config.omission.valid}
                    	  	omissionShouldValidate={formElement.config.omission.validation}
                    	  	omissionTouched={formElement.config.omission.touched}
                    	  	omissionChanged={(event) => this.omissionHandler(event, formElement.config.type.value, formElement.id)}
							omissionChooser={() => this.omissionChooser(formElement.id, formElement.config.type.value)}
							omissionCreator={() => this.omissionCreator(formElement.id, formElement.config.hint.value, formElement.config.type.value)}
							omissionIndex={formElement.config.omission.index}
							omissionIndices={formElement.config.omission.indices}
                    	  	hintValue={formElement.config.hint.value}
                    	  	hintInvalid={!formElement.config.hint.valid}
                    	  	hintShouldValidate={formElement.config.hint.validation}
                    	  	hintTouched={formElement.config.hint.touched}
                    	  	hintChanged={(event) => this.inputChangedHandler(event, 'hint', formElement.id)}
						/> 
						
						)}
						{formElement.config.type.value === 'comprehension' && (
                    	<div className="InputWrapper">
	  						<input 
	  						 	className="InputQuestion"
	  						 	type="text"
	  						 	value={formElement.config.question.value}
	  						 	onChange={(event) => this.inputChangedHandler(event, 'question', formElement.id)}
	  						 	placeholder="Question"
	  						/>
	  						<p className="Message">{formElement.config.question.validation.msg}</p>
	  						         
                        <div className="ElementAddWrapper">{formElement.config.options.map((option, index) => (
							
                                <InputCompOption
									key={index}
                                	checked={option.checked}
                                	index={index}
                                	onclick={(e) => this.removeAnswer(formElement.id, index, e)}
                                	oncheck={() => this.optionChecked(formElement.id, index)}
                                	optionValue={option.value}
                                	optionPlaceholder='Option'
                                	optionInvalid={!option.valid}
                                	optionShouldValidate={option.validation}
                                	optionTouched={option.touched}
                                	optionChanged={(event) => this.optionChangedHandler(event, formElement.id, index)}
                                />
								
						
                          ))}
                            <div className="ElementAddReadingButtonWrapper" >
								<PlusSVG onclick={() => this.addAnswer(formElement.id)} />
                            </div>
							
                        </div>
							{/*formElement.config.highlight.show ? (
							<div className="InputHighlightWrapper">
								<input
									className="InputHighlight"
									type="text"
									value={formElement.config.highlight.value}
									onChange={(event)=> this.inputChangedHandler(event, 'highlight', formElement.id)}
									placeholder="Highlighted text"
								/>
								<MinusSVG classname="RemoveOption" onclick={() => this.toggleHighlight(formElement.id)} />
									<p className="Message">{formElement.config.highlight.validation.msg}</p>
							</div>
							): 
							<button
								type="button" 
								onClick={()=> this.toggleHighlight(formElement.id)} 
								className="AddHighlight">Add Highlight
							</button>*/}
              		    </div>
											
						)}
						{formElement.config.type.value === 'omissionWithOptions' && ( 
							<div>
								<InputReadingOmission
									justOmission={true}
									omissionValue={formElement.config.omission.value}
									omissionInvalid={!formElement.config.omission.valid}
									omissionShouldValidate={formElement.config.omission.validation}
									omissionTouched={formElement.config.omission.touched}
									omissionChanged={(event) => this.omissionHandler(event, formElement.config.type.value, formElement.id)}
									omissionChooser={() => this.omissionChooser(formElement.id, formElement.config.type.value)}
									omissionCreator={() => this.omissionCreator(formElement.id, '', formElement.config.type.value)}
									omissionIndex={formElement.config.index}
									omissionIndices={formElement.config.omission.indices}

								/>
							<div className="ElementAddWrapper">
							{formElement.config.options.map((option, index) => (
							
                                <InputCompOption
									key={index}
                                	checked={option.checked}
                                	index={index}
                                	onclick={(e) => this.removeAnswer(formElement.id, index, e)}
                                	oncheck={() => this.optionChecked(formElement.id, index)}
                                	optionValue={option.value}
                                	optionPlaceholder='Option'
                                	optionInvalid={!option.valid}
                                	optionShouldValidate={option.validation}
                                	optionTouched={option.touched}
                                	optionChanged={(event) => this.optionChangedHandler(event, formElement.id, index)}
                                />
								
						
                          	))}
                            	<div className="ElementAddReadingButtonWrapper" >
									<PlusSVG onclick={() => this.addAnswer(formElement.id)} />
                            	</div>
							
                        	</div>
							</div>
						)}
						{formElement.config.type.value === 'insertText' && (
							<div>
								
							<textarea
								className="InputInsertText"
								type="text"
								value={formElement.config.insertText.value}
								onChange={(event)=> this.inputChangedHandler(event, 'insertText', formElement.id)}
								placeholder="Text to be inserted"
							/>
							<div>Place cursor in text where you want an insert option then press "Add Insert"</div>
							{formElement.config.insertIndices.map((inputIndex, index) => (
								<div key={index}>
									<input
										type="radio"
										className="InputInsertRadio"
										value={`option${index}`}
										checked={formElement.config.checked.value === `option${index}`}
										onChange={() => this.handleRadioChange(formElement.id, index)}
									/>
									<input
										className="InputInsertOption"
										type="text"
										value={inputIndex.value}
										onChange={(event) => this.inputIndexInput(event, formElement.id, index)}
										placeholder="Name option"
									/>
									<button className="InputInsertButton" type="button" onClick={() => this.addInputPlaceholder(formElement.id, index)}>Add Insert</button>
									<MinusSVG classnmae="RemoveInsert" onclick={() => this.removeIndex(formElement.id, index)} />
								</div>
								))}
							    	<div className="ElementAddReadingButtonWrapper" >
										<PlusSVG onclick={() => this.addIndex(formElement.id)} />
                            		</div>
								</div>
							)}
							{formElement.config.type.value === 'table' && (
								<div className="ReadingQuestionTable">
									<button className="TableButton" type="button" onClick={()=>this.modifyTable(formElement.id, "add", "column" )}>Add Column</button>
									<button className="TableButton" type="button" onClick={()=>this.modifyTable(formElement.id, "remove", "column" )}>Remove Column</button>
									<button className="TableButton" type="button" onClick={()=>this.modifyTable(formElement.id, "add", "row" )}>Add Row</button>
									<button className="TableButton" type="button" onClick={()=>this.modifyTable(formElement.id, "remove", "row" )}>Remove Row</button>
									<table>
										<tbody>
											{this.createTable(formElement.id)}
										</tbody>
									</table>
							
							<div className="ElementAddWrapper">
							{formElement.config.options.map((option, index) => (
								<div key={index}>
                                <InputCompOption
									
                                	checked={option.checked}
                                	index={index}
                                	onclick={(e) => this.removeAnswer(formElement.id, index, e)}
                                	// oncheck={() => this.optionChecked(formElement.id, index)}
                                	optionValue={option.value}
                                	optionPlaceholder='Option'
                                	optionInvalid={!option.valid}
                                	optionShouldValidate={option.validation}
                                	optionTouched={option.touched}
                                	optionChanged={(event) => this.optionChangedHandler(event, formElement.id, index)}
                                />
								<select value={option.row}  onChange={(event) => this.handleTableSelectChange(event, formElement.id, index, "row")}>
									<option key={`anyrow${index}`} value="any">Belongs in any row</option>
									<option key={`norow${index}`} value="none">Doesn't belong in any row</option>
									{formElement.config.table.map((rows, index) => (
										<option key={`row${index}`} value={index}>{`Belongs only in row ${index+1}`}</option>
									))}
								</select>
								<select value={option.column}  onChange={(event) => this.handleTableSelectChange(event, formElement.id, index, "column")}>
									<option key={`anycol${index}`} value="any">Belongs in any column</option>
									<option key={`nocol${index}`} value="none">Doesn't belong in any column</option>
									{formElement.config.table[0].map((column, index) => (
										<option key={`col${index}`} value={index}>{`Belongs only in column ${index+1}`}</option>
									))}
								</select>
								</div>
						
                          		))}
                            <div className="ElementAddReadingButtonWrapper" >
								<PlusSVG onclick={() => this.addAnswer(formElement.id)} />
                            </div>
							
                        </div>
								</div>

							)}
							  
					<button type="button" className="RotateElement"  id="backward"onClick={() => this.rotateType(-1, formElement.id, formElement.config.type.value)}><FontAwesomeIcon icon={faChevronLeft} /></button>
					<button type="button" className="RotateElement" id="forward" onClick={() => this.rotateType(1, formElement.id, formElement.config.type.value)}><FontAwesomeIcon icon={faChevronRight} /></button>
					
            		</div>
            		)
				  })}
				</CSSTransitionGroup>
            <div className="ExerciseButton" onClick={() => this.addForm()}>Add</div>
            <button className="CreateButton" type="submit" disabled={!this.state.formIsValid}>Create</button>
            </form>
            )}
          </Mutation>
        );
      		

		return (
			<div className="CreateReadingLesson">
        		<button className="BackButtonLesson" onClick={() => this.back()}>Back</button>
          		<Prompt
            		when={this.state.formIsHalfFilledOut}
            		message="Are you sure you want to leave?"
          		/>
          		{/*<button className="ToggleReadingMode" onClick={(e)=> this.toggleMode(e)}>{this.state.readingModeOmission ? 'Switch to Comprehension Mode' : 'Switch to Gap Reading Mode' }</button>*/}
          		<input
            		className="LessonTitleInput"
            		value={this.state.title.value}
            		onChange={(e) => this.handleTitleChange(e)}
            		type="text"
            		placeholder="Title"
          		/>
          		<p className="Message">{this.state.title.validation.msg}</p>
					<Slate 
						onChange={this.onChange}
						parentref={this.ref}
						value={this.state.value}
						readOnly={false}
					/>
  				{form}
			</div>
			)
	}
}


const ADD_COMP_LESSON = gql`
  mutation CreateReadingLesson($title: String!, $authorID: Int!, $text: String!, $elements: String) {
    createReadingLesson( title: $title, authorID: $authorID, text: $text, elements: $elements) {
      	created_at
      	title
      	authorID
		text
		uniqid
		elements
    }
  }
`
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const Container = withRouter(CreateReadingLesson);
export default connect(mapStateToProps)(Container);
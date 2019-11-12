import React from 'react';

import './ReadingCompQuestion.css';


const ReadingCompQuestion = props => {
	
	return (
		  <div className="ReadingCompQuestionElement">
		  	<div className="QuestionMessage">{props.msg}</div>
		  <form>
			  	<div className="ReadingCompQuestionWrapper">					
				  	<p>{props.index+1}.</p>
					{props.question && <div className="ReadingCompQuestion">{props.question}</div>}
				</div>
			  {props.options.map((option, index) => {
				return (
						<div key={index} className="ReadingCompOption">
							<label className="QuestionCheckLabel">
                        		
									<input 
                        				type={props.multiple ? "checkbox" : "radio"}
                        		 		className="QuestionCheckBox" 
                        		 		checked={props.multiple ? props.checked : props.checked === index}  
                        		 		onChange={() => props.changed(props.multiple, props.index, index)}
									/>
										 </label>
                        	<div>{option.value}</div>	
                        </div>
                       );
				})}
				{props.highlight && <button type="button" className="HighlightButton" onClick={props.showhighlight}>{props.highlightshown ? 'Hide Highlight' : 'Show Highlight' } </button>}
				{props.correct && <p>correct</p>}
			</form>
		  </div>
		  );
};

export default ReadingCompQuestion;
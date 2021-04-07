import React from 'react';

import './InputReadingOmission.css';


const InputReadingOmission = (props) => {
	  return (
	  	<div className="InputWrapper">
	  		<div className="InputVocabWrapper">
	  	     <input
	  	    	 className="InputVocab"
	  	    	 type="text"
	  	    	 value={props.omissionValue}
	  	    	 onChange={props.omissionChanged}
	  	    	 placeholder="Omitted Text"
	  	     />
	  	     <p>{props.omissionShouldValidate.msg}</p>
			{props.omissionIndices.length > 1 ? <button type="button" className="AddHighlight" onClick={props.omissionChooser}>Choose omission</button> : null}
			

	  	    </div>
			 {!props.justOmission && 
			 <div>
			 <input 
	  	    	className="InputVocabHint"
	  	    	type="text"
	  	    	value={props.hintValue}
	  	    	onChange={props.hintChanged}
	  	    	placeholder="Hint"
	  	    />
	  	    <p>{props.hintShouldValidate.msg}</p>
			  
			</div>
			 }
			<button type="button" className="AddHighlight" onClick={props.omissionCreator}>Create omission</button>
	  	</div>

		);
};

export default InputReadingOmission;
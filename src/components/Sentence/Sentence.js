import React from 'react';
import AutosizeInput from 'react-input-autosize';

import './Sentence.css';


const sentence = ( props ) => {
	const index = props.sentence.indexOf(props.correctanswer); 
	const index2 = index + props.correctanswer.length;

	let s1 = index === 0 ? null : props.sentence.slice(0, index);
	let s;
	if (s1){
	 if (s1.indexOf('.') !== -1 ){
		 s = [<h3 id="period" key={1}>{s1.slice(0, s1.indexOf('.') + 1)}</h3>];
		 s1 = s1.slice(s1.indexOf('.')+1); 
	 }
	}
	const s2 = props.sentence.slice(index2, props.sentence.length);
	let inputColor = 'black';
	if ( props.message && props.message === 'correct') {
		inputColor = '#00c4c3'
	}	
	if ( props.message && props.message === 'incorrect') {
		inputColor = '#c92c43'
	} 
	
	return (
		<div className="Sentence">
			<div className="FirstPart">{s && s}<h3 key={2}>{s1}</h3></div><form onSubmit={props.handlesubmit}>
						<AutosizeInput
							className="GameInput"
							value={props.value}
							onChange={props.handlechange}
							placeholder={props.placeholder}
							placeholderIsMinWidth
							autoCapitalize="off"
							autoCorrect="off"
							spellCheck="false"
							autoComplete="off"
							inputStyle={{
								color: inputColor,
								height: '35px',
								lineHeight: '35px',
								fontSize: '30px', 
								marginLeft: '4px', 
								marginRight:'6px',
								outline: 'none',
								background: 'none',
								borderTop: 'none', 
								borderLeft: 'none', 
								borderRight: 'none', 
								borderBottom:'solid 2px #046A91'}} 
							/></form>
			<div className="SecondPart"><h3>{s2}</h3></div>
			{!props.testmode ? <button className="ExerciseButton" onClick={props.onclick}>Check</button> :<div className="SentenceSpace"></div>}

		</div>
		)
};

export default sentence;
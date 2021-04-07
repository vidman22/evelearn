import React from 'react';
import MinusSVG from '../SVG/MinusSVG';
import PlusSVG from '../SVG/PlusSVG';


import './InsertText.css';

const InsertText = (props) => {
    return (
        <div>
        <div>Place cursor in text where you want an insert option then press the button</div>
        <textarea
            className="InputInsertText"
            type="text"
            value={props.value}
            onChange={props.onTextAreaChange}
            placeholder="Text to be inserted"
        />

{props.insertIndices.map((inputIndex, index) => (
    <div key={index}>
        <input
            type="radio"
            value={`option${index}`}
            checked={props.checked === `option${index}`}
            onChange={() => props.onHandleRadio(this.elementId, index)}
        />
        <input
            className="InputInsertOption"
            type="text"
            value={inputIndex.value}
            onChange={(event) => props.onInputIndexInput(event, this.elementId, index)}
            placeholder="Name of option (number or letter)"
        />
        <button type="button" onClick={() => props.addInputPlaceholder(this.elementId, index)}>Add Insert Place</button>
        <MinusSVG classnmae="RemoveInsert" onclick={() => props.removeIndex(this.elementId, index)} />
    </div>
    ))}
        <div className="ElementAddReadingButtonWrapper" >
            <PlusSVG onclick={() => props.addIndex(this.elementId)} />
        </div>
    </div>
    );
}

export default InsertText;

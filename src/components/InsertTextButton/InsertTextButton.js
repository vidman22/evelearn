import React, { Component } from 'react';
import * as actionTypes from '../../store/actionTypes';

export class Button extends Component {
    constructor(props){
        super(props);
        this.state= {
            showText: false,
        }
    }
    
    handleClick = (event) => {
        event.preventDefault();

        this.setState( prevState => {
            return {
                showText: !prevState.showText,
            }
        })
        const insertTexts = {
            insertTexts: {
                byId: {
                    [`formIndex${this.props.formIndex}`]: {
                        id: this.props.formIndex,
                        activeIndex: this.props.insertIndex,
                        correct: null,
                        msg: ''
                    }
                }
            }
        }
        this.props.sendInsertText(insertTexts);
    }
    render() {
        const formIndex = this.props.formIndex;
        let active = false;
        let color = 'black';
        if (this.props.insertTexts && this.props.insertTexts.byId && this.props.insertTexts.byId[`formIndex${formIndex}`]){
            // eslint-disable-next-line
            if (this.props.insertTexts.byId[`formIndex${formIndex}`].activeIndex == this.props.insertIndex){
                active = true;
            }
            if (this.props.insertTexts.byId[`formIndex${formIndex}`].msg === 'correct'){
                color = '#00c4c3';
            }
            if (this.props.insertTexts.byId[`formIndex${formIndex}`].msg === 'incorrect'){
                color = '#c92c43';
            }
        }
        
        return (
             
            active ? <span style={{display: "inline", color: color}}><strong>{this.props.insertText}</strong></span> :
            <button onClick={this.handleClick}>{this.props.buttonname}</button>
        )
    }
}
const matchDispatchToState = dispatch => {
    return {
      sendInsertText: (insertTexts) => dispatch({ type: actionTypes.INSERT_TEXTS, insertTexts}),
    }
  }
  
const mapStateToProps = state => {
  return {
    insertTexts: state.insertTexts
  }
}

export default Button;

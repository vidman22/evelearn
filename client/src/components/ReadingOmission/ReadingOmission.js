import React, { Component } from 'react';
import {connect} from 'react-redux';
import AutosizeInput from 'react-input-autosize';
import * as actionTypes from '../../store/actionTypes';
import './ReadingOmission.css';

class ReadingOmission extends Component {

	constructor(props){
        super(props);
        this.state = {
			value: '',
			message: '',
        }
    }
    onChange = (event) => {
        this.setState({
            value: event.target.value
		})
		
		const omissions = {omissions: 
			{
				byId: {
					[`formIndex${this.props.formIndex}`]: 
						{
							id: this.props.formIndex,
							correctAnswer: this.props.correctAnswer,
							value: event.target.value,
							message: ''
						}
				}
			}}
		this.props.handleChange(omissions);
        
	}

	onSubmit = (event) => {
		event.preventDefault();
		const correct = this.props.correctAnswer === this.state.value;
		if (correct){
			// don't give ux feedback if on strict mode
			if (!this.props.strictMode){
				this.setState({
					message: 'correct',
				})
			}
			
		} else {
			// don't give ux feedback if on strict mode
			if (!this.props.strictMode){
				this.setState({
					message: 'incorrect',
				})
			}
		}
		// send data to redux with correct or false

		
		
	}
	render(){
		
		
		const formIndex = Number(this.props.formIndex)
		console.log("formIndex", formIndex, typeof formIndex);
		let inputColor = 'black';
	if ( this.props.omissions && this.props.omissions.byId && this.props.omissions.byId[`formIndex${formIndex}`]){
		console.log(this.props.omissions.byId[`formIndex${formIndex}`]);
		if (this.props.omissions.byId[`formIndex${formIndex}`].message === 'correct') {
			inputColor = '#00c4c3'
		}
	}	
	if ( this.props.omissions && this.props.omissions.byId && this.props.omissions.byId[`formIndex${formIndex}`]){
		if (this.props.omissions.byId[`formIndex${formIndex}`].message === 'incorrect') {
			inputColor = '#c92c43'
		}
	}

	return (
		<form onSubmit={this.onSubmit}><AutosizeInput
			className="OmissionInput"
			value={this.state.value}
			onChange={this.onChange}
			placeholder={this.props.placeholder}
			placeholderIsMinWidth
			inputStyle={{
				color: inputColor,
				display: 'inline',
				height: '20px',
				fontFamily: 'Open Sans, sans-serif',
				lineHeight: '18px',
				fontSize: '16px', 
				marginLeft: '5px', 
				marginRight:'5px',
				background: 'none', 
				borderTop: 'none', 
				borderLeft: 'none', 	
				borderRight: 'none', 
				borderBottom:'solid 1px #046A91'}}
		/></form>

		);
	}
}

const mapDispatchToState = dispatch => {
    return {
	  handleChange: (omissions) => dispatch({ type: actionTypes.OMISSIONS, omissions}),
    }
}

const mapStateToProps = state => {
	return {
		omissions: state.omissions
	}
}
  

export default connect( mapStateToProps, mapDispatchToState )(ReadingOmission);
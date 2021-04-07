import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import './CreateLanding.css';


const CREATE_CLASS_MUTATION = gql`
  mutation CreateCourse($courseName: String!, $description: String, $creator: Int!) {
    createCourse(courseName: $courseName, description: $description, creator: $creator) {
        courseName
        description
        creator
        uniqid
        created_at
    }
}
`;

const UPDATE_CLASS = gql`
  mutation UpdateCourse($courseName: String!, $description: String, $creator: Int!, $classID: String!) {
    updateCourse(courseName: $courseName, description: $description, creator: $creator, classID: $classID) {
        courseName
        description
        creator
        uniqid
        updated_at
    }
  }
`;

class CreateCourse extends Component {
    constructor(props){
        super(props);
    this.state = {
      form: {
        courseName: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        },
        description: {
            value:'',
            valid: true,
            touched: false,
            msg: '',
            style: '',
        },
        language: {
            value:'',
            valid: true,
            touched: false,
            msg: '',
            style: '',
        }
      },
      formIsValid: false,
    }
}

handleCourseNameChange(e) {
    const updatedForm = {
      ...this.state.form
    }
    const updatedCourseName = {...updatedForm.courseName};

    updatedCourseName.value = e.target.value;
    updatedCourseName.touched = true;

    updatedCourseName.msg = '';

    if (updatedCourseName.value.trim() === '') {
      updatedCourseName.msg = 'add a class name';
      updatedCourseName.valid = false;
    } else if (updatedCourseName.value.length >= 40) {
      updatedCourseName.msg = 'your class name is too long';
      updatedCourseName.valid = false;
    } else {
      updatedCourseName.valid = true;
    }

    updatedForm.courseName = updatedCourseName;

    this.setState({ form: updatedForm } , () => {
    this.checkFormValidity()
    });
}

handleCourseLanguageChange(e) {
    const updatedForm = {
        ...this.state.form
    }
    const updatedLanguage = {...updatedForm.langauge}
    updatedLanguage.value = e.target.value;
    updatedLanguage.touched = true;

    updatedLanguage.msg = '';

    if (updatedLanguage.value.trim() === '') {
        updatedLanguage.msg = 'add a class name';
        updatedLanguage.valid = false;
      } else if (updatedLanguage.value.length >= 40) {
        updatedLanguage.msg = 'your class name is too long';
        updatedLanguage.valid = false;
      } else {
        updatedLanguage.valid = true;
      }
  
      updatedForm.language = updatedLanguage;
  
      this.setState({ form: updatedForm } , () => {
      this.checkFormValidity()
      });

}

handleDescriptionChange(e) {
    const updatedForm = {
      ...this.state.form
    }
    const updatedDescription = {...updatedForm.description};

    updatedDescription.value = e.target.value;
    updatedDescription.touched = true;

    updatedDescription.msg = '';

    if (updatedDescription.value.trim() === '') {
    } else if (updatedDescription.value.length >= 900) {
      updatedDescription.msg = 'description is too long';
      updatedDescription.valid = false;
    } else {
      updatedDescription.valid = true;
    }

    updatedForm.description = updatedDescription;

    this.setState({ form: updatedForm } , () => {
    this.checkFormValidity()
    });
}

checkFormValidity = () => {
    const courseForm = this.state.form;
    let formIsValid = this.state.formIsValid;
    if (courseForm.courseName.valid && courseForm.description.valid){
        formIsValid = true;
    }

    this.setState({ formIsValid });
}

completed(data){
      this.props.history.push(`/create-course/${data.createCourse.uniqid}`);
}

  render() {
    let MUTATION;
    let variables;
    if (this.props.type === "create"){
      MUTATION = CREATE_CLASS_MUTATION;
      variables = {
        courseName: this.state.form.courseName.value,
        description: this.state.form.description.value,
      }
    } else {
      MUTATION = UPDATE_CLASS;
      variables = {
        courseName: this.state.form.courseName.value,
        description: this.state.form.description.value,
        courseID: this.props.classid
      }
    }
    return (
        <div className="CreateLanding">
            <h1>Create a Course</h1>
            <Mutation
              mutation={MUTATION}
              onCompleted={data => this.completed(data)}>
               {createCourse => (
                 <form 
                    onSubmit={e => {
                    e.preventDefault();
                    createCourse({
                        variables 
                      });
                    }
                  }>
                <input
            		className="CreateCourseInput"
            		value={this.state.form.courseName.value}
            		onChange={(e) => this.handleCourseNameChange(e)}
            		type="text"
            		placeholder="Course Name..."
          		/>
                  <p>{this.state.form.courseName.msg}</p>
                <input
                    className="CreateCourseInput"
                    id="language"
            		value={this.state.form.language.value}
            		onChange={(e) => this.handleCourseLanguageChange(e)}
            		type="text"
            		placeholder="Language"
          		/>
                <textarea 
                    className="CreateCourseTextArea"
                    value={this.state.form.description.value}
                    onChange={(e) => this.handleDescriptionChange(e)}
                    maxLength={900}
                    type="textarea"
                    placeholder="Add description"
                />
                
                <button className="ClassModalLink" onClick={this.onSubmit} disabled={!this.state.formIsValid}>Create</button>
          		
                </form>
               )}
            </Mutation>
        </div>
    );
  }

}

export default CreateCourse;

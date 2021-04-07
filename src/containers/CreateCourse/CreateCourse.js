import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeadphones, faBook, faPhotoVideo, faList } from '@fortawesome/free-solid-svg-icons';

import './CreateCourse.css';

class CreateCourse extends Component {
    render() {
        return (
            <div className="CreateCourse">
                <h1>TOEFL English 101</h1>
                <h4>awlcreator</h4>
                <h2>Add a Lesson</h2>
                <div className="CreateLessonCard"><FontAwesomeIcon  icon={faPhotoVideo} size="3x" /><p>Video</p></div>
                <div className="CreateLessonCard"><FontAwesomeIcon  icon={faList}  size="3x"/><p>Quiz</p></div>
                <div className="CreateLessonCard"><FontAwesomeIcon  icon={faBook}  size="3x"/><p>Reading</p></div>
                <div className="CreateLessonCard"><FontAwesomeIcon  icon={faHeadphones} size="3x" /><p>Listening</p></div>
            </div>
        );
    }
}


export default CreateCourse;

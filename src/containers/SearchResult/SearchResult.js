import React, {Component} from 'react';
import LessonCard from '../../components/LessonCard/LessonCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from 'react-router-dom';
import { Query } from 'react-apollo';
import { gql } from '@apollo/client';

import './SearchResult.css';

const QUIZZES = gql`
  query SearchQuizzes($searchString: String!, $offset: Int){
    searchQuizzes(searchString: $searchString, offset: $offset){
      title
      username
	    authorID
      uniqid
      created_at
      updated_at
    }
  }
`;

const CLASSES = gql`
  query SearchClasses($searchString: String!, $offset: Int){
    searchClasses(searchString: $searchString, offset: $offset){
      classname
      uniqid
      creator
      updated_at
    }
  }`;

class SearchResult extends Component  {
  constructor(props){
  super(props);
  this.state = {
    activeQuery: 'searchQuizzes',
    activeURL: 'quiz',
    sideBarStyle: "SideBarClosed",
    reachedBottom: false,
  }
  //this.handleScroll = this.handleScroll.bind(this);
}

// componentDidMount() {
//   document.addEventListener('scroll', this.trackScrolling);
// }

// componentWillUnmount() {
//   document.removeEventListener('scroll', this.trackScrolling);
// }

// isBottom(el) {
//   console.log("element", el);
//   return el.getBoundingClientReact().bottom <= window.innerHeight;
// }

// trackScrolling = () => {
//   const wrappedElement = document.getElementById('Lessons');
//   if (this.isBottom(wrappedElement)) {
//     console.log("header bottom reached");
//     document.removeEventListener('scroll', this.trackScrolling);
//   }
// }

// handleScroll(e){
//   const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

//   if (bottom) {
//     this.setState({reachedBottom:true});
//     this.setState({reachedBottom:false});
//     console.log("bottom reached");
//   } else {
//     this.setState({reachedBottom: false});
    
//     console.log('not bottom');
//   }
// }

back() {
  this.props.history.push('/');
}

quizQuery() {
  this.setState({
    activeQuery: 'searchQuizzes',
    activeURL: 'quiz'
  })
}

compReadingQuery() {
  this.setState({
    activeQuery: 'searchReadingCompLessons',
    activeURL: 'reading-comp-lesson'
  });
}

omissionReadingQuery() {
  this.setState({
    activeQuery: 'searchReadingOmissionLessons',
    activeURL: 'reading-omission-lesson'
  });
}

classSearchQuery() {
  this.setState({
    activeQuery: 'searchClasses',
    activeURL: 'class'
  });
}

  render() {
    //let reachedBottom = this.state.reachedBottom;
    let LESSON_QUERY;
    switch(this.state.activeQuery){
      case 'seachQuizzes':
        LESSON_QUERY = QUIZZES;
      break;
      case 'searchClasses':
        LESSON_QUERY = CLASSES
      break;
      default:
        LESSON_QUERY = QUIZZES;
    }
    let searchString = this.props.match.params.id;
    return (
    <div className="SearchPage">
      
     <div className="SearchLessons" onScroll={this.handleScroll}>
      <button className="BackButtonSearch" onClick={() => this.back()}>Back</button>
        { this.state.activeQuery === 'searchQuizzes' ? 
          <div>
            
            <div className="SearchButtonWrapper">
              <h3>Search:</h3>
              <button disabled={true} onClick={()=> this.quizQuery()}className="SearchButton">Quizzes</button>
              <button onClick={()=> this.classSearchQuery()} className="SearchButton">Classes</button>
            </div>
            <h1>Quiz Results</h1> 
          </div> : null}
        { this.state.activeQuery === 'searchClasses' ? 
          <div>
           
            <div className="SearchButtonWrapper">
              <h3>Search:</h3>
              <button onClick={()=> this.quizQuery()}className="SearchButton">Quizzes</button>
              <button disabled={true} onClick={()=> this.classSearchQuery()} className="SearchButton">Classes</button>
            </div>
            <h1>Class Results</h1>
          </div> : null}
        
        
       <Query 
        query={LESSON_QUERY}
        timeout={true}
        fetchPolicy='cache-and-network'
        notifyOnNetworkStatusChange={true}
        variables={{searchString, offset:0}}>
  
        {({ loading, error, data, fetchMore }) => {
         
          if (loading) return <div className="spinner spinner-1"></div>;
          if (error) return `Error! ${error.message}`;
            
          return (
            
            <div className="LessonCardLinks">
              
              {data[this.state.activeQuery].map( (lesson, index) => (
                <LessonCard 
                  key={index}
                  title={lesson.title}
                  sentences={lesson.sentences || null}
                  created={lesson.updated_at} 
                  author={lesson.username}
                  uniqid={lesson.uniqid}
                  activeurl={'quiz'}
                  activequery={'quizzes'}
                />
                ))}
                <button className="FetchMoreButton" onClick={() => fetchMore({
                variables: {
                  searchString,
                  offset: data[this.state.activeQuery].length
                },
                updateQuery: (prevResult, {fetchMoreResult}) => {

                  if(!fetchMoreResult) return prevResult;
                                  
                  return {
                    ...prevResult, 
                    [this.state.activeQuery] : [...prevResult[this.state.activeQuery], ...fetchMoreResult[this.state.activeQuery]]
                  };
                }
              })}><FontAwesomeIcon color="#eee" size="2x" icon={faArrowAltCircleDown} /></button>
            </div>
            );
        }}
        
        </Query>
           
     </div> 
    </div>
      )
  }
};



export default withRouter(SearchResult);
import React, { Component } from 'react';
import { NavLink, Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from "../assets/svg/kwinzo.svg";
import './LandingPage.css';
import * as actions from '../store/actions';
import AuthModal from '../components/AuthModal/AuthModal';
import Backdrop from '../components/Backdrop/Backdrop';
import ClassPage from './ClassPage/ClassPage';
import CreateLesson from './CreateLesson/CreateLesson';
import CreateModal from '../components/CreateLessonModal/CreateLessonModal';
import CreateReadingLesson from './CreateReadingLesson/CreateReadingLesson';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch, faCaretDown, faUserCircle, faBars} from '@fortawesome/free-solid-svg-icons';
import Quiz from './Quiz/Quiz';
import Lessons from './Lessons/Lessons';
import Privacy from '../components/Privacy/Privacy';
import Features from '../components/Features/Features';
import Contact from '../components/Contact/Contact';
import About from '../components/About/About';
import ReadingLesson from './ReadingLesson/ReadingLesson';
import SearchResult from './SearchResult/SearchResult';
import Stripe from './Stripe/Stripe';

// import {faStar} from '@fortawesome/free-regular-svg-icons';
// import {faMinusSquare} from '@fortawesome/free-regular-svg-icons';

import SoloGame from './SoloGame/SoloGame';
import UserPage from './UserPage/UserPage';
import WaitingPage from './WaitingPage/WaitingPage';


class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authModal: false,
      authType: 'login',
      createModal: false,
      displayMenuStyle: 'NavClose',
      searchBar: true,
      searchCompleteString: '',
      shouldSkip: false,
      class: {},
      loginMode: false,
    }
    
    this.toggleCreateModal = this.toggleCreateModal.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this)
    this.input = React.createRef();
    this.Lessons = () => {
     return <Lessons user={this.props.user} sendclass={(name)=>this.sendClass(name)} /> 
    }
  }

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  toggleLogin(){
    this.setState( prevState => {
      return { loginMode: !prevState.loginMode }
    });
  }

  toggleModal(type) {
      this.setState( prevState => {
        return { 
          authModal: !prevState.authModal,
          authType: type
        }
      });
  }

  toggleCreateModal() {
  
    this.setState( prevState => {
      return { createModal: !prevState.createModal }
    });
  }

  searchSubmit(e){
    
    e.preventDefault();
    //const value = this.state.searchValue;
    const value = this.input.current.value;
    if (this.input.current.value.length !== 0) {
      this.setState({
        searchCompleteString: value,
      });
      this.input.current.value = '';
      this.props.history.push(`/search/${value}`);
    }
    
  }

  sendClass(clazz){
    this.setState({
      class: clazz,
    });
  }

  toggleMenu(){
    
    if (this.state.displayMenuStyle === 'NavClose'){
      this.setState({ displayMenuStyle: 'NavOpen'});
    } else {
      this.setState({ displayMenuStyle: 'NavClose'});
    }

  }

  logout() {
    this.props.history.push('/');
    this.props.logout();
  }


  render() {
      const cssClasses = [
        "MobileNavLinks",
        this.state.displayMenuStyle
      ];
        return (
           <div className="Landing">
                <header className="Header">
                    
                    <NavLink 
                        className="BrandGroupLink"
                        to={{
                        pathname: '/'
                    }}exact> 
                   
                      <div className="HeaderBrand">Kwinz</div>
                      <div className="LogoImage">
                        <img
                          src={logo}
                          alt="logo" 
                        />
                      </div>
                    </NavLink>
                    
                      {this.state.searchBar ? <div className="SearchHeader">
                        <form onSubmit={(e) => this.searchSubmit(e)}>
                          <input 
                            type="text"
                            ref={this.input}
                            placeholder="Search..."/><button type="submit"><FontAwesomeIcon color="#eee" size="2x" icon={faSearch} /></button></form></div>
                        : null}
                        
                                 <button id="Create" onClick={this.toggleCreateModal}>Create</button>
                    
                                  {this.props.user ?
                                    <div className="UserDropDown">
                                      
                                      <div className="LoggedUserName">{this.props.user.username}</div>
                                      <FontAwesomeIcon className="DropDownCaret" icon={faCaretDown} color="white"/>
                                        {this.props.user.picture !=="null" && this.props.user.picture !=="false" && this.props.user.picture ? <img
                                            className="UserPicture"
                                            src={this.props.user.picture}
                                            alt="Logged In" /> :  <FontAwesomeIcon className="UserPicture" onClick={(type) => this.toggleModal('login')} color="#eee" size="3x" icon={faUserCircle} /> }
                                    <div className="DropDownContent">
                                      <div onClick={() => this.logout()}>Log Out</div>
                                      <div onClick={(type) => this.toggleModal('pay')}>Go Kwinzo Pro</div>
                                    </div>
                                </div>
                                    :    
                                  <div><FontAwesomeIcon className="UserSVG" onClick={(type) => this.toggleModal('login')} color="#eee" size="3x" icon={faUserCircle} /></div>}
                            

                        <div className="MobileWrapper">
                          <div className={cssClasses.join(' ')}>
                             
                             <div className="MobileLogin" onClick={this.toggleCreateModal}>Create</div>
                      

                             <div className="MobileLink"><Link
                              to={{
                                pathname: '/'
                             }}>Home</Link></div>

                            {this.props.user ? <div className="MobileLink"><Link
                              to={{
                                pathname: '/user'
                             }}>My Page</Link></div> : <div className="MobileLogin" onClick={(type) => this.toggleModal('login')}>Login</div>}

                            {this.props.user ? <div className="MobileLogin" onClick={() => this.logout()}>Logout</div> : null}
                          </div>
                          <div className="HamburgerIcon" onClick={this.toggleMenu}><FontAwesomeIcon color="white" size="lg" icon={faBars} /></div>
                        </div>

                </header>
                { this.state.createModal ? <CreateModal togglemodal={this.toggleCreateModal} show={this.state.createModal} /> : null}
               { this.state.authModal ? <AuthModal togglemodal={(type) => this.toggleModal('login')} type={this.state.authType} loginmode={this.state.loginMode} togglelogin={this.toggleLogin} show={this.state.authModal} /> : null}
               { this.state.authModal ? <Backdrop show={this.state.authModal} togglemodal={(type) => this.toggleModal('login')} /> : null}
               { this.state.createModal ? <Backdrop show={this.state.createModal} togglemodal={this.toggleCreateModal} /> : null}
              
               <Switch> 
  
                <Route path="/create-reading/" render={() => <CreateReadingLesson togglemodal={(type) => this.toggleModal('login')}/> } />
                <Route path="/create-quiz/" render={() => <CreateLesson togglemodal={(type) => this.toggleModal('login')}/> } />
                <Route path="/search/:id" render={() => <SearchResult handlesearch={(e) => this.handleSearch(e)} value={this.state.searchCompleteString} />} />
                <Route path="/quiz/:id" render={() => <Quiz togglemodal={(type) => this.toggleModal('login')} test={false} /> } />
                <Route path="/reading/:id" component={ReadingLesson} />
                <Route path="/solo-play/:id" render={() => <SoloGame lesson= {this.props.lesson} /> } />
                <Route path="/lessons" component={() => <Lessons user={this.props.user} sendclass={(clazz)=>this.sendClass(clazz)} /> } />
                <Route path="/class/:id" component={() => <ClassPage class={this.state.class}  />} /> 
                <Route path="/host-game/:id" render={() => <WaitingPage lesson= {this.props.lesson} /> } />
                <Route path="/test/:id/:class" render={() => <Quiz togglemodal={(type) => this.toggleModal('login')} test={true} /> } />
                <Route path="/privacy" component={Privacy} />
                <Route path="/contact" component={Contact} />
                <Route path="/about" component={About} />
                <Route path="/features" component={Features} />
                <Route path="/upgrade" component={Stripe} />
                
                <Route path="/" component={this.Lessons}/>
                {this.props.user ? <Route path="/user" component={() => <UserPage  user={this.props.user} />} /> 
                : <Route path="/" component={this.Lessons} />} />}
               </Switch>
               
            <footer className="Footer">
                    <ul>
                        <li><NavLink to={{
                            pathname: '/about'
                        }}><h3>About</h3></NavLink></li>

                        <li><NavLink to={{
                            pathname: '/contact'
                        }}><h3>Contact</h3></NavLink></li>

                        <li><NavLink to={{
                            pathname: '/features'       
                        }}><h3>Features</h3></NavLink></li>

                      </ul> 
                    <p>&copy; Evelearn 2019</p>
            </footer>
                  
        </div>
        );
    }
}
const matchDispatchToState = dispatch => {
  return {
    logout: () => dispatch(actions.logout()),
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

const mapStateToProps = state => {
  return {
    lesson: state.lessonSet,
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps, matchDispatchToState )(LandingPage));
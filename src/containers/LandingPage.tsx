import React, { useState, useRef } from 'react';
import { NavLink, Link, Route, Switch } from 'react-router-dom';
import './LandingPage.css';
import CreateCourse from './CreateCourse/CreateCourse';
import CreateLanding from './CreateLanding/CreateLanding';
import CreateFillInTheBlank from './CreateFillInTheBlank/CreateFillInTheBlank';
import CallScreen from 'containers/CallScreen/CallScreen';
import CreateReading from './CreateReading/CreateReading';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import Quiz from './FillInTheBlank/FillInTheBlank';
import Privacy from '../components/FooterPages/Privacy';
import Contact from '../components/FooterPages/Contact';
import About from '../components/FooterPages/About';
import ReadingLesson from './ReadingLesson/ReadingLesson';
import { useStoreState } from 'store';
import Stripe from './Stripe/Stripe';
import UserPage from './UserPage/UserPage';

const LandingPage = () => {
    const history = useHistory();
    const user = useStoreState(state => state.user);
    const [displayMenuStyle, setDisplayMenuStyle] = useState('NavClose');
    const [searchBar, setSearchBar] = useState(false);
    const ref = useRef();

    const searchSubmit = (event : React.FormEvent<HTMLFormElement> | undefined ) => {
            history.push(`/search?value=${ref.current}`);
    }

    const toggleMenu = () => {
        if (displayMenuStyle === 'NavClose') {
            setDisplayMenuStyle('NavOpen')
            return
        }
        setDisplayMenuStyle('NavClose');
    }

    const logout = () => {
        history.push('/');
        // logout();
    }

    const cssClasses = [
        "MobileNavLinks",
        displayMenuStyle
    ];
        return (
            <div className="Landing">
                <header className="Header">
                    <NavLink
                        className="BrandGroupLink"
                        to={{
                            pathname: '/'
                        }} exact>

                        <div className="HeaderBrand"><span id="eve">eve</span>Learn</div>

                        <div className="LogoImage">
                        </div>
                    </NavLink>

                    {searchBar ? <div className="SearchHeader">
                        <form 
                            onSubmit={searchSubmit}
                        >
                            <input
                                type="text"
                                placeholder="Search..." /><button type="submit"><FontAwesomeIcon color="#eee" size="2x" icon={faSearch} /></button></form></div>
                        : null}

                    <div className="LinksWrapper">
                        <div className="NavTransition">
                            <Link to={{
                                pathname: '/create-reading'
                            }} id="FindTeacherNavLink">Find a Teacher</Link>
                            <div id="FindTeacherNavBorder"></div>
                        </div>
                        <div className="NavTransition">
                            <Link to={{
                                pathname: '/create-reading'
                            }} id="ClassNavLink">Find a Class</Link>
                            <div id="ClassNavBorder"></div>
                        </div>
                        <div className="NavTransition">
                            <Link to={{
                                pathname: '/create-reading'
                            }} id="TeacherNavLink">Become a Teacher</Link>
                            <div id="TeacherNavBorder"></div>
                        </div>

                        <div className="NavTransition">
                            <Link to={{
                                pathname: '/sign-up'
                            }} className='AuthNavLink'>Login</Link>
                            <div id="AuthNavBorder"></div>
                        </div>

                        <div className="NavTransition">
                            <Link to={{
                                pathname: '/login'
                            }} id="LoginNavLink">Sign up</Link>
                        </div>
                    </div>
                    {/* {this.props.user ?
                        <div className="UserDropDown">
                        
                        <div className="LoggedUserName">{this.props.user.username}</div>
                        <FontAwesomeIcon className="DropDownCaret" icon={faCaretDown} color="white" />
                        {this.props.user.picture !== "null" && this.props.user.picture !== "false" && this.props.user.picture ? <img
                        className="UserPicture"
                        src={this.props.user.picture}
                        alt="Logged In" /> : <FontAwesomeIcon className="UserPicture" onClick={(type) => this.toggleModal('login')} color="#eee" size="3x" icon={faUserCircle} />}
                        <div className="DropDownContent">
                        <div onClick={() => this.logout()}>Log Out</div>
                        <div onClick={(type) => this.toggleModal('pay')}>Go Pro</div>
                        </div>
                        </div>
                        :
                    <div><FontAwesomeIcon className="UserSVG" onClick={(type) => this.toggleModal('login')} color="#eee" size="3x" icon={faUserCircle} /></div>} */}
                    <div className="MobileWrapper">
                        <div className={cssClasses.join(' ')}>
                            <div className="MobileLogin">Create</div>
                            <div className="MobileLink"><Link
                                to={{
                                    pathname: '/'
                                }}>Home</Link></div>

                            {user ? <div className="MobileLink"><Link
                                to={{
                                    pathname: '/user'
                                }}>My Page</Link></div> : <div className="MobileLogin" onClick={(type) => console.log('login')}>Login</div>}

                            {user ? <div className="MobileLogin" onClick={() => logout()}>Logout</div> : null}
                        </div>
                        <div className="HamburgerIcon" onClick={toggleMenu}><FontAwesomeIcon color="white" size="lg" icon={faBars} /></div>
                    </div>
                </header>

                {/* {authModal ? <AuthModal togglemodal={(type) => toggleModal('login')} type={authType} loginmode={loginMode} togglelogin={() => setLoginMode(s => !s)} show={authModal} /> : null} */}
                {/* {authModal ? <Backdrop show={authModal} togglemodal={(type) => toggleModal('login')} /> : null} */}

                <Switch>
                    <Route path="/create" component={CreateLanding} />
                    <Route path="/create-course/:id" component={CreateCourse} />
                    <Route path="/create-listening" component={CreateFillInTheBlank} />
                    <Route path="/create-fill-in-the-blank" component={CreateFillInTheBlank} />
                    <Route path="/create-reading" component={CreateReading} />
                    {/* <Route path="/search/:id" render={() => <SearchResult handlesearch={handleSearch} value={''} />} /> */}
                    <Route path="/listening/:id" render={() => <Quiz test={false} />} />
                    <Route path="/quiz/:id" render={() => <Quiz test={false} />} />
                    <Route path="/reading/:id" component={ReadingLesson} />
                    <Route path="/test/:id/:class" render={() => <Quiz test={true} />} />
                    <Route path="/call-screen" component={CallScreen} />
                    <Route path="/privacy" component={Privacy} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/about" component={About} />
                    <Route path="/upgrade" component={Stripe} />
                    {/* <Route path="/" component={Lessons} /> */}

                    {user ?
                        <Route path="/user" component={() => <UserPage user={user} />} />
                        :
                        // <Route path="/" component={Lessons} />
                        null
                    }
                </Switch>

                {/* <footer className="Footer">
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
                    <p>&copy; Evelearn 2020</p>
                </footer> */}

            </div>
        );
}

export default LandingPage;
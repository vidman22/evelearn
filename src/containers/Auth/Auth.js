import React, { Component } from 'react';
import { gql, Mutation } from '@apollo/client';
import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import './Auth.css';

import * as actions from '../../store/actions';


import PasswordValidator from 'password-validator';
const schema = new PasswordValidator();

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase() 
    .has().symbols()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);


const SIGNUP_MUTATION = gql`
  mutation SignUn($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
        token
        expiresIn
        user {
            id
            email
            username
            uuid
            picture
        }
    }
}
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        expiresIn
        user {
            id
            email
            username
            uuid
            picture
        }
    }
}
`;

class Auth extends Component {
    constructor(props){
        super(props);
    this.state = {
      form: {
        username: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        },
        password: {
            value:'',
            valid: false,
            touched: false,
            msg: [],
            style: '',
        },
        email: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        }
      },
        formIsValid: true,
        isLogin: false,
        showErrorMessages: false
    }
    this.checkValidity = this.checkValidity.bind(this);
  } 


    checkValidity () {
       const form = this.state.form;
       let formIsValid;
       if (this.state.isLogin) {
        formIsValid = form.email.valid && form.password.valid;
       } else {
            formIsValid = form.email.valid && form.password.valid && form.username.valid;
        }
        this.setState({formIsValid});
    }

    inputChangedHandler = ( event, controlName ) => {
        const updatedForm = {
            ...this.state.form
        }

        const updatedElement = {
            ...updatedForm[controlName]
        }


        updatedElement.value = event.target.value;
        let value = updatedElement.value.trim();
        if (controlName === 'username') {
            
            if (value === '') {
                updatedElement.msg = 'add a name';
                updatedElement.valid = false;
                updatedElement.style = 'invalid';
            } else if (value.length > 22 ) {
                updatedElement.msg = 'add a shorter name';
                updatedElement.valid = false;
                updatedElement.style = 'invalid';
            } else {
                updatedElement.valid = true;
                updatedElement.msg = '';
                updatedElement.style = '';
            } 
        }

        if (controlName === 'email') {
            
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            const isValid = pattern.test( value );
            if (isValid) {
                updatedElement.valid = true;
                updatedElement.msg = '';
                updatedElement.style = '';
            } else {
                updatedElement.msg = 'Enter a valid email';
                updatedElement.valid = false;
                updatedElement.style = 'invalid';
            }
        }

        if (controlName === 'password') {
            
           // const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&:])[A-Za-z\d$@$!%*#?&]{8,}$/;
            //const pattern = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*():><;]*$/;
            const isValid = schema.validate(value);
                updatedElement.valid = isValid;
            if (isValid) {
                updatedElement.msg = [];
                updatedElement.style = '';
            } else {
                let messages = schema.validate(value, {list: true});
                updatedElement.style = 'invalid';
                let flags = [];
                for (let i =0; i < messages.length; i++){
                    if (messages[i] === 'min') {
                        flags.push('Minimum length is 8 characters')
                    }
                    if (messages[i] === 'uppercase') {
                        flags.push('Use at least one uppercase letter')
                    }
                    if (messages[i] === 'lowercase') {
                        flags.push('Use at least one lowercase letter')
                    }
                    if (messages[i] === 'symbols') {
                            flags.push('Use at least one symbol')
                    }
                    if (messages[i] ===  'digits') {
                            flags.push('Use at least one digit')
                    }
                    if (messages[i] ===  'oneOf') {
                            flags.push('Weak password')
                    }
                    if (messages[i] === 'maximum') {
                        flags.push('Password is too long')
                    }
                }
                updatedElement.msg = flags;
                this.setState({showErrorMessages: true});
            }

        }

        updatedElement.touched = true;

        updatedForm[controlName] = updatedElement;

        this.setState({ 
            form : updatedForm 
        },() => {
            this.checkValidity(); 
        });
        
    }

    switchAuthModeHandler = () => {
        this.props.togglelogin();
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        });
    }

    _oAuthMutation = async (Type, Email, Username, Picture, Uuid, Token, ExpiresIn) => {
      
        const result = await this.props.oAuthMutation({
            variables: {
                type: Type,
                email: Email,
                username: Username,
                picture: Picture,
                uuid: Uuid,
                token: Token,
                expiresIn: ExpiresIn
            }
        });  
        
        const resultId = result.data.oAuthSignIn.user.id;
        const { token, expiresIn } = result.data.oAuthSignIn;
        //const resultUserTableID = result.data.oAuthSignIn.user.id;
        const resultEmail = result.data.oAuthSignIn.user.email;
        const resultUsername = result.data.oAuthSignIn.user.username;
        const resultPicture = result.data.oAuthSignIn.user.picture;
        const resultUserID = result.data.oAuthSignIn.user.uuid;
        
        
        this.props.onAuth( resultId, resultEmail, resultUsername, resultPicture, resultUserID, token, expiresIn);

    }

    responseGoogle = (response) => {
          let email,
           username,
            picture,
               userID,
              token,
          expiresIn;
        
        if (response.profileObj) {
         email = response.profileObj.email;
           username = response.profileObj.givenName;
            picture = response.profileObj.imageUrl;
             userID = response.profileObj.googleId;
              token = response.tokenId;
          expiresIn = response.tokenObj.expires_in*48;
       }

        this.props.togglemodal();
        this._oAuthMutation('google', email, username, picture, userID, token, expiresIn);
    }

    // responseFacebook = (response) => {
    //       let email,
    //        username,
    //         picture,
    //          userID,
    //           token,
    //       expiresIn;
        
    //     if (response.accessToken) {
    //         email = response.email;
    //        username = response.name;
    //         picture = response.picture.data.url;
    //          userID = response.id;
    //           token = response.accessToken;
    //       expiresIn = response.expiresIn
    //     }
        
    //     this.props.togglemodal();
    //     this._oAuthMutation('facebook', email, username, picture, userID, token, expiresIn);
    // }

    completed = (data) => {
        this.props.togglemodal();
        let id;
        let email;
        let username;
        let picture;
        let uuid;
        let token;
        let expiresIn;
        
        for (let property in data) {
           id = data[property].user.id;
           email = data[property].user.email;
           username = data[property].user.username;
           picture = data[property].user.picture;
           uuid = data[property].user.uuid;
           token = data[property].token;
           expiresIn = data[property].expiresIn;
        }
        this.props.onAuth(id, email, username, picture, uuid, token, expiresIn);
    }

    render () {
        
        const login = this.state.isLogin;
        const username = this.state.form.username.value;
        const email = this.state.form.email.value;
        const password = this.state.form.password.value;
        let variables;
        if (login) {
            variables = {variables: {email, password}}
        } else variables = {variables: {username, email, password}}


        return (

            <div className="Auth">
             <Mutation
                mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                onCompleted={data => this.completed(data)}
             >
                {(mutation, {loading, error}) => (
                <div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        mutation(variables);
                        }}>
                    {!login && (
                      <div>
                        <input
                            className={this.state.form.username.style}  
                            value={this.state.form.username.value}
                            onChange={( e ) => this.inputChangedHandler(e , 'username')}
                            type="text"
                            placeholder="username"
                        />
                        { false ? <div className="UsernameError"><p>{this.state.form.username.msg}</p></div> : null}
                      </div>
                    )}
                    <input
                        className={this.state.form.email.style} 
                        value={this.state.form.email.value}
                        onChange={( e ) => this.inputChangedHandler(e , 'email')}
                        type="email"
                        placeholder="email"
                    />
                    {false ? <div className="EmailError"><p>{this.state.form.email.msg}</p></div> : null}
                    <input
                        className={this.state.form.password.style}  
                        value={this.state.form.password.value}
                        onChange={( e ) => this.inputChangedHandler(e , 'password')}
                        type="password"
                        placeholder="password"
                    />
                    {this.state.showErrorMessages && !login && this.state.form.password.msg.length ? 
                        <div className="PasswordMessages">
                            <ul>
                                {this.state.form.password.msg.map((amsg, index) => (
                                    <li key ={index}><p>{amsg}</p></li> 
                                ))} 
                            </ul>
                        </div>: null} 
                        <button type="submit" className="AuthButton" disabled={!this.state.formIsValid}>
                            {login ? 'LOGIN' : 'CREATE AN ACCOUNT'}
                        </button>
                </form>
                {loading && <div className="spinner spinner-1"></div>}
                {error && <p>error</p>}
               </div>    
             )}
             </Mutation>
                
              <button className="SwitchAuthButton" onClick={this.switchAuthModeHandler}>{ login ? 'SWITCH TO SIGNUP' : 'ALREADY HAVE AN ACCOUNT?'}</button>
                
                    <GoogleLogin
                        
                        clientId='99023560874-es09obh5s0o70hd5j3lstp9lagsq395d.apps.googleusercontent.com'
                        buttonText={`Continue with Google`}
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        render={ renderProps => (
                          
                            <div className="GoogleLogin" onClick={renderProps.onClick}>
                                <svg
                                className="GoogleSVG" 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24"
                                viewBox="0 0 48 48" >
                                <path d="M43.61 20.082H42V20H24v8h11.305c-1.653 4.656-6.082 8-11.305 
                                 8-6.629 0-12-5.371-12-12s5.371-12 12-12c3.059 0 5.844 1.152 7.96 3.04l5.657-5.657C34.047 
                                    6.055 29.27 4 24 4 12.953 4 4 12.953 4 24s8.953 20 20 20 20-8.953 20-20c0-1.34-.137-2.648-.39-3.918z"
                                    fill="#ffc107"/><path d="M6.305 14.691l6.574 4.82C14.656 15.11 18.96 12 24 12c3.059 0 5.844 1.152 7.96 
                                    3.04l5.657-5.657C34.047 6.055 29.27 4 24 4 16.316 4 9.656 8.336 6.305 14.691z" fill="#ff3d00"/><path d="M24 
                                    44c5.164 0 9.86-1.977 13.41-5.191L31.22 33.57A11.918 11.918 0 0 1 24 36c-5.203 0-9.617-3.316-11.281-7.945l-6.524
                                    5.023C9.504 39.555 16.227 44 24 44z" fill="#4caf50"/><path d="M43.61 20.082H42V20H24v8h11.305a12.054 12.054 0 0 
                                    1-4.09 5.57h.004l6.191 5.239C36.973 39.203 44 34 44 24c0-1.34-.137-2.648-.39-3.918z" fill="#1976d2"/>
                                </svg>
                                <div className="GoogleText">Continue with Google</div>
                            </div> 
                    )}/> 

                {/*<FacebookLogin
                    
                    appId="652524795116405"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={this.responseFacebook} 
                    render={renderProps => (
                    <div className="FacebookLogin" onClick={renderProps.onClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        className="FacebookSVG"
                        viewBox="0 0 24 24" 
                        width="24" 
                        height="24" 
                        fill="#4f60bd">
                        <path d="M17.525 9H14V7c0-1.032.084-1.682 1.563-1.682h1.868v-3.18A26.065 26.065 0 0 0 14.693 2C11.98 
                        2 10 3.657 10 6.699V9H7v4l3-.001V22h4v-9.003l3.066-.001L17.525 9z"/></svg>
                        <div className="FacebookText">Continue with Facebook</div>
                    </div>
                    )}/> */}
            </div>
        );
    }
};

const OAUTH_MUTATION = gql`
    mutation($type: String!, $email: String!, $username: String!, $picture: String, $uuid: String!, $token: String!, $expiresIn: Int ) {
        oAuthSignIn( type: $type, email: $email, username: $username, picture: $picture, uuid: $uuid, token: $token, expiresIn: $expiresIn) {
            token
            expiresIn
            user {
                id
                email
                username
                uuid
                picture
            }
        }
    }
`;

export default Auth;

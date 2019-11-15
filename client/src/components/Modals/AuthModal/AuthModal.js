import React  from "react";
import Auth from '../../../containers/Auth/Auth';
import Stripe from '../../../containers/Stripe/Stripe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import "./AuthModal.css";


const modal = props => {
  const cssClasses = [
    "AuthModal",
    props.show ? "AuthModalOpen" : "AuthModalClosed"
  ];
  return (
          <div className={cssClasses.join(' ')}>
            <div className="AuthModalHeader">
            
            
            {props.type === 'pay' ? <h2>Go Kwinzo-Pro</h2> : (props.loginmode) ? <h2>Login</h2> : <h2>Sign Up</h2> }
            <FontAwesomeIcon icon={faTimesCircle} onclick={props.togglemodal} classname={"CloseModal"}/>
            </div>
          {props.type === 'pay' ? <Stripe /> : <Auth togglelogin={props.togglelogin} togglemodal={props.togglemodal}/> }
          </div>
  );
};

export default modal;
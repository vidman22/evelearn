import React  from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import "./DeleteModal.css";


const modal = props => {
  const cssClasses = [
    "ClassDeleteModal",
    props.show ? "ModalOpen" : "ModalClosed"
  ];
  return (
          <div className={cssClasses.join(' ')}>
            
              <FontAwesomeIcon icon={faTimes} onclick={props.togglemodal} classname="CloseClassDeleteModal"/>
        
              <div className="ClassDeleteModalHeader">
                <h2>Are you sure you want to {props.modalmessage}</h2>
              </div>
                <button onClick={() => props.onclick(true)}>Yes</button>
                <button onClick={() => props.onclick(false)}>No</button>
          </div>
  );
};

export default modal;
import React  from 'react';

export const OmissionWithOptions = (props) => {
    console.log("redux props", props);
        const formindex = Number(props.formindex);
        let omission;
        if(props.omissionsWithOptions && props.omissionsWithOptions.byId ) {
          
          omission = props.omissionsWithOptions.byId[`formIndex${formindex}`];
          console.log("omission in options", omission);
        }
        return (
                <span ref={props.ref}>{formindex + 1 + ". "}<span style={{textDecoration: 'underline'}}>{omission && omission.id  === formindex ?  omission.option :  " ______" }</span></span>
        );
}

export default OmissionWithOptions;

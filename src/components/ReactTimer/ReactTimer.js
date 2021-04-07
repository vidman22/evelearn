import React from 'react';
import Timer from 'react-compound-timer';

const ReactTimer = (props) => {
    return (
      <Timer
        initialTime={props.initialTime}
        startImmediately={props.startImmediately}
        direction="backward"
        checkpoints={[
          {
            time: 0,
            callback: () => console.log("end")
          }
        ]}  
      >
            {({ start, resume, pause, stop, reset }) => (
          <React.Fragment>
              <div className="TimerInline">
                  <div>Timer </div>
                    <Timer.Hours /> : 
                    <Timer.Minutes /> : 
                    <Timer.Seconds /> 
              </div>
              
              <br />
              {props.showControls ? <div>
                  <button onClick={start}>Start</button>
                  <button onClick={pause}>Pause</button>
                  <button onClick={resume}>Resume</button>
                  <button onClick={stop}>Stop</button>
                  <button onClick={reset}>Reset</button>
              </div> : null}
          </React.Fragment>
      )}
      </Timer>
    )
  }

export default ReactTimer;

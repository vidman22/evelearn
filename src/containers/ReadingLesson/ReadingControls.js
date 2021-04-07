 import React from 'react';
 
 const ReadingControls = () => {
     return (
         <div>
             {/* <div className="SpeedReadingWrapper">
              <div className="ReadingControlButtons">
                <button 
                  className="StartReadingButton" 
                  disabled={this.state.readingSpeedRunning}
                  onClick={()=> this.startReading()}>Start</button>
                <button 
                  className="StartReadingButton" 
                  disabled={!this.state.readingSpeedRunning}
                  onClick={()=> this.pauseReading()}>Pause</button>
                <button 
                  className="StartReadingButton" 
                  onClick={()=> this.restartReading()}>Reset</button>
              </div>
                  <h4>Text Decoration</h4>
                  {this.state.readingStyles.map( (style, index ) => { 
                     return <label className="StyleCheckLabel" key={index}>{style.kind}
                        <input 
                          type="checkbox"
                          className="StyleCheckBox"
                          name={style.kind} 
                          checked={style.checked}  
                          onChange={() => this.onCheck(style.kind)}/></label>
                  })}
                  <h4>Background Color</h4>
                    
                      {this.state.backgroundColors.map((color, index) => (
                        <label className="BackgroundColorContainer" key={index}>
                          <input 
                            type="radio"
                            className="StyleRadio"
                            value={color.color}
                            name="radio"
                            checked={color.color === this.state.backgroundColorSelected}
                            onChange={() => this.changeColor(color.color)} />
                          {color.color}
                        </label>
                      ))}
                    
                  <h4>Reading Speed (words per minute)</h4>
                  <select 
                    disabled={this.state.readingSpeedRunning}
                    className="ReadinSpeedSelect"
                    style={{width: '100px'}}
                    value={this.state.readingSpeedValue} 
                    onChange={(event) => this.handleSpeedChange(event)}>
                   {this.state.readingSpeeds.map((speed, index) => (<option key={index} value={speed}>{speed}</option>))}
                  </select>
                  <h4>Text Transparency</h4>
                  <input type="range" min="0" max="10" className="Slider" value={this.state.textTransparency} onChange={(e) => this.slider(e)}></input>
                  <div>{this.state.textTransparency}</div>
            </div>*/}
         </div>
     );
 }
 
 export default ReadingControls;
            
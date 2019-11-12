import React from 'react';
import './ReadingTable.css';

const ReadingTable = (props) => {
    console.log("table props", props);
    let table = [];
    for (let i = 0; i < props.table.length; i++){
        let children = [];
        
        for (let j = 0; j < props.table[i].length; j++){
            // console.log("property", j);
                if (props.table[i][j].draggable){
                    children.push(
                        <td 
                            style={props.table[i][j].style}
                            draggable={props.table[i][j].draggable}
                            onDrop={(e) => props.ondrop(e, props.formIndex, i, j)} 
                            onDragOver={(e) => props.ondragover(e, props.formIndex, i, j)} 
                            onDragExit={(e) => props.ondragexit(e, props.formIndex, i, j)} 
                            key={j}>{props.table[i][j].value}
                        </td>)
                } else {
                    children.push(
                        <td 
                            key={j}>{props.table[i][j].value}
                        </td>)
                }
                
        }
        table.push(<tr key={i}>{children}</tr>)
    }
    return (
        <div className="ReadingTable">
            <p>{props.formIndex + 1}.</p>
            <table>
                <tbody>
                    {table}
                </tbody>
            </table>
            {props.options.map((option, index) => {

                 return <div 
                            className={option.hidden ? "TableDragOptionHidden" : "TableDragOption" }
                            draggable={option.draggable} 
                            onDragStart={(e) => props.ondragstart(e, props.formIndex, index, option.value, index)} 
                            key={index}>{option.value}
                        </div>
               
            })}
        </div>
        
    );
}

export default ReadingTable;

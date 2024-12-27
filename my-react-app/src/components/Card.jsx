import React from "react";

function Card(props){
    return(
      <div className="cardContainer">  
        <div className="profileImg">
            <img src={props.img}></img>
        </div>
        <div className="profileName">
            <h1>{props.name}</h1>
        </div>
        <div className="profileTeam">
            <h1>{props.team}</h1>
        </div>
        <div className="profilePosition">
            <h1>{props.position}</h1>
        </div>
      </div>
    )
}

export default Card;
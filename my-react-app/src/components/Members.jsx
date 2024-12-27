import React from "react";
import Card from "../components/Card";
import members from "/src/members.js";

function Members(){
    return(
        <div className="membersContainer">
            {members.map(items=>(
                <Card img = {items.img} name = {items.name} position = {items.position} team = {items.team}/>)
            )}
        </div>
    )
}

export default Members;
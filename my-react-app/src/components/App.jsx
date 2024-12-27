import React from "react";
import Header from "../components/Header";
import Members from "../components/Members";

function App(){
    return(<div>
       <div className="video-container">
            <video autoPlay loop muted className="background-video">
                <source src="videos/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="content">

                <div style={{ height: '2000px' }}> {/* Placeholder for scrolling */}
                    <Header/>
                    <Members/>
                </div>
            </div>
        </div>
    </div>);
}

export default App;
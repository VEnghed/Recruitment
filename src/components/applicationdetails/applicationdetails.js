import './applicationdetails.css';
import React, { useState } from "react";


/**
 * @description Function for the application-details page, generates all necessary frontend
 * @param {*} props used for sending data
 * @returns A react component with frontend HTML.
 */
function Applicationpage(props) {
    let [msgToUser, setMsgToUser] = useState("");
    let [application, setApplication] = useState({});

    /**
     * @description Fetch application information from server (database)
     */
    function fetchInfo() {
        fetch('/application/get', {
            method: 'GET', 
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        }).then(response => {
            //If something went wrong with saving application
            if(response.status === 500) {   // internal error
                console.log("internal error")
                setMsgToUser("Could not get application, internal server error, please try again")
            } 
            else if(response.status === 200) {    
                console.log("Success")
                response.json().then(body => setApplication(body));
            }
        })
    }


    fetchInfo();
    return (
        <div className="applicationdetails">
            
            <header className="applicationdetails-header"> {/* use the same header for every page so replace this?? */}
                <p>Preliminary application-details page!</p>
            </header>
            
            <div id="applicationdetails-content">    
            <p>{msgToUser}</p>
            {application}
            </div>
        </div>

    );
}
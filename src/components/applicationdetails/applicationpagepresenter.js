import React, { useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import ApplicationDetails from './applicationdetails.js';


/**
 * Function component for the application details page
 */
function DetailspagePresenter() {
    let [application, setApplication] = useState("Loading...");
    let myToken = window.localStorage.getItem("token");
    let [msgToUser, setMsgToUser] = useState("");
    let {id} = useParams();

    /**
     * @description Fetch application information from server (database), 
     * the application is identified by a parameter in the page url
     */
    function fetchInfo() {
        console.log("FETCHING DETAILS");
        fetch('/application/det/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + myToken
            }
        }).then(response => {
            //If something went wrong with saving application
            console.log(response);
            if (response.status === 500) { // internal error
                console.log("internal error");
                setApplication("");
                setMsgToUser("Could not get application, internal server error, please try again");
            }
            else if (response.status === 200) {
                console.log("Success");
                response.json().then(body => {
                    let deets = body.applicationDetails;
                    console.log(JSON.stringify(body.applicationDetails));
                    let userdata = {firstname: deets[0].firstname, lastname: deets[0].lastname, username:deets[0].username, email: deets[0].email};
                    let appDetailsComponent = <ApplicationDetails
                                                userdata={userdata}
                                                availabilities={deets[0].availabilities} 
                                                competencies={deets[0].competences}
                                                applicationStatus={deets[0].applicationStatuses}/>;
                    setApplication(appDetailsComponent)
                });
            }
            else if(response.status === 400) {
                console.log("Wrong input");
                //console.log(response)
                let errorsInRes = response.statusText;
                console.log(errorsInRes);
                setMsgToUser("Could not load application details: " + errorsInRes)
            }
            else if (response.status === 401) {
                window.location = "/"; 
            }
            else if (response.status === 302) {
                console.log("redirect");
                window.location = "/" ;
            }
        }).catch(err => {
            console.log("something went wrong" + err);
        });

    }

    /**
     * @description When component mounts, this function will be called which fetches the details of the application in question
     * The application is identified through the page url
     */
    useEffect(() => {
        fetchInfo();
        console.log("mount   " + JSON.stringify(application))
        }, []
    );

   

    return (
        <div className="applicationdetails">
            <h3>Applicationdetails page</h3>
            <div id="applicationdetails-content">    
            
            
            {/*Application details component goes here when it gets rendered*/}
            <div id="applicationdetails-component">{application}</div>
            <p>{msgToUser}</p>
            </div>
        </div>

    );
}

export default DetailspagePresenter;
import './applicationdetails.css';
import React, { useState, useEffect} from "react";
import {useParams} from 'react-router-dom';

/**
 * @description Function for the application-details page, generates all necessary frontend
 * @param {*} props used for sending data
 * @returns A react component with frontend HTML.
 */
function ApplicationDetails(props) { 
    let [availabilities, setAvailabilities] = useState("");
    let [competencies, setCompetencies] = useState("");
    let [status, setStatus] = useState("");
    let [msgToUser, setMsgToUser] = useState("");
    let myToken = window.localStorage.getItem("token");
    
    /**
     * Creates list items containing the important availabilities data
     * @param {*} themProps Contains the data
     */
    function listAvailabilities(themProps) {
        console.log("props " + JSON.stringify(themProps));
        let avails = themProps.availabilities;
        let avs = avails.map(av => (
            <li><p>From: {av.from_date}, To: {av.to_date}</p></li>
        ));
        setAvailabilities(avs);
    }

    /**
     * Creates list items containing the important competencies data
     * @param {*} themProps Contains the data
     */
    function listCompetencies(themProps) {
        let comps = themProps.competencies;


        let cmps = comps.map(cmp => (
            <li><p>Competence: {cmp.name}, Years experience: {cmp.competenceprofile.years_of_experience}</p></li>
        ));
        setCompetencies(cmps);
    }
    /**
     * Creates elements with important application data.
     * @param {*} themProps Contains the data
     */
    function listAppStatus(themProps) {
        let appStatus = themProps.applicationStatus;
        let stats = appStatus.map(st => (
            <li><p>Application Date: {st.application_date}, Application status: {st.status}</p></li>
        ));
        setStatus(stats);
    }


    /**
     * @description When component mounts, this function will be called which creates html elements containing data
     */
    useEffect(() => {
        listAvailabilities(props);
        listCompetencies(props);
        listAppStatus(props);
        console.log("details listed")
        }, []
    );

     /**
     * @description Is called when user clicks accepted button, which means the application is accepted
     */
    function onAcceptClick() {
        let statusChange = {};
        statusChange.person = props.userdata.username;
        statusChange.applicationStatus = "accepted";
        postStatus(statusChange);
    }

    /**
     * @description Is called when user clicks Rejected button, which means the application is rejected
     */
    function onRejectClick() {
        let statusChange = {};
        statusChange.person = props.userdata.username;
        statusChange.applicationStatus = "rejected";
        console.log(statusChange)
        postStatus(statusChange);
    }

    /**
     * @description Sends a post request to server which in turn changes an applications status according to @param statusChange
     * @param {*} statusChange The change in the applications status.
     */
    function postStatus(statusChange) {
        fetch('/application/status', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + myToken
            },
            body: JSON.stringify(statusChange)
        }).then(response => {
            //If something went wrong with saving application
            if(response.status === 500) {   // internal error
                console.log("internal error")
                setMsgToUser("Could not save application status, internal server error, please try again")
                
            } 
            else if(response.status === 200) {    
                console.log("Success")
                setMsgToUser("Application status saved")
            }
            else if (response.status === 302) {
                console.log("redirect")
                window.location = "/" 
            }
            else if (response.status === 401) {
                window.location = "/"; 
            }
            else if(response.status === 400) {
                console.log("Wrong input")
                //console.log(response)
                let errorsInRes = response.statusText;
                console.log(errorsInRes);
                setMsgToUser("Could not save application status: " + errorsInRes)
            }
        })
    }

    return (
        <div className="applicationdetails">
            <div id="userdata">
                <div id="names">
                    <p>Firstname: {props.userdata.firstname}</p><p>Lastname: {props.userdata.lastname}</p>
                    <p>Username: {props.userdata.username}</p><p>Email: {props.userdata.email}</p>
                </div>
            </div>
            <div id="availabilities">
                <ul id="dates">
                    {availabilities}
                </ul>
            </div>
            <div id="competencies">
                <ul id="comps">
                    {competencies}
                </ul>
            </div>
            <div id="applicationStatus">
                <ul id="status">
                    {status}
                </ul>
            </div>
            <div></div>

            <p>{msgToUser}</p>
            <button onClick={() => onAcceptClick()}>Accept</button>
            <button onClick={() => onRejectClick()}>Reject</button>
        </div>

    );
}
export default ApplicationDetails;
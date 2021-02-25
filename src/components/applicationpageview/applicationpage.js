import './applicationpage.css';
import React, { useState } from "react";

//global arrays use to store user input, probably not a great way to do it
let competenceArray = [];
let availabilityArray = [];

/**
 * @description Function for the application page, generates all necessary frontend
 * @param {*} props used for sending data
 * @returns A react component with frontend HTML.
 */
function Applicationpage(props) {
    
    let [competenceList, setCompetenceList] = useState([]);
    let [comp, set_comp] = useState("");
    let [yearsexp, set_yearsexp] = useState("");
    
    let [availabilityList, setAvailabilityList] = useState([]);
    let [from_date, set_from_date] = useState("");
    let [to_date, set_to_date] = useState("");
    
    //For showing success- and error-messages
    let [msgToUser, setMsgToUser] = useState("");
    
    /**
     * @description Adds a competence to the array for competencies with the right format
     * @param {*} comp The competence
     * @param {*} exp Years experience
     */
    function addCompetenceToArr (comp, exp) {
        //let newElem = {"competence" : comp, "yearsExperience": exp};
        let id;
        if (comp === "Korvgrillning")
            id = 1;
        else 
            id = 2;

        let newElem = {competence_id: id, competence: comp, years_experience: exp};
        competenceArray.push(newElem);
    } 

    /**
     * @description Adds an availability element to the availability array
     * @param {*} avFrom The available from date
     * @param {*} avTo The available to date
     */
    function addAvailabilityToArr (avFrom, avTo) {
        let newElem = {"availableFrom":avFrom, "availableTo":avTo};
        availabilityArray.push(newElem);
    }

    /**
     * @description Function for adding a react component
     * @param prop Used for sending variables that can be used inside this function
     */
    const Av = (prop) => {
        let from = prop.from_date
        let to = prop.to_date
        return (
            <div className="Availability">
                <p>From: {from} To: {to}</p>
            </div>
        );
    };

    /**
     * @description function for adding a react component called competence
     * @param prop Used to send variables to this component that can be used inside it
     */
    const Comp = (prop) => {
        let cmp = prop.compet;
        let yearsexper = prop.exper;

        return (
            <div className="Competence">
                <p>Competence: {cmp} Years experience: {yearsexper}</p>
            </div>
        );
    };
    
    /**
     * @description Adds another availability component to the page, availability array, and availabilyList state
     * @param {*} event The event that triggers this function
     */   
    function onAddAvailabilityClick() {
        
        if(from_date === "" && to_date === "") {
            setMsgToUser("Please choose both from and to dates")
            return;
        }
        else if(from_date === "") {
            setMsgToUser("Please choose from date");
            return;
        }
        else if(to_date === "") {    
            setMsgToUser("Please choose to date");
            return;
        }
        
        const newAvailability = <Av from_date={from_date} to_date={to_date} identifier={availabilityList.length} key={availabilityList.length}/>
        availabilityList = [...availabilityList, newAvailability]
        setAvailabilityList(availabilityList);
        addAvailabilityToArr(from_date, to_date);

        set_from_date("");
        set_to_date("");
        setMsgToUser("");
    }


    /**
     * @description Adds another competence component to the page, competence array and competenceList state
     * @param {*} event The event that triggers this function
     */
    function onAddCompetenceClick() {
        if(comp === "" && yearsexp === "") {
            setMsgToUser("Please choose both competence and years experience")
            return;
        }
        else if(yearsexp === "") {
            setMsgToUser("Please choose years experience");
            return;
        }
        else if(comp === "") {    
            setMsgToUser("Please choose competence");
            return;
        }

        const newCompetence = <Comp compet={comp} exper={yearsexp} identifier={competenceList.length} key={competenceList.length}></Comp>
        competenceList = [...competenceList, newCompetence]
        addCompetenceToArr(comp, yearsexp);
        setCompetenceList(competenceList);
        set_comp("");
        set_yearsexp("");
        setMsgToUser("");
    }

    /**
     * @description This function sends application data (json format) to the server and handles the server response 
     * @param applicationData The data to send
     */
    function sendApplication(applicationData) {
        let application =  {availabilities: applicationData.availabilityArray, 
                            competencies: applicationData.competenceArray, 
                            applicant: applicationData.applicant
        };
        console.log("Sending application: " + JSON.stringify(application))
        fetch('/application/post', {
            method: 'POST', 
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(application)
        }).then(response => {
            //If something went wrong with saving application
            if(response.status === 500) {   // internal error
                console.log("internal error")
                setMsgToUser("Could not save application, internal server error, please try again")
                
            } 
            else if(response.status === 200) {    
                console.log("Success")
                setMsgToUser("Application saved")
            }
            else if(response.status === 400) {
                console.log("Wrong input")
                //console.log(response)
                let errorsInRes = response.statusText;
                console.log(errorsInRes);
                setMsgToUser("Could not save application" + errorsInRes)
            }
        })
    }

    /**
     * @description Gathers data from user input and uses it to send application to server with the sendApplication function.
     * Uses availability, competence arrays
     */
    function onSendApplicationClick() {
        //gather data
        //remove applicant below send jwt token instead
        let applicant = {
            role: 2,
            firstName: "firstName",
            lastName: "lastName",
            username: "username",
            ssn: 11234674576,
            password: "password",
            email: "email@email.com",
            pid: 11,
        }
        let applicationData = {availabilityArray, competenceArray, applicant};
        if (availabilityArray.length === 0 || competenceArray.length === 0) {
            setMsgToUser("Please add competencies and/or availabilities");
            return;
        } 
        console.log(applicationData);
        sendApplication(applicationData);
    }

    /**
     * @description Reset/delete all data in application by clearing states and arrays.
     */
    function onResetApplicationClick() {
        setCompetenceList([]);
        set_comp("");
        set_yearsexp("");
        setAvailabilityList([]);
        set_from_date("");
        set_to_date("");
        
        
        competenceArray = [];
        availabilityArray = [];
        setMsgToUser("Application has been reset");
    }

    return (
        <div className="applicationpage">
            
            <header className="applicationpage-header"> {/* use the same header for every page so replace this?? */}
                <p>Preliminary application page!</p>
            </header>
            
            <div id="applicationpage-content">    
                
                <div id="application">
                    <h2>Application</h2>
                    <div id="application-items">
                        
                        <div id="competencies">
                            <h3>Competencies</h3>
                            {/* Competence list goes here! */}
                            {competenceList}
                        </div>
                        <div id="availabilities">
                            <h3>Availabilities</h3>
                            {availabilityList}
                        </div>
                    </div>
                    
                </div>
                <div id="application-inputs">
                    <div id="competence-stuff">
                        
                        <div id="competenceInputs">
                            <div id="competenceSelector">
                                <p>Competence: </p>
                                <select value={comp} 
                                    onChange={event => set_comp(event.target.value)} 
                                    name="competency-select" className="competency-select">
                                    <option value="">--Välj ett alternativ--</option>
                                    {/*Remove hardcoded alternatives, fetch from database */}
                                    <option value="Korvgrillning">Korvgrillning</option>
                                    <option value="Städning">Städning</option>
                                </select>
                            </div>
                            <div id="yearsExperience">
                                <p>Years of experience: </p>
                                {/* Ensure that only numbers can be entered here! */}
                                <input value={yearsexp} type="number" min="0" max="99" className="experience" 
                                    onChange={event => set_yearsexp(event.target.value)}>
                                </input>
                            </div>
                        </div>
                        <button  onClick={() => onAddCompetenceClick()}>Add competence</button>
                    </div>
                    <div id="availability-stuff">
                        {/*Make sure available-from is before available-to somehow*/}
                        <div id="availabilitySelect">
                            <p>Available from:</p>
                            <input value={from_date} 
                                onChange={event => set_from_date(event.target.value)} 
                                type="date" className="available-from" name="available-from"
                                min="2021-02-01" max="2030-12-31">
                            </input>
                                
                            <p>Available to:</p>
                            <input value={to_date} 
                                onChange={event => set_to_date(event.target.value)} 
                                type="date" className="available-to" name="available-to"
                                min="2021-02-01" max="2040-12-31">
                            </input>
                        </div>
                        <button onClick={() => onAddAvailabilityClick()}>Add availability</button>
                    </div>
                </div>
                <p id="msgToUser">{msgToUser}</p>
                <div id="reset-application">
                <button onClick={() => onResetApplicationClick()}>Reset application</button>
                </div>
                <div id="send-application">
                    <button onClick={() => onSendApplicationClick()}>Send application</button>
                </div>
            </div>
        </div>

    );
}

export default Applicationpage;
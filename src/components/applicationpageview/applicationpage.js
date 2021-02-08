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
    let [availabilityList, setAvailabilityList] = useState([]);
    
    
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
     * @description Changes a competency in the competency array
     * identified by @param id, using the parameters @param comp, @param exp 
     * @param {*} id Identifies the row/entry in the array
     * @param {*} comp The competency
     * @param {*} exp The years experience
     */
    function changeCompArray (id, comp, exp) {
        //competenceArray[id] = {"competence":comp, "yearsExperience":exp}
        let cid;
        if (comp === "Korvgrillning")
            cid = 1;
        else 
            cid = 2;
        competenceArray[id] = {competence_id: cid, competence: comp, years_experience: exp}
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
     * @description Changes an element in the availability array 
     * identified by @param id, with the parameters @param avFrom and @param avTo
     * @param {*} id Identifies row/element in availability array
     * @param {*} avFrom The available from date
     * @param {*} avTo The available to date
     */
    function changeAvArray (id, avFrom, avTo) {
        availabilityArray[id] = {"availableFrom":avFrom, "availableTo":avTo};
    }

    /**
     * @description function for adding a react component called competence
     * @param prop Used to send variables to this component that can be used inside it
     */
    const Competence = (prop) => {
        const [competence, setCompetence] = useState('')
        const [yearsExperience, setYearsExperience] = useState('')
        /**
         * 
         * @param {*} stateVal Value in the state
         * @param {*} identifier The row that should be changed in the array 
         * @param {*} comp The competence
         * @param {*} exp Years experience
         */
        function changeCompetence(stateVal, identifier, comp, exp) {
            setCompetence(stateVal);
            changeCompArray(identifier, comp, exp);
        }
        
        /**
         * 
         * @param {*} stateVal Value in the state
         * @param {*} identifier The row that should be changed in the array 
         * @param {*} comp The competence
         * @param {*} exp The experience
         */
        function changeYearsExperience(stateVal, identifier, comp, exp) {
            setYearsExperience(stateVal);
            changeCompArray(identifier, comp, exp);
        }
        return (
            <div className="Competence">
                <p>Choose competence:</p>
                    <select value={competence} 
                        onChange={event => changeCompetence(event.target.value, 
                                                        prop.identifier, 
                                                        event.target.value, 
                                                        yearsExperience)} 
                    name="competency-select" className="competency-select">
                        <option value="">--Välj ett alternativ--</option>
                        {/*Remove hardcoded alternatives, fetch from database */}
                        <option value="Korvgrillning">Korvgrillning</option>
                        <option value="Städning">Städning</option>
                    </select>
                    <div className="yearsExperience">
                        <p>Years of experience</p>
                        {/* Ensure that only numbers can be entered here! */}
                        <input value={yearsExperience} type="number" className="experience" 
                            onChange={event => changeYearsExperience(event.target.value, 
                                                                    prop.identifier, 
                                                                    competence, 
                                                                    event.target.value)}>
                        </input>
                    </div>
            </div>
        );
    }

    
    /**
     * @description Adds another competence component to the page, competence array and competenceList state
     * @param {*} event The event that triggers this function
     */
    const onAddCompetenceClick = event => {
        //Do not add too many competencies
        if(competenceList.length <= 2) {
            const newCompetence = <Competence identifier={competenceList.length} key={competenceList.length}/>
            competenceList = [...competenceList, newCompetence]
            
            addCompetenceToArr("", "");
            setCompetenceList(competenceList);
            //setCompetenceList(competenceList.concat(<Competence key={competenceList.length} />));
        }        
    };

    /**
     * @description Function for adding a react component
     * @param prop Used for sending variables that can be used inside this function
     */
    const Availability = (prop) => {
        const [availableTo, setAvailableTo] = useState('')
        const [availableFrom, setAvailableFrom] = useState('')
        
        function changeAvFrom(stateVal, identifier, avFrom) {
            setAvailableFrom(stateVal);
            changeAvArray(identifier, avFrom, availableTo);
        }
        function changeAvTo(stateVal, identifier, avTo) {
            setAvailableTo(stateVal);
            changeAvArray(identifier, availableFrom, avTo);
        }
        return (
            <div className="Availability">
                <p>Available from:</p>
                <input value={availableFrom} 
                    onChange={event => changeAvFrom(event.target.value, 
                                                    prop.identifier, 
                                                    event.target.value)} 
                    type="date" className="available-from" name="available-from"
                    min="2021-02-01" max="2030-12-31">
                </input>
                    
                <p>Available to:</p>
                <input value={availableTo} 
                    onChange={event => changeAvTo(event.target.value, 
                                                    prop.identifier, 
                                                    event.target.value)} 
                    type="date" className="available-to" name="available-to"
                    min="2021-02-01" max="2040-12-31">
                </input>
            </div>
        );
    };

    /**
     * @description Adds another availability component to the page, availability array, and availabilyList state
     * @param {*} event The event that triggers this function
     */   
    const onAddAvailabilityClick = event => {
        const newAvailability = <Availability identifier={availabilityList.length} key={availabilityList.length}/>
        availabilityList = [...availabilityList, newAvailability]
        setAvailabilityList(availabilityList);
        addAvailabilityToArr("test", "test")
    };


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
            } 
            else if(response.status === 200) {    
                console.log("Success")
            }
            else if(response.status === 201) {    
                console.log("Something else")
            }
            else if(response.status === 400) {
                console.log("Wrong input")
                console.log(JSON.stringify(response))
            }
        })
    }

    /**
     * @description Gathers data from user input and uses it to send application to server with the sendApplication function.
     * Uses availability, competence arrays
     */
    function onSendApplicationClick() {
        //gather data
        //Applicant should not be hardcoded
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
        console.log(applicationData);
        sendApplication(applicationData);
    }

    return (
        <div className="applicationpage">
            
            <header className="applicationpage-header"> {/* use the same header for every page so replace this?? */}
                <p>Preliminary application page!</p>
            </header>
            
            <div id="applicationpage-content">    
                <div id="competencies">
                    <h3>Competencies</h3>
                    {/* Competence list goes here! */}
                    {competenceList}
                    <button  onClick={() => onAddCompetenceClick()}>Add competence</button>
                </div>
                <div id="availabilities">
                    {/*Make sure available-from is before available-to somehow*/}
                    <h3>Availability</h3>
                    {availabilityList}
                    <button onClick={() => onAddAvailabilityClick()}>Add availability</button>
                </div>

                <div id="send-application">
                    <button onClick={() => onSendApplicationClick()}>Send application</button>
                </div>
            </div>
        </div>

    );
}

export default Applicationpage;
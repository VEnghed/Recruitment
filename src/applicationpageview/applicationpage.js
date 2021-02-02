import './applicationpage.css';
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom"; //Not used


//global arrays use to store user input, probably not a great way to do it
let competenceArray = [];
let availabilityArray = [];

/**
 * 
 * @param {*} props 
 */
function Applicationpage(props) {
    
    let [competenceList, setCompetenceList] = useState([]);
    let [availabilityList, setAvailabilityList] = useState([]);
    
    

    function addCompetenceToArr (comp, exp) {
        let newElem = {"comp" : comp, "exp": exp};
        competenceArray.push(newElem);
    } 
    function changeCompArray (id, comp, exp) {
        competenceArray[id] = {"comp":comp, "exp":exp}
        console.log(competenceArray);
    }

    function addAvailabilityToArr (avFrom, avTo) {
        let newElem = {"avFrom":avFrom, "avTo":avTo};
        availabilityArray.push(newElem);
    }
    function changeAvArray (id, avFrom, avTo) {
        availabilityArray[id] = {"avFrom":avFrom, "avTo":avTo};
        console.log(availabilityArray);
    }

    const textInput = useRef(null);
    

    /**
     * function for adding a react component
     */
    const Competence = (props) => {
        const [competence, setCompetence] = useState('')
        const [yearsExperience, setYearsExperience] = useState('')
        /**
         * 
         * @param {*} stateVal 
         * @param {*} identifier 
         * @param {*} comp 
         * @param {*} exp 
         */
        function changeCompetence(stateVal, identifier, comp, exp) {
            setCompetence(stateVal);
            changeCompArray(identifier, comp, exp);
        };
        
        /**
         * 
         * @param {*} stateVal 
         * @param {*} identifier 
         * @param {*} comp 
         * @param {*} exp 
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
                                                        props.identifier, 
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
                                                                    props.identifier, 
                                                                    competence, 
                                                                    event.target.value)}>
                        </input>
                    </div>
            </div>
        );
    }

    //Add another competence
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
     * function for adding a react component
     */
    const Availability = (props) => {
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
                <input ref={textInput} value={availableFrom} onChange={event => changeAvFrom(event.target.value, props.identifier, event.target.value)} type="date" className="available-from" name="available-from"
                    min="2021-02-01" max="2030-12-31"></input>
                    
                <p>Available to:</p>
                <input value={availableTo} onChange={event => changeAvTo(event.target.value, props.identifier, event.target.value)} type="date" className="available-to" name="available-to"
                    min="2021-02-01" max="2040-12-31"></input>
            </div>
        );
    };

    //Add another availability element   
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
        //Add applicant info here?
        /*let fakePerson = {
            role: "Applicant",
            firstName: "firstName",
            lastName: "lastName",
            username: "username",
            password: "password",
            email: "email",
            ssn: 11234674576
        };
        */
        let application =  {availabilities: applicationData.availabilityArray, competencies: applicationData.competenceArray, 
            applicant: {
                role: "Applicant",
                firstName: "firstName",
                lastName: "lastName",
                username: "username",
                password: "password",
                email: "email",
                ssn: 11234674576
            }
        };
        //Insomnia
        console.log("Sending application: " + JSON.stringify(application))
        // /application?
        fetch('/post', {
            method: 'POST', 
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(application)
        }).then(response => {
            console.log(response)  
    
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
        })
    }

    //onClick function for sending application
    /**
     * @description Gathers data from user input and uses it to send application to server with the sendApplication function.
     * 
     */
    function onSendApplicationClick() {
        //gather data
        let applicationData = {availabilityArray, competenceArray};
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
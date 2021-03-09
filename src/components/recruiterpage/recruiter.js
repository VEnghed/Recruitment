import './recruiter.css';
import { useState } from 'react';

/**
 * the function component that renders the recruitment page,
 * lets users list applications based on given parameters.
 * @returns a react component rendering the recruitment page
 */
function Recruiter() {
    const [name, setName] = useState('')
    const [timeperiodfrom, setTimeperiodfrom] = useState('')
    const [timeperiodto, setTimeperiodto] = useState('')
    const [competence, setCompetence] = useState('')
    const [applications, setApplications] = useState()
    const [errorMsg, setErrormsg] = useState('')

    /**
     * sends a search query to server with
     * given parameters
     */
    function searchApplicants() {
        if(!name || !timeperiodfrom || !timeperiodto || !competence) {      //check if all required fields are filled
            setErrormsg("Please fill in all required fields")
            return;
        }
        
        let data = ({                                       // the query 
            name: name,
            timeperiodfrom: timeperiodfrom,
            timeperiodto: timeperiodto,
            competence: competence                    
        })
        let token = window.localStorage.getItem("token")   // token
        console.log(data)

        fetch('/recruiter/search', {
            method: 'POST', 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        }).then(response => {
            if(response.status === 200)                     // query is valid 
                response.json().then(result => showApplications(result))
            else if (response.status === 302) 
                window.location = "/" 
            else if(response.status === 400)                // bad request
                setErrormsg(response.statusText)
            else if(response.status === 401)                // invalid authentication
                window.location = "/" 
            else if(response.status === 500)                // internal server error
                setErrormsg(response.statusText)
        }) 
    }

    /**
     * creating elements & putting values
     */
    function showApplications(response) {

        
        if(response.length > 0) {    // if there is applicants
            setErrormsg("")
            let applications = response.map(application => (
                <li className="application" id={application.username} key={application.username} onClick={event => goToDetails(event)}>
                    {application.firstname + " " + application.lastname} 
                </li>
            ))
            setApplications(applications);
        } else {                     // else there is none
            setErrormsg(response.statusMessage)
        }
    }

    /**
     * Go to applicant details with certain applicant
     */
    function goToDetails(evt) {
        let detailsUrl = evt.target.id;
        window.location = "/details:" + detailsUrl;
    }

    /**
     * loads more applicants to view
     */
    function loadMoreApplicants() {
        console.log("more applicants")
    }
        
    return (
        <div className="recruiter-container">
          <h2 className="register-text" >Recruitment</h2> 
          <h4 className="errorText" >{errorMsg}</h4>
          <div className="search-bar">
            <input id="name" type="text" placeholder="Name" value={name} onChange={event => setName(event.target.value)}></input>
            <input id="time-period-from" type="text" placeholder="From" value={timeperiodfrom} onChange={event => setTimeperiodfrom(event.target.value)}></input>
            <input id="time-period-to" type="text" placeholder="To" value={timeperiodto} onChange={event => setTimeperiodto(event.target.value)}></input>
            <input id="competence" type="text" placeholder="Competence" value={competence} onChange={event => setCompetence(event.target.value)}></input>
            <button className="search-btn" onClick={() => searchApplicants()}>Search</button>
          </div>
        <hr></hr>
        <div className="search-results" >
            <ul className="search-data">{applications}</ul>
        </div>
        <button className="load-applicants-btn" onClick={() => loadMoreApplicants()}>Load more applicants</button>
        </div>
    );
}

export default Recruiter;
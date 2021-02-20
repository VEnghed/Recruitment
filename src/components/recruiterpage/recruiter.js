import './recruiter.css';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'

/**
 * the function component that renders the recruitment page,
 * lets users list applications based on given parameters.
 * @returns a react component rendering the recruitment page
 */
function Recruiter() {
    const [name, setName] = useState('')
    const [timeperiodfrom, setTimeperiodfrom] = useState('')
    const [timeperiodto, setTimeperiodto] = useState('')
    const [applicationdate, setApplicationdate] = useState('')
    const [competence, setCompetence] = useState('')
    const [applications, setApplications] = useState()
    const [errorMsg, setErrormsg] = useState('')

    //function for saving user auth token?

    /**
     * sends a search query to server with
     * given parameters
     */
    function searchApplicants() {
        if(!name || !timeperiodfrom || !timeperiodto || !applicationdate || !competence) {    //check if all required fields are filled
            setErrormsg("Please fill in all required fields")
            return;
        }
        
        let searchQuery = ({
            name: name,
            timeperiodfrom: timeperiodfrom,
            timeperiodto: timeperiodto,
            applicationdate: applicationdate,
            competence: competence
        })

        fetch('/recruiter/search', {
            method: 'POST', 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchQuery)
        }).then(response => {
            console.log(response)
            if(response.status === 500)         // internal error
                setErrormsg(response.statusText)
            if(response.status === 400)         // bad request
                setErrormsg(response.statusText)
            else if(response.status === 200) {  // query is valid 
                showApplications(response)      // save result
            }
        }) 
    }

    //function for creating elements & putting values
    function showApplications(response) {
       let applications = response.map(application => (
            <li key={application.name}>
                {application.name}
            </li>
        ))
        setApplications(applications);
    }
        
    return (
        <div className="recruiter-container">
          <h2 className="register-text" >Recruitment</h2> 
          <h4 className="errorText" >{errorMsg}</h4>
          <div className="search-bar">
            <input id="name" type="text" placeholder="Name" value={name} onChange={event => setName(event.target.value)}></input>
            <input id="application-date" type="text" placeholder="Application date" value={applicationdate} onChange={event => setApplicationdate(event.target.value)}></input>
            <input id="time-period-from" type="text" placeholder="From" value={timeperiodfrom} onChange={event => setTimeperiodfrom(event.target.value)}></input>
            <input id="time-period-to" type="text" placeholder="To" value={timeperiodto} onChange={event => setTimeperiodto(event.target.value)}></input>
            <input id="competence" type="text" placeholder="Competence" value={competence} onChange={event => setCompetence(event.target.value)}></input>
            <button className="search-btn" onClick={() => searchApplicants()}>Search</button>
          </div>
        <hr></hr>
        <div className="search-results" >
            <ul>{applications}</ul>
        </div>
        <button className="load-applicants-btn" onClick={() => {}}>Load more applicants</button>
        </div>
    );
}

export default Recruiter;
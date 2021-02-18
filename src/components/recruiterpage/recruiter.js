import './recruiter.css';
import { useState } from 'react';
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
    const [errorMsg, setErrormsg] = useState('')

    //function for saving user auth token?

    /**
     * sends a search query to server with
     * given parameters
     */
    function searchApplicants() {
        if(!name || !timeperiodfrom || !timeperiodto || !applicationdate || !competence) {    //check if all required fields are filled
            return setErrormsg("Please fill in all required fields")
        }
    }

    //function for creating elements & putting values

    return (
        <div className="recruiter-container">
          <h2 className="register-text" >Recruitment</h2>
          <div className="search-bar">
            <input id="name" type="text" placeholder="Name" value={name} onChange={event => setName(event.target.value)}></input>
            <input id="application-date" type="text" placeholder="Application date" value={applicationdate} onChange={event => setApplicationdate(event.target.value)}></input>
            <input id="time-period-from" type="text" placeholder="From" value={timeperiodfrom} onChange={event => setTimeperiodfrom(event.target.value)}></input>
            <input id="time-period-to" type="text" placeholder="To" value={timeperiodto} onChange={event => setTimeperiodto(event.target.value)}></input>
            <input id="competence" type="text" placeholder="Competence" value={competence} onChange={event => setCompetence(event.target.value)}></input>
            <button className="search-btn" onClick={() => {}}>Search</button>
          </div>
        <hr></hr>
        <div className="search-results">
            <ul>
                <li>Markus Lövgren - 2021-02-07</li>
                <li>Sarah Brown - 2021-01-15</li>
                <li>Amanuel Isak - 2021-02-23</li>
            </ul>
        </div>
        <button className="load-applicants-btn" onClick={() => {}}>Load more applicants</button>
        </div>
    );
}

export default Recruiter;
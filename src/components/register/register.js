import './register.css';
import { useState } from 'react';
import { Redirect } from 'react-router-dom'

/**
 * the function component that renders the register page.
 * Lets the user create an account on the recruiter application
 * @returns a component representing the register page
 */
function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [ssn, setSsn] = useState('')
  const [errorMsg, setErrormsg] = useState('')

  /**
   * registers a valid user, the user 
   * must fill in all required fields
   */
  function registerUser() {
    if(!firstName || !lastName || !username || !password || !email || !ssn) {    //check if all required fields are filled
      setErrormsg("Please fill in all required fields")
      return
    }

    let newUser = ({
      role: 2,
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      ssn: ssn
    })

    fetch('/user/register', {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    }).then(response => {
      console.log(response)
      //check if the user is registered
      if(response.status === 500) {         // internal error
        setErrormsg(response.statusText)
      } 
      if(response.status === 400) {         // bad request
        setErrormsg(response.statusText)
      }
      else if(response.status === 201) {    // user is registered 
        //window.location = "/application" 
        return <Redirect to="/application"></Redirect>
      }
    })
  }

  return (
    <div className="register-container">
      <h2 className="register-text" >Register</h2>
      <h4 className="errorText" >{errorMsg}</h4>
      <div>
        <input id="fname" type="text" placeholder="first name" value={firstName} onChange={event => setFirstName(event.target.value)} ></input>
        <input id="lname" type="text" placeholder="last name"  value={lastName} onChange={event => setLastName(event.target.value)}></input>
      </div>
      <div>
        <input id="username" type="text" placeholder="username"  value={username} onChange={event => setUserName(event.target.value)}></input>
        <input id="password" type="password" placeholder="password"  value={password} onChange={event => setPassword(event.target.value)}></input>
      </div>
      <div>
        <input id="email" type="text" placeholder="mail"  value={email} onChange={event => setEmail(event.target.value)}></input>
        <input id="ssn" type="text" placeholder="ssn"  value={ssn} onChange={event => setSsn(event.target.value)}></input>
      </div>
      <button className="register-btn" onClick={registerUser}>Register</button>
    </div>
  );
}

export default Register;
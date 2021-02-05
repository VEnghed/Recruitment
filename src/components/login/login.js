import { useState } from 'react'
import './login.css';

function Login() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function Tellem() {
    let data = ({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password
    })

    fetch('/user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).then(console.log).catch(console.log)
  }

  return (
    <div className="App">
      <div>First name<input type="text" value={firstName} onChange={event => setFirstName(event.target.value)}></input></div>
      <div>Last name<input type="text" value={lastName} onChange={event => setLastName(event.target.value)}></input></div>
      <div>Username<input type="text" value={username} onChange={event => setUsername(event.target.value)}></input></div>
      <div>Password<input type="text" value={password} onChange={event => setPassword(event.target.value)}></input></div>
      <button onClick={Tellem}>Submit</button>
    </div>
  );
}

export default Login
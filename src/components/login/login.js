import { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function Tellem() {
    let data = {
      username: username,
      password: password,
    };

    fetch("/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        window.localStorage.setItem("token", data.accessToken);
        if (data.role == 2) {
          window.location = "/application";
        } else {
          window.location = "/recruiter/search";
        }
      })
      .catch(console.log);
  }

  return (
    <div className="App">
      <div>
        Username
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        ></input>
      </div>
      <div>
        Password
        <input
          type="text"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        ></input>
      </div>
      <button onClick={Tellem}>Submit</button>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Login;

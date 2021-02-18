import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Application from './components/applicationpageview/applicationpage.js';
import Header from './components/header/header.js';
import Login from './components/login/login.js';
import Register from './components/register/register.js';
import Recruiter from './components/recruiterpage/recruiter.js';
import Success from './components/success.js';

/**
 * renders the application as a header component
 * and the component of the page currently viewed
 */
function App() {
  return (
    <div className="app-container">
      <Header />
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/success" component={Success} />
          <Route path="/application" component={Application} />
          <Route path="/recruiter" component={Recruiter} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

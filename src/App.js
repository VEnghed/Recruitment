import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Application from './components/applicationpageview/applicationpage';
import Header from './components/header/header';
import Login from './components/login/login';
import Register from './components/register/register';
import Success from './components/success';

/**
 * renders the application as a header component
 * and the component of the page currently viewed
 */
function App() {
  return (
    <div className="app-container">
      <Header/>    
      <Router>
        <Route exact path="/" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/success" component={Success}/>
        <Route path="/application" component={Application}/>
      </Router>
    </div>
  );
}

export default App;

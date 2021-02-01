import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/header/header';
import Register from './components/register/register';
import Success from './components/success';

/**
 * renders the application, in terms of a header
 * and the component of the page currently being viewed
 */

 //add more paths later
function App() {
  return (
    <div className="app-container">
      <Header/>    
      <Router>
        <Route exact path="/register" component={Register}/>
        <Route path="/success" component={Success}/>
      </Router>
    </div>
  );
}

export default App;

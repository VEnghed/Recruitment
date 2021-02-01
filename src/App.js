import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Application from './applicationpageview/applicationpage';

/**
 * renders the application, in terms of a header
 * and the component of the page currently being viewed
 */

 //add more paths later
function App() {
  return (
    <div className="app-container">
          
      <Router>
        <Route path="/application" component={Application}/>
      </Router>
    </div>
  );
}


export default App;


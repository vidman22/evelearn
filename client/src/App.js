import React from 'react';
import { Route } from "react-router-dom";
import LandingPage from'./containers/LandingPage';

function App() {
  return (
    <div>
      <Route path="/" component={LandingPage}/>
    </div>
  );
}

export default App;

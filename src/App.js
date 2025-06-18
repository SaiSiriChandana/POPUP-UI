import React from 'react';
import ActivitySelection from './ActivitySelection';
import FeedbackPopup from './FeedbackPopup';
import './App.css'; // Make sure to import your CSS here

function App() {
  return (
    <div className="App">
      <h1 className="App-title">.</h1>

      {/* Mood + Activity + Weather UI */}
      <ActivitySelection />

      {/* Feedback Section */}
      <FeedbackPopup />
    </div>
  );
}

export default App;

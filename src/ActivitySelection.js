import React, { useState, useEffect } from 'react';
import './ActivitySelection.css';
import firetvLogo from './firetv-logo.jpg';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  // 🔐 Your Firebase config here
  apiKey: "AIzaSyB3xHSECSWVn-eBBHzFX8SQCQNomYFOAeU",
  authDomain: "mood-based-recommendatio-2c7a9.firebaseapp.com",
  projectId: "mood-based-recommendatio-2c7a9",
  storageBucket: "mood-based-recommendatio-2c7a9.firebasestorage.app",
  messagingSenderId: "319741143296",
  appId: "1:319741143296:web:962498ff41379d436e2be5",
  measurementId: "G-GHXHXTBFMF"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function ActivitySelection() {
  const [mood, setMood] = useState(null);
  const [activity, setActivity] = useState(null);
  const [weather, setWeather] = useState('Unavailable');
  const [timeOfDay, setTimeOfDay] = useState('');

  const apiKey = '216b1652bb87ad430bf31efc2d5c75b8';

  useEffect(() => {
    // Detect weather
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          const data = await response.json();
          if (data && data.weather && data.weather[0]) {
            setWeather(data.weather[0].main);
          }
        } catch (err) {
          console.error('Weather fetch error:', err);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setWeather('Unavailable');
      }
    );

    // Set time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else if (hour < 20) setTimeOfDay('Evening');
    else setTimeOfDay('Night');
  }, []);

  const handleActivityClick = async (selectedActivity) => {
    const selectedMood = mood || 'Moderate';

    const userData = {
      user_id: 'user_12345',
      timestamp: new Date().toISOString(),
      mood_response: {
        question: 'Hey, how was your day?',
        answer: selectedMood,
      },
      activity_response: {
        question: 'What are you up to?',
        answer: selectedActivity,
      },
      context: {
        mood: selectedMood,
        intent: 'Entertainment',
        weather: weather,
        time_of_day: timeOfDay,
      },
    };

    try {
      await setDoc(doc(db, 'userSessions', `${userData.user_id}_${Date.now()}`), userData);
      alert('✅ User session stored successfully!');
    } catch (err) {
      console.error('Error storing session:', err);
    }

    setActivity(selectedActivity);
  };

  const handleMoodSelection = (selectedMood) => {
    setMood(selectedMood);
    alert(`Mood set to ${selectedMood}`);
  };

  return (
    <div className="app">
      <div className="card">
        <img src={firetvLogo} alt="Fire TV Logo" className="logo" />
        <h1 className="title">Hey, how was your day?</h1>
        <div className="activity-buttons">
          <button className="activity-button" onClick={() => handleMoodSelection('Good')}>Good</button>
          <button className="activity-button" onClick={() => handleMoodSelection('Moderate')}>Moderate</button>
          <button className="activity-button" onClick={() => handleMoodSelection('Bad')}>Bad</button>
        </div>

        <h2 className="title">What are you up to?</h2>
        <div className="activity-buttons">
          <button className="activity-button" onClick={() => handleActivityClick('Looking to watch something')}>Looking to watch something</button>
          <button className="activity-button" onClick={() => handleActivityClick('Preparing for bed')}>Preparing for bed</button>
          <button className="activity-button" onClick={() => handleActivityClick('Getting things done')}>Getting things done</button>
        </div>

        <p style={{ marginTop: '20px' }}>📍 Detected Weather: <strong>{weather}</strong></p>
        <p>🕒 Time of Day: <strong>{timeOfDay}</strong></p>

        <div className="action">
          <span className="icon mic">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 1.75C10.07 1.75 8.5 3.32 8.5 5.25V10.75C8.5 12.68 10.07 14.25 12 14.25C13.93 14.25 15.5 12.68 15.5 10.75V5.25C15.5 3.32 13.93 1.75 12 1.75ZM19.25 10.75C19.25 14.24 16.48 16.25 13.25 16.7V20.25H10.75V16.7C7.52 16.25 4.75 14.24 4.75 10.75H6.25C6.25 13.06 8.19 14.75 10.5 14.75C10.5 14.75 10.5 14.75 10.5 14.75C12.81 14.75 14.75 13.06 14.75 10.75H19.25Z" />
            </svg>
          </span>
          <button className="talk-button">Talk to AI</button>
        </div>
      </div>
    </div>
  );
}

export default ActivitySelection;

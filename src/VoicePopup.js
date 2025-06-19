import React, { useEffect, useState } from 'react';
import './VoicePopup.css';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// ✅ Use same Firebase config from ActivitySelection.js
const firebaseConfig = {
  // Your config here

 
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function VoicePopup({ onClose, weather, timeOfDay }) {
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Listening...');

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = async (event) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      setStatus('Heard: ' + speechText);

      // ✅ Save to Firebase
      const docData = {
        user_id: 'user_12345',
        timestamp: new Date().toISOString(),
        voice_input: speechText,
        weather,
        time_of_day: timeOfDay,
      };

      try {
        await setDoc(doc(db, 'voiceSessions', `${docData.user_id}_${Date.now()}`), docData);
        alert('✅ Voice session saved!');
      } catch (err) {
        console.error('Error saving voice input:', err);
      }

      recognition.stop();
    };

    recognition.onerror = (err) => {
      console.error('Speech Recognition Error:', err);
      setStatus('Error: ' + err.message);
    };

    return () => recognition.stop(); // Clean up
  }, []);

 return (
  <div className="voice-popup-overlay">
    <div className="voice-popup">
      <h2>{transcript ? "What are you up to?" : "Hey, how was your day?"}</h2>
      
      <div className="mic-status">🎤 {status}</div>

      {transcript && (
        <div className="transcript-box">
          <p><strong>Heard:</strong> {transcript}</p>
          <p><strong>Transcript:</strong> {transcript}</p>
        </div>
      )}

      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  </div>
);

}

export default VoicePopup;

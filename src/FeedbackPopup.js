import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  increment,
  getDoc
} from 'firebase/firestore';
import './FeedbackPopup.css';

// Use a hosted image instead of local PNG for testing
const userImage = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

const firebaseConfig = {
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function FeedbackPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const movieTitle = 'The Secret Life of Walter Mitty';
  const userId = 'user_12345';

  const handleFeedback = async (type) => {
    const points = type === 'thumbs_up' ? 10 : -5;
    const feedbackData = {
      user_id: userId,
      movie_title: movieTitle,
      feedback: type,
      timestamp: new Date().toISOString(),
      reward_points: points
    };

    try {
      await setDoc(doc(db, 'feedback', `${userId}_${Date.now()}`), feedbackData);

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          total_rewards: increment(points)
        });
      } else {
        await setDoc(userRef, {
          total_rewards: points
        });
      }

      alert('✅ Feedback submitted!');
      setFeedbackGiven(true);
    } catch (error) {
      console.error('Error storing feedback:', error);
    }

    setShowPopup(false);
  };

  return (
    <div>
      <img
        src={userImage}
        alt="User"
        className="user-icon"
        onClick={() => {
          console.log("User icon clicked");
          setShowPopup(true);
        }}
      />

      {showPopup && !feedbackGiven && (
        <div className="popup">
          <h2>Did you enjoy watching "{movieTitle}"?</h2>
          <div className="buttons">
  <button className="circle-button" onClick={() => handleFeedback('thumbs_up')}>
    👍
  </button>
  <button className="circle-button" onClick={() => handleFeedback('thumbs_down')}>
    👎
  </button>
</div>

        </div>
      )}
    </div>
  );
}



export default FeedbackPopup;


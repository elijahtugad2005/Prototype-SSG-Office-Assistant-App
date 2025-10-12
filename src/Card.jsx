import { useState } from 'react';
import imagelogo from './assets/logo.svg'
import { useNavigate } from 'react-router-dom';

function Card({
  title = 'Null',
  accessLevel = 'CLASSIFIED',
  description = 'No description provided',
  date = 'Unknown',
  to = '',
})
 
    
{


       const navigate = useNavigate();

       const playClickSound = () => {
        const audio = new Audio ('/audio/click.mp3');
        audio.play().catch((errpr) => {
            console.error('Click sound playback failed:', error);
        });
       };

    const handleCardClick = () => {
        playClickSound();
        if (to){
            navigate(to);
        }
    }
 
  return (
    <div className="cardContainer" onClick={handleCardClick} style={{ cursor: to ? 'pointer' : 'default' }}>
      <div className="upperContainer">
        <h1>{title}</h1>
        <h2 className="priorityContainer">{accessLevel}</h2>
      </div>
      <div className="previewContainer"></div>
      <div className="bottomContainer">
        <h2>Description: {description}</h2>
        <h2>Date: {date}</h2>
      </div>
    </div>
  );
}




export default Card
import Card from "../Card";
import styles from "./Document.module.css"
import { CardContext } from '../CardContext/CardContext.jsx';
import React, { useContext, useEffect} from 'react';
const Document = () => {

// Play background music when component mounts
  useEffect(() => {
    const audio = new Audio('/background-music.mp3');
    audio.loop = true; // Loop the music
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }, []);

    const { cards } = useContext(CardContext);
  
  

  return (
    <div className={styles.cardgrid}>
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          accessLevel={card.accessLevel}
          description={card.description}
          date={card.date}
          to ={card.to}
          image = {card.image}
        />
      ))}
    </div>
  );
};
export default Document
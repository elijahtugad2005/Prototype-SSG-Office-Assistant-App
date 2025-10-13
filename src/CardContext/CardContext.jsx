import React, {createContext , useState} from 'react';

export const CardContext = createContext();

export const CardProvider = ({ children }) =>{
    const [cards ,setCards] = useState([
        { 
            id: 1,
            title: "Financial Records",
            accessLevel: "CLASSIFIED",
            description: "Monthly financial summary.",
            date: "2025-10-01",
            to: "/finance",
            image: "",
        }
    ]);



    
    const addCard = (newCard) => {
        setCards((prev) => [...prev, newCard]);
    }

     return (
    <CardContext.Provider value={{ cards, addCard }}>
      {children}
    </CardContext.Provider>
  );
}

    
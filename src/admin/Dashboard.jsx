import React, {useContext , useState } from 'react'
import { CardContext } from '../CardContext/CardContext';
import styles from './Dashboard.module.css';


function Dashboard (){
    const { addCard } = useContext(CardContext);

    const [newCard , setNewCard] = useState({
        title: "",
        accessLevel: "",
        description: "",
        date: "",
        to: "",  
    })

    const handleChange = (e) => {
        const { name , value } = e.target;
        setNewCard({...newCard, [name]: value});
    };

      
    const [success, setSuccess] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        addCard(newCard);
        setNewCard ({  title: "", accessLevel: "", description: "", date: "", to: "" });
        
        setTimeout(() => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }, 50);

    };

  


    return (

    <div>
        <div className={styles.dashboardContainer}>
        <h1>Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <input name="title" value={newCard.title} onChange={handleChange} placeholder="Title" required />
            <input name="accessLevel" value={newCard.accessLevel} onChange={handleChange} placeholder="Access Level" required />
            <input name="description" value={newCard.description} onChange={handleChange} placeholder="Description" required />
            <input name="date" type="date" value={newCard.date} onChange={handleChange} required />
            <input name="to" value={newCard.to} onChange={handleChange} placeholder="Link path" required />
            <button type="submit">Add Card</button>
        </form>


        {success && <p style={{ color: 'lime', fontWeight: 'bold', fontSize: '20px' }}>Card added successfully!</p>}

        </div>
    </div>

       
    );
}

export default Dashboard;
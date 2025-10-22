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
        image: "",
        to: "",  
    })

    const handleChange = (e) => {
        const { name , value } = e.target;
        setNewCard({...newCard, [name]: value});
    };

    const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewCard({ ...newCard, image: imageURL });
    }
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
          <div className = {styles.title}> <h1>ADMIN - ADD CARD</h1> </div>
        <form onSubmit={handleSubmit} className={styles.form}>
            <input name="title" value={newCard.title} onChange={handleChange} placeholder="Title" required />
            <select name="accessLevel" value={newCard.accessLevel} onChange={handleChange} required >
              <option value =""> Select - Access</option>
              <option value = "Public">Public</option>
              <option value = "Confidential">Confidential</option>
              <option value = "In Progress">In Progress</option>
              <option value = "Internal Use">Internal Use Only </option>
             </select>
            <input name="description" value={newCard.description} onChange={handleChange} placeholder="Description" required />
            <input name="date" type="date" value={newCard.date} onChange={handleChange} required />
            <input name="to" value={newCard.to} onChange={handleChange} placeholder="Link path" required />
            
            <input type = "file" accept='image/*' onChange={handleImageUpload}/>
            <button type="submit">Add Card</button>
        </form>


        {success && <p style={{ color: 'lime', fontWeight: 'bold', fontSize: '20px' }}>Card added successfully!</p>}

        </div>
    </div>

       
    );
}

export default Dashboard;
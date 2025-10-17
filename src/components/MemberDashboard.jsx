import styles from './memberdashboard.module.css'
import React , { useState } from 'react'
import Memberslist from './Memberlist';


 function MemberDashboard(){

    const [member, setMember ] = useState({
        name: "",
        id: "",
        address: "",
        position: "",
        photo: "",

    });

    const [preview, setPreview] = useState(null);
    const [members , setMembers] = useState([]);
    const [editIndex, setEditIndex] = useState ([null]);

    //handles input
    const handleChange = (e) => {
        const {name, value } = e.target;
        setMember({...member, [name]: value});

    };

    //handel photo

    const handlePhotoChange = (e) =>{
        const file = e.target.files[0]
        if(file){
            setMember({...member, photo: file});
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
          
          e.preventDefault();
            setMembers((prev) => [...prev, member]);
            console.log("Member added :", member);
            alert(` ${member.name} addedd successfully!`);

        //reset

        setMember({  name: "", id: "", address: "", position: "", photo: null })
        setPreview(null);
    };
    


    
    return (  
    <>
    <div className={styles.container}>
      <h1 className={styles.title}>Admin — Add Member</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={member.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="id"
          placeholder="ID Number"
          value={member.id}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={member.address}
          onChange={handleChange}
        />

        <select
          name="position"
          value={member.position}
          onChange={handleChange}
          required
        >
          <option value="">Select Position</option>
          <option>President</option>
          <option>Vice President</option>
          <option>Secretary</option>
          <option>Treasurer</option>
          <option>Member</option>
        </select>

        <input type="file" accept="image/*" onChange={handlePhotoChange} />

        {preview && (
          <img src={preview} alt="Preview" className={styles.preview} />
        )}

      <button type ="submit"> Add Member </button>
      </form>
        
         <div className={styles.memberListWrapper}>
            <Memberslist members={members} setMembers={setMembers} />
          </div>
    </div>
        
  </>
  );
}
export default MemberDashboard
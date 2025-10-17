import React,  { useState } from 'react';
import styles from './memberlist.module.css'



export default function Memberlist({members = [] , setMembers}){

  const [editingId , setEditingId] = useState(null);
  const [editedMember, setEditedMember] = useState({});

    const handleEditClick = (member) => {
      setEditingId(member.id);
      setEditedMember({...member})
    }

    const handleEditChange = (e) => {
      const { name , value } = e.target;
       setEditedMember({...editedMember, [name] : value});

    }


    const handleSave = (id) => {
      const updatedMembers = members.map((m) => 
      m.id === id ? editedMember : m);

      setMembers(updatedMembers);
      setEditingId(null);
    }

    //cancel edit
    const handleCancel = ( ) => {
      setEditingId(null);
    }

    const handleDelete = (id) => {
      if (window.confirm ("Are you sure you want to delete this member?")) {
        setMembers(members.filter((m) => m.id !== id ));
      }
    }

    return (
    
      <div className={styles.memberList}>
      <h2>👥 Member List</h2>
      <div className={styles.memberListContainer}>
        {members.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              {editingId === member.id ? (
                // Inline Edit Form
                <div className={styles.editForm}>
                  <input
                    type="text"
                    name="name"
                    value={editedMember.name}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="address"
                    value={editedMember.address}
                    onChange={handleEditChange}
                  />
                  <select
                    name="position"
                    value={editedMember.position}
                    onChange={handleEditChange}
                  >
                    <option>President</option>
                    <option>Vice President</option>
                    <option>Secretary</option>
                    <option>Treasurer</option>
                    <option>Member</option>
                  </select>
                  <div className={styles.inlineButtons}>
                    <button onClick={() => handleSave(member.id)}>💾 Save</button>
                    <button onClick={handleCancel}>❌ Cancel</button>
                  </div>
                </div>
              ) : (
                // Normal Card Display
                <>
                  {member.photo && (
                    <img
                      src={URL.createObjectURL(member.photo)}
                      alt={member.name}
                      className={styles.memberPhoto}
                    />
                  )}
                  <h3>{member.name}</h3>
                  <p><strong>{member.position}</strong></p>
                  <p>ID: {member.id}</p>
                  <p>{member.address}</p>
                 
                  <div className={styles.cardButtons}>
                    <button onClick={() => handleEditClick(member)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(member.id)}>🗑️ Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
 );

    
}


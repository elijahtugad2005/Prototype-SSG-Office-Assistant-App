import React,  { useState } from 'react';
import styles from './memberlist.module.css'



export default function Memberlist({members = [] , onEdit, onDelete}){
if(members.length === 0 ){
    return<p className={styles.empty}>No Member added yet.</p>;
}       
    return (<div className={styles.listContainer}>
      {members.map((member, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.imageWrapper}>
            {member.photo ? (
              <img
                src={URL.createObjectURL(member.photo)}
                alt={`${member.name}'s photo`}
                className={styles.photo}
              />
            ) : (
              <div className={styles.noPhoto}>No Photo</div>
            )}
          </div>

          <div className={styles.info}>
            <h3>{member.name}</h3>
            <p><strong>ID:</strong> {member.id}</p>
            <p><strong>Position:</strong> {member.position}</p>
            <p><strong>Address:</strong> {member.address}</p>

             <div className={styles.cardButtons}>
                <button onClick={() => onEdit(index)} className={styles.editBtn}>✏️ Edit</button>
                <button onClick={() => onDelete(index)} className={styles.deleteBtn}>🗑️ Delete</button>
              </div>


          </div>
        </div>
      ))}
    </div>
  );

    
}


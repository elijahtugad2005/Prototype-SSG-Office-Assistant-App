import React, { useState } from "react";
import styles from "./memberlist.module.css";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Memberlist({ members = [], setMembers }) {
  // 🐛 Changed 'editingId' to 'editingDocId' to clearly indicate it holds the Firestore document ID.
  const [editingDocId, setEditingDocId] = useState(null); 
  const [editedMember, setEditedMember] = useState({});

  // 🔧 Begin Edit
  const handleEditClick = (member) => {
    // 🐛 Ensure we're storing the Firestore's unique 'docId' for editing identification.
    setEditingDocId(member.docId); 
    setEditedMember({ ...member });
  };

  // 🔧 Handle edit changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedMember({ ...editedMember, [name]: value });
  };

  // 💾 Save to Firestore and local state
  // 🐛 The parameter 'docIdToUpdate' now correctly refers to the Firestore document ID.
  const handleSave = async (docIdToUpdate) => { 
    try {
      // 🐛 Using 'docIdToUpdate' for the Firestore document reference.
      const memberRef = doc(db, "members", docIdToUpdate); 
      await updateDoc(memberRef, {
        name: editedMember.name || "",
        address: editedMember.address || "",
        position: editedMember.position || "",
      });

      const updatedMembers = members.map((m) =>
        // 🐛 Update the local state by comparing against the Firestore 'docId'.
        m.docId === docIdToUpdate ? { ...m, ...editedMember } : m 
      );
      setMembers(updatedMembers);
      setEditingDocId(null); // Reset editing state after saving
      alert(`✅ ${editedMember.name} updated successfully!`);
    } catch (error) {
      console.error("🔥 Error updating member:", error);
      alert("Error updating member. Please check the console.");
    }
  };

  // ❌ Cancel editing
  const handleCancel = () => {
    setEditingDocId(null); // Reset editing state
  };

  // 🗑️ Delete member from Firestore and local state
  // 🐛 The parameter 'docIdToDelete' correctly refers to the Firestore document ID.
  const handleDelete = async (docIdToDelete) => { 
    // 🐛 Check if 'docIdToDelete' is valid before proceeding.
    if (!docIdToDelete) {
        console.error("Attempted to delete with an invalid docIdToDelete:", docIdToDelete);
        return alert("Invalid member ID for deletion. Please refresh and try again.");
    }
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        // 🐛 Using 'docIdToDelete' for the Firestore document reference.
        await deleteDoc(doc(db, "members", docIdToDelete)); 
        // 🐛 Filter the local state by comparing against the Firestore 'docId'.
        setMembers(members.filter((m) => m.docId !== docIdToDelete)); 
        alert("🗑️ Member deleted successfully!");
      } catch (error) {
        console.error("🔥 Error deleting member:", error);
        alert("Error deleting member. Please check the console.");
      }
    }
  };

  // 🧱 Render
  return (
    <div className={styles.memberList}>
      <h2>👥 Member List</h2>
      <div className={styles.memberListContainer}>
        {members.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          members.map((member) => (
            // 🐛 Crucially, use 'member.docId' as the React key. This fixes the "duplicate key" warning.
            <div key={member.docId} className={styles.memberCard}> 
              {/* 🐛 Compare against 'editingDocId' to determine if this card is being edited. */}
              {editingDocId === member.docId ? ( 
                // Inline Edit Form
                <div className={styles.editForm}>
                  <input
                    type="text"
                    name="name"
                    value={editedMember.name || ""}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="address"
                    value={editedMember.address || ""}
                    onChange={handleEditChange}
                  />
                  <select
                    name="position"
                    value={editedMember.position || ""}
                    onChange={handleEditChange}
                  >
                    <option>President</option>
                    <option>Vice President</option>
                    <option>Secretary</option>
                    <option>Treasurer</option>
                    <option>Member</option>
                  </select>
                  <div className={styles.inlineButtons}>
                    {/* 🐛 Pass 'member.docId' to handleSave. */}
                    <button onClick={() => handleSave(member.docId)}>💾 Save</button> 
                    <button onClick={handleCancel}>❌ Cancel</button>
                  </div>
                </div>
              ) : (
                // Normal Card Display
                <>
                  {member.photoPath && (
                    <img
                      src={
                        member.photoPath
                          ? member.photoPath.startsWith("/studentpics/")
                            ? member.photoPath
                            : `/studentpics/${member.photoPath}`
                          : "/studentpics/default.jpg"
                      }
                      alt={member.name}
                      className={styles.memberPhoto}
                    />
                  )}
                  <h3>{member.name}</h3>
                  <p><strong>{member.position}</strong></p>
                  {/* Display the user-entered 'id' (studentId in your case) */}
                  <p>ID: {member.id}</p> 
                  <p>{member.address}</p>

                  <div className={styles.cardButtons}>
                    {/* 🐛 Pass the entire 'member' object to handleEditClick, which internally extracts 'docId'. */}
                    <button onClick={() => handleEditClick(member)}>✏️ Edit</button> 
                    {/* 🐛 Pass 'member.docId' to handleDelete. */}
                    <button onClick={() => handleDelete(member.docId)}>🗑️ Delete</button> 
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

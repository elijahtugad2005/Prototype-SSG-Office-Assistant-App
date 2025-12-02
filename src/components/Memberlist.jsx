import React, { useState } from "react";
import styles from "./memberlist.module.css";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Memberlist({ members = [], setMembers }) {
  // State to track the Firestore document ID of the member being edited
  const [editingDocId, setEditingDocId] = useState(null); 
  const [editedMember, setEditedMember] = useState({});

  // 🔧 Begin Edit: Stores the docId and a copy of the member's data
  const handleEditClick = (member) => {
    setEditingDocId(member.docId); 
    setEditedMember({ ...member });
  };

  // 🔧 Handle edit changes: Updates the local editedMember state
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedMember({ ...editedMember, [name]: value });
  };

  // 💾 Save to Firestore and local state
  const handleSave = async (docIdToUpdate) => { 
    try {
      const memberRef = doc(db, "members", docIdToUpdate); 
      
      // Data to be updated in Firestore
      const updateData = {
        name: editedMember.name || "",
        id: editedMember.id || "", // Ensure ID is editable
        address: editedMember.address || "",
        position: editedMember.position || "",
        description: editedMember.description || "", // ✅ NEW: Description
        facebookLink: editedMember.facebookLink || "", // ✅ NEW: Social links
        instagramLink: editedMember.instagramLink || "",
        twitterLink: editedMember.twitterLink || "",
        // Note: image64 is typically not updated here, as file inputs require re-upload
        // If image64 was accidentally cleared, it should be kept if not re-uploaded.
      };
      
      await updateDoc(memberRef, updateData);

      // Update the local state using the new data
      const updatedMembers = members.map((m) =>
        m.docId === docIdToUpdate ? { ...m, ...updateData } : m 
      );
      setMembers(updatedMembers);
      setEditingDocId(null); 
      alert(`✅ ${editedMember.name} updated successfully!`);
    } catch (error) {
      console.error("🔥 Error updating member:", error);
      alert("Error updating member. Please check the console.");
    }
  };

  // ❌ Cancel editing
  const handleCancel = () => {
    setEditingDocId(null);
  };

  // 🗑️ Delete member from Firestore and local state
  const handleDelete = async (docIdToDelete) => { 
    if (!docIdToDelete) {
        console.error("Attempted to delete with an invalid docIdToDelete:", docIdToDelete);
        return alert("Invalid member ID for deletion. Please refresh and try again.");
    }
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteDoc(doc(db, "members", docIdToDelete)); 
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
            <div key={member.docId} className={styles.memberCard}> 
              {editingDocId === member.docId ? ( 
                // Inline Edit Form with NEW Fields
                <div className={styles.editForm}>
                    <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editedMember.name || ""}
                    onChange={handleEditChange}
                  />
                    <label>ID:</label>
                    <input
                    type="text"
                    name="id"
                    value={editedMember.id || ""}
                    onChange={handleEditChange}
                  />
                    <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={editedMember.address || ""}
                    onChange={handleEditChange}
                  />
                    <label>Position:</label>
                  <select
                    name="position"
                    value={editedMember.position || ""}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Position</option>
                    <option>President</option>
                    <option>Vice President</option>
                    <option>Secretary</option>
                    <option>Treasurer</option>
                    <option>Member</option>
                  </select>
                    
                    <label>Description:</label>
                    <textarea // ✅ NEW: Description Input
                        name="description"
                        value={editedMember.description || ""}
                        onChange={handleEditChange}
                        rows="3"
                    />

                    <label>Facebook Link:</label>
                    <input // ✅ NEW: Facebook Link Input
                        type="url"
                        name="facebookLink"
                        value={editedMember.facebookLink || ""}
                        onChange={handleEditChange}
                        placeholder="Facebook URL"
                    />
                    <label>Instagram Link:</label>
                    <input // ✅ NEW: Instagram Link Input
                        type="url"
                        name="instagramLink"
                        value={editedMember.instagramLink || ""}
                        onChange={handleEditChange}
                        placeholder="Instagram URL"
                    />
                    <label>Twitter Link:</label>
                    <input // ✅ NEW: Twitter Link Input
                        type="url"
                        name="twitterLink"
                        value={editedMember.twitterLink || ""}
                        onChange={handleEditChange}
                        placeholder="Twitter URL"
                    />

                  <div className={styles.inlineButtons}>
                    <button onClick={() => handleSave(member.docId)}>💾 Save</button> 
                    <button onClick={handleCancel}>❌ Cancel</button>
                  </div>
                </div>
              ) : (
                // Normal Card Display
                <>
                  {member.image64 && ( // ✅ Check for Base64 image
                    <img
                      src={member.image64}
                      alt={member.name}
                      className={styles.memberPhoto}
                    />
                  )}
                  <h3 className={styles.memberName}>{member.name}</h3>

                <div className={styles.memberCardText}>
                  <p><strong>{member.position}</strong></p>
                  <p>ID: {member.id}</p> 
                  <p>{member.address}</p>
                    
                    {/* Display new fields */}
                    {member.description && <p className={styles.description}>{member.description.substring(0, 100)}...</p>}
                    {member.facebookLink && <p className={styles.socialLink}>FB: <a href={member.facebookLink} target="_blank" rel="noopener noreferrer">Link</a></p>}
                    {member.instagramLink && <p className={styles.socialLink}>IG: <a href={member.instagramLink} target="_blank" rel="noopener noreferrer">Link</a></p>}
                    {member.twitterLink && <p className={styles.socialLink}>X/TW: <a href={member.twitterLink} target="_blank" rel="noopener noreferrer">Link</a></p>}
                </div>

                  <div className={styles.cardButtons}>
                    <button onClick={() => handleEditClick(member)}>✏️ Edit</button> 
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
import React, { useState } from "react";
import styles from "./memberlist.module.css";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Memberlist({ members = [], setMembers }) {
  const [editingMember, setEditingMember] = useState(null);
  const [editedMember, setEditedMember] = useState({});
  const [showModal, setShowModal] = useState(false);

  // 🔧 Open Modal for Editing
  const handleEditClick = (member) => {
    setEditingMember(member.docId);
    setEditedMember({ ...member });
    setShowModal(true);
  };

  // 🔧 Handle edit changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedMember({ ...editedMember, [name]: value });
  };

  // 💾 Save to Firestore and local state
  const handleSave = async () => {
    if (!editingMember) return;
    
    try {
      const memberRef = doc(db, "members", editingMember);
      
      // Data to be updated in Firestore
      const updateData = {
        name: editedMember.name || "",
        id: editedMember.id || "",
        address: editedMember.address || "",
        position: editedMember.position || "",
        description: editedMember.description || "",
        facebookLink: editedMember.facebookLink || "",
        instagramLink: editedMember.instagramLink || "",
        twitterLink: editedMember.twitterLink || "",
      };
      
      await updateDoc(memberRef, updateData);

      // Update the local state
      const updatedMembers = members.map((m) =>
        m.docId === editingMember ? { ...m, ...updateData } : m
      );
      setMembers(updatedMembers);
      closeModal();
      alert(`✅ ${editedMember.name} updated successfully!`);
    } catch (error) {
      console.error("🔥 Error updating member:", error);
      alert("Error updating member. Please check the console.");
    }
  };

  // ❌ Cancel editing and close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setEditedMember({});
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
      
      {/* Modal for Editing */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Edit Member: {editedMember.name}</h3>
              <button className={styles.closeButton} onClick={closeModal}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              {/* Edit Form */}
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editedMember.name || ""}
                    onChange={handleEditChange}
                    placeholder="Enter member name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ID:</label>
                  <input
                    type="text"
                    name="id"
                    value={editedMember.id || ""}
                    onChange={handleEditChange}
                    placeholder="Enter member ID"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={editedMember.address || ""}
                    onChange={handleEditChange}
                    placeholder="Enter address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Position:</label>
                  <select
                    name="position"
                    value={editedMember.position || ""}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Position</option>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Member">Member</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={editedMember.description || ""}
                    onChange={handleEditChange}
                    rows="4"
                    placeholder="Enter member description"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Facebook Link:</label>
                  <input
                    type="url"
                    name="facebookLink"
                    value={editedMember.facebookLink || ""}
                    onChange={handleEditChange}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Instagram Link:</label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={editedMember.instagramLink || ""}
                    onChange={handleEditChange}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Twitter Link:</label>
                  <input
                    type="url"
                    name="twitterLink"
                    value={editedMember.twitterLink || ""}
                    onChange={handleEditChange}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.saveButton} onClick={handleSave}>
                💾 Save Changes
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Cards Grid */}
      <div className={styles.memberListContainer}>
        {members.length === 0 ? (
          <p className={styles.noMembers}>No members added yet.</p>
        ) : (
          members.map((member) => (
            <div key={member.docId} className={styles.memberCard}>
              {member.image64 && (
                <img
                  src={member.image64}
                  alt={member.name}
                  className={styles.memberPhoto}
                />
              )}
              
              <h3 className={styles.memberName}>{member.name}</h3>

              <div className={styles.memberCardText}>
                <p className={styles.memberPosition}><strong>{member.position}</strong></p>
                <p className={styles.memberID}>ID: {member.id}</p>
                <p className={styles.memberAddress}>{member.address}</p>
                
                {member.description && (
                  <p className={styles.description}>
                    {member.description.substring(0, 100)}...
                  </p>
                )}
                
                <div className={styles.socialLinks}>
                  {member.facebookLink && (
                    <a href={member.facebookLink} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                      <span>f</span>
                    </a>
                  )}
                  {member.instagramLink && (
                    <a href={member.instagramLink} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                      <span>ig</span>
                    </a>
                  )}
                  {member.twitterLink && (
                    <a href={member.twitterLink} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                      <span>𝕏</span>
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.cardButtons}>
                <button onClick={() => handleEditClick(member)}>✏️ Edit</button>
                <button onClick={() => handleDelete(member.docId)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
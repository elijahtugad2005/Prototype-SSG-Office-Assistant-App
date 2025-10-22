import React, { useState } from "react";
import styles from "./memberlist.module.css";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Memberlist({ members = [], setMembers }) {
  const [editingId, setEditingId] = useState(null);
  const [editedMember, setEditedMember] = useState({});

  // 🔧 Begin Edit
  const handleEditClick = (member) => {
    setEditingId(member.id);
    setEditedMember({ ...member });
  };

  // 🔧 Handle edit changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedMember({ ...editedMember, [name]: value });
  };

  // 💾 Save to Firestore and local state
  const handleSave = async (id) => {
    try {
      const memberRef = doc(db, "members", id);
      await updateDoc(memberRef, {
        name: editedMember.name || "",
        address: editedMember.address || "",
        position: editedMember.position || "",
      });

      const updatedMembers = members.map((m) =>
        m.id === id ? { ...m, ...editedMember } : m
      );
      setMembers(updatedMembers);
      setEditingId(null);
      alert(`✅ ${editedMember.name} updated successfully!`);
    } catch (error) {
      console.error("🔥 Error updating member:", error);
      alert("Error updating member. Please check the console.");
    }
  };

  // ❌ Cancel editing
  const handleCancel = () => {
    setEditingId(null);
  };

  // 🗑️ Delete member from Firestore and local state
  const handleDelete = async (id) => {
    if (!id) return alert("Invalid member ID");
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteDoc(doc(db, "members", id));
        setMembers(members.filter((m) => m.id !== id));
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
            <div key={member.id} className={styles.memberCard}>
              {editingId === member.id ? (
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
                    <button onClick={() => handleSave(member.id)}>💾 Save</button>
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
                  <p>ID: {member.studentId}</p>
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

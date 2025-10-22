import styles from './memberdashboard.module.css';
import React, { useState, useEffect } from 'react';
import Memberslist from './Memberlist';
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

function MemberDashboard() {
  const [member, setMember] = useState({
    name: "",
    id: "",
    address: "",
    position: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [members, setMembers] = useState([]);

  // ✅ Load Firestore members dynamically
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "members"), (snapshot) => {
      const membersData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setMembers(membersData);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Handle input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle photo upload preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMember((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📦 Final data being saved:", member);

    try {
      await addDoc(collection(db, "members"), {
        name: member.name || "",
        id: member.id || "",
        address: member.address || "",
        position: member.position || "",
        photoPath: member.photo
          ? `/studentpics/${member.photo.name}`
          : "/studentpics/default.png",
        createdAt: new Date(),
      });

      alert(`${member.name} added successfully!`);

      // Reset form
      setMember({ name: "", id: "", address: "", position: "", photo: null });
      setPreview(null);
    } catch (error) {
      console.error("❌ Error adding member:", error);
      alert("Error adding member. Check console for details.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin — Add Member</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={member.name ?? ""}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="id"
          placeholder="ID Number"
          value={member.id ?? ""}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={member.address ?? ""}
          onChange={handleChange}
        />

        <select
          name="position"
          value={member.position ?? ""}
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

        {preview && <img src={preview} alt="Preview" className={styles.preview} />}

        <button type="submit">Add Member</button>
      </form>

      <div className={styles.memberListWrapper}>
        <Memberslist members={members} setMembers={setMembers} />
      </div>
    </div>
  );
}

export default MemberDashboard;

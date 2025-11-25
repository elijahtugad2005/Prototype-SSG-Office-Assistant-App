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
    image64: "", // Base64 string
    description: "",
    facebookLink: "", // Default to empty string instead of default link
    instagramLink: "",
    twitterLink: "",
  });

  // State to control the currently focused link input
  const [selectedPlatform, setSelectedPlatform] = useState('facebookLink');
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

  // ✅ Handle input fields (General)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle photo upload preview (Base64 conversion)
  // Function placed inside MemberDashboard, typically before handlePhotoChange
// ========================================
// 📸 1. Image Compression Utility
// ========================================
/**
 * Compresses an image file using the Canvas API to generate a smaller 
 * Base64 string (JPEG, quality 0.8, max width 1000px) below the 1MB limit.
 * @param {File} file - The original image file selected by the user.
 * @returns {Promise<string>} A promise that resolves with the compressed Base64 Data URL.
 */
const CompressImage = (file) => {
    const maxWidth = 1000;
    const quality = 0.8;
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions, capping width at maxWidth
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Generate new Base64 string as JPEG with compression quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                
                // Optional: Check size again and warn, though the compression should help
                if (compressedBase64.length > 1024 * 1024) {
                    console.warn("Image still large. Consider lower quality or smaller dimensions.");
                }

                resolve(compressedBase64);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// ========================================
// 🖼️ 2. Modified handlePhotoChange
// ========================================
// ✅ Handle photo upload preview, now with compression
const handlePhotoChange = async (e) => { // Must be async now
    const file = e.target.files[0];
    
    if (!file) {
        setMember(prev => ({ ...prev, image64: "" }));
        setPreview(null);
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    try {
        // Use the compression function and AWAIT the result
        const compressedBase64 = await CompressImage(file); 

        // Update the member state with the COMPRESSED Base64 string
        setMember((prev) => ({ 
            ...prev, 
            image64: compressedBase64 
        }));

        // Set the preview using the compressed Base64 string
        setPreview(compressedBase64); 

    } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try another file.");
        setMember(prev => ({ ...prev, image64: "" }));
        setPreview(null);
    }
};
  // ✅ Get current link value based on dropdown selection
  const getCurrentLinkValue = () => {
    return member[selectedPlatform] ?? ""; // Use ?? "" for safe access
  };

  // ✅ Handle dynamic link text input change
  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setMember(prevMember => ({
      ...prevMember,
      [selectedPlatform]: newLink,
    }));
  };

  // ✅ Handles changes to the dynamic link dropdown selector
  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  // ✅ Submit to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for submission, including the links
    const dataToSave = {
      name: member.name || "",
      id: member.id || "",
      address: member.address || "",
      position: member.position || "",
      image64: member.image64 || "",
      description: member.description || "",
      // Include all social links
      facebookLink: member.facebookLink || "",
      instagramLink: member.instagramLink || "",
      twitterLink: member.twitterLink || "",
      createdAt: new Date(),
    };

    console.log("📦 Final data being saved:", dataToSave);

    try {
      await addDoc(collection(db, "members"), dataToSave);

      alert(`${member.name} added successfully!`);

      // Reset form state fully
      setMember({ 
        name: "", 
        id: "", 
        address: "", 
        position: "", 
        image64: "", // Reset to empty string
        description: "",
        facebookLink: "",
        instagramLink: "",
        twitterLink: "",
      });
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
        {/* TEXT INPUTS */}
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

        {/* POSITION DROPDOWN */}
        <select
          name="position"
          value={member.position ?? ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Position</option> {/* Improved */}
          <option value="President">President</option>
          <option value="Vice President">Vice President</option>
          <option value="Secretary">Secretary</option>
          <option value="Governor">Governor</option>
          <option value="BSHM Representative">BSHM Representative</option>
          <option value="BSIT Representative">BSIT Representative</option>
          <option value="BSFI Representative">BSFI Representative</option>
          <option value="BEED MATH Representative">BEED MATH Representative</option>
          <option value="BSED Representative">BSED Representative</option>
          <option value="BIT Representative">BIT Representative</option>
          <option value="BSIE Representative">BSIE Representative</option>
        </select>
        
        {/* DESCRIPTION AREA */}
        <textarea
          name="description"
          placeholder="Describe, Achievements, Biography"
          rows="4" // Added for better UX
          value={member.description ?? ""}
          onChange={handleChange}
        />
        
        {/* DYNAMIC LINK INPUTS SECTION */}
        <div className={styles.dynamicLinkGroup}>
            <label>Social Media Link:</label>
            <select
              value={selectedPlatform}
              onChange={handlePlatformChange}
              className={styles.linkSelect}
            >
              <option value="facebookLink">Facebook</option>
              <option value="instagramLink">Instagram</option>
              <option value="twitterLink">Twitter</option>
            </select>
            <input
              type="url"
              placeholder={`Enter ${selectedPlatform.replace('Link', '')} URL...`}
              value={getCurrentLinkValue()} 
              onChange={handleLinkChange}
              className={styles.linkInput}
            />
        </div>

        {/* IMAGE UPLOAD */}
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
// src/components/TestFirebase.jsx
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function TestFirebase() {
  const testConnection = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "test"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });
      alert("Firestore connection successful!");
    } catch (error) {
      console.error("Error connecting to Firestore:", error);
    }
  };

  return (
    <button onClick={testConnection}>Test Firebase Connection</button>
  );
}

export default TestFirebase;

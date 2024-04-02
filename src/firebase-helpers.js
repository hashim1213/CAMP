import { db } from './firebase-config';
import { collection, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadProfilePic = async (userId, file) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `profilePics/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error; // Re-throw to handle it in the calling function
  }
};


// Adjusted to accept an object with all user details
const updateProfile = async (userId, userDetails) => {
  const userRef = doc(db, "users", userId); // Adjusted to use doc directly with db and userId
  
  await setDoc(userRef, userDetails, { merge: true }); // Use merge to avoid overwriting other fields
};


export { uploadProfilePic, updateProfile };
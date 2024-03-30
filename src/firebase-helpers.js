import { db } from './firebase-config';
import { collection, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadProfilePic = async (userId, file) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profilePics/${userId}/${file.name}`);

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

const updateProfile = async (userId, name, profilePicUrl) => {
  const userRef = doc(collection(db, "users"), userId);
  
  await setDoc(userRef, {
    name: name,
    profilePic: profilePicUrl // URL of the uploaded profile picture
  }, { merge: true }); // Use merge to avoid overwriting other fields
};
export { uploadProfilePic, updateProfile };
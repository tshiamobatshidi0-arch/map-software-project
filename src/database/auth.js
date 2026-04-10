import { auth, db } from "./config.js";
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword,deleteUser} from "firebase/auth";
import {   setDoc, getDoc ,doc, deleteDoc, updateDoc} from "firebase/firestore";
import { loggIn } from "../lib/utils.js"
import { redirect } from "react-router"
import {toast} from "react-hot-toast"

export async function addUser(email, password, username, name, image) {
    
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            username: username,
            name: name,
            email: email,
            createdAt: new Date(),
            savedRoutes: []
        });
        
        return { success: true, userId: user.uid };
   
}


export const loginWithEmailAndPassword = async (userInfo) => {

    const userCredential = await signInWithEmailAndPassword(auth, userInfo.email, userInfo.password);
    const user = userCredential.user;
    console.log(user)
    localStorage.setItem("isLoggedIn",String(true))
    localStorage.setItem("user",JSON.stringify(user))
    return user;

};

export const userData = async () =>{
   // await loggIn("login into your account to view your details")
    const user = auth.currentUser ||JSON.parse(localStorage.getItem("user"))
   // const user =await auth.currentUser;

    if(!user) throw new Error("No user found")
    const userId =(user.uid)
       console.log("open//") 
        console.log(userId)
      const docRef = doc(db, "users", userId);

      const data =  await getDoc(docRef)
            console.log(data)
            if (!data.exists()) throw new Error("User not found2")
            const userData = data.data();
            console.log(userData)
            console.log("close//") 
            return userData;
        

}



export const deleteUserAccount = async () => {
  const user = auth.currentUser || JSON.parse(localStorage.getItem("user"))

  if (!user) 
    throw new Error("No user currently logged in.");
  

  try {
    // 1. Delete user data from Firestore first
    const userDocRef = doc(db, "users", user.uid);
    await deleteDoc(userDocRef);
   

    // 2. Delete the user from Firebase Authentication
     await deleteUser(user);
   
     localStorage.clear()
     toast.success("account deleted.");

    return { success: true };
  } catch (error) {
    // Re-authentication is often required for sensitive actions
    if (error?.code === "auth/requires-recent-login") {
      toast.error("Please log out and log back in to verify your identity before deleting your account.");
    }
    
    console.error("Error deleting user:", error?.message);
    throw error;
  }
};





/**
 * Updates specific fields for the currently logged-in user
 * @param {Object} updatedFields - e.g., { name: "New Name", username: "new_user123" }
 */
export const updateUserInfo = async (updatedFields) => {
  // 1. Get the current user from Auth
  const user = auth.currentUser || JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.error("You must be logged in to update your profile.");
    throw new Error("No authenticated user.");
  }

  try {
    // 2. Reference the specific user document
    const userDocRef = doc(db, "users", user.uid);

    // 3. Update only the provided fields
    await updateDoc(userDocRef, {
      ...updatedFields,
      updatedAt: new Date() // Good practice to track the last edit
    });

    toast.success("Profile updated successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error updating user info:", error.message);
    toast.error("Failed to update profile.");
    throw error;
  }
};




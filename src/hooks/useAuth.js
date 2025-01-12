import { initializeApp } from "firebase/app";
//import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
 GoogleAuthProvider, getAuth, signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,
 sendPasswordResetEmail, signOut,} from "firebase/auth"

import {
getFirestore,query,getDocs,collection,where,addDoc,} from "firebase/firestore";

import React, { useState, useEffect, useContext, createContext } from "react";
import { config as firebaseConfig } from "../config/firebaseConfig.js";

// Code edited from https://usehooks.com/useAuth/ and
// https://firebase.google.com/docs/auth/web/start#add-initialize-sdk
// Not my original work.

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const firebaseAuth = getAuth(app);

const db = getFirestore(app);

const googleAuthProvider = new GoogleAuthProvider();

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (email, password) => {
    return firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email, password) => {
    return firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebaseAuth.signOut().then(() => {
      setUser(false);
    });
  };

  const sendPasswordResetEmail = (email) => {
    return firebaseAuth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  };

  const confirmPasswordReset = (code, password) => {
    return firebaseAuth.confirmPasswordReset(code, password).then(() => {
      return true;
    });
  };

  const signInWithGoogle = () => {
    return signInWithPopup(firebaseAuth, googleAuthProvider);
  };

 /* const signInWithGoogle = async () => {
    try {
      const res = await signInWithGoogle(firebaseAuth, googleAuthProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } 
  }; */

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(firebaseAuth);
  }

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout


  };
}

'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
    getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendEmailVerification,
    reload
} from 'firebase/auth';
import { app } from '../firebase'; // Use the initialized app

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Custom Error for Email Verification
export class EmailNotVerifiedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EmailNotVerifiedError';
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app); // Get auth instance

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth]);

    const signup = async (email, password) => {
        setLoading(true); // Indicate loading during signup
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                // Send verification email
                await sendEmailVerification(userCredential.user);
                console.log('Verification email sent.'); // Log or notify user
                // Don't log out automatically, let the UI handle the unverified state
            }
            return userCredential;
        } catch (error) {
            console.error("Signup error:", error);
            throw error; // Re-throw error to be caught in the modal
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Check if email is verified upon login
            if (userCredential.user && !userCredential.user.emailVerified) {
               console.warn('Login attempt with unverified email:', userCredential.user.email);
               // Don't log out here, throw a specific error instead
               // await logout(); // Don't log out immediately
               throw new EmailNotVerifiedError("Please verify your email before logging in.");
            }
            // Login successful and email verified
            return userCredential;
        } catch (error) {
            console.error("Login error:", error);
            // Re-throw the caught error (could be EmailNotVerifiedError or others)
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Function to resend verification email
    const resendVerificationEmail = async () => {
        if (!auth.currentUser) {
            throw new Error("No user is currently signed in to resend verification email.");
        }
        setLoading(true);
        try {
            await sendEmailVerification(auth.currentUser);
            console.log('Verification email resent.');
            // Optionally return true or add success feedback
        } catch (error) {
            console.error("Error resending verification email:", error);
            throw error; // Let the UI handle the error
        } finally {
            setLoading(false);
        }
    };

    // Function to reload user data (useful after verification)
    const reloadUser = async () => {
        if (!auth.currentUser) return;
        setLoading(true);
        try {
            await reload(auth.currentUser);
            // Update the user state explicitly after reload
            setUser(auth.currentUser); 
        } catch (error) {
             console.error("Error reloading user:", error);
             // Handle specific errors like 'auth/user-token-expired' if needed
        } finally {
             setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        resendVerificationEmail, // Add resend function
        reloadUser             // Add reload function
    };

    // Render children only when not loading initially
    // Or show a loading indicator globally if preferred
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

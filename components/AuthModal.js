'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, EmailNotVerifiedError } from '@/auth/AuthContext'; // Import EmailNotVerifiedError
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
    const [view, setView] = useState(initialView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // General login/signup error
    const [loading, setLoading] = useState(false);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false); // Controls verification view
    const [resendLoading, setResendLoading] = useState(false); // Loading state for resend button
    const [resendStatus, setResendStatus] = useState(null); // null, 'success', 'error' for resend feedback
    const [resendError, setResendError] = useState(''); // Specific error message for resend action

    const { signup, login, resendVerificationEmail } = useAuth();

    // Reset state when modal opens or view changes
    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setEmail('');
            setPassword('');
            setError('');
            setLoading(false);
            setShowVerificationMessage(false); // Reset verification state
            setResendLoading(false);
            setResendStatus(null);
            setResendError('');
        } else {
            // Small delay before clearing state on close to allow animation
            const timer = setTimeout(() => {
                 setShowVerificationMessage(false);
                 setError('');
                 setResendStatus(null);
                 setResendError('');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, initialView]);

    // --- Signup Handler ---
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setShowVerificationMessage(false);
        setResendStatus(null);
        setResendError('');
        try {
            await signup(email, password);
            // On successful signup, show verification message
            console.log('Signup successful, showing verification message.');
            setShowVerificationMessage(true);
            setError(''); // Clear any previous signup/login errors
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.message || 'Failed to create account. Please try again.');
            setShowVerificationMessage(false);
        } finally {
            setLoading(false);
        }
    };

    // --- Login Handler ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setShowVerificationMessage(false);
        setResendStatus(null);
        setResendError('');
        try {
            await login(email, password);
            // If login succeeds (and doesn't throw EmailNotVerifiedError), close modal
            console.log('Login successful!');
            onClose();
        } catch (err) {
            console.error("Login Error:", err);
            if (err instanceof EmailNotVerifiedError) {
                // If email is not verified, show the verification prompt
                setError(''); // Clear general error message
                setShowVerificationMessage(true); // Show verification view
            } else {
                 // Otherwise, show a general login error
                 setError(err.message || 'Failed to log in. Check credentials.');
                 setShowVerificationMessage(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Resend Verification Handler ---
    const handleResendVerification = async () => {
        setResendError('');
        setResendLoading(true);
        setResendStatus(null);
        try {
            // Attempt to resend using the email currently in the state
            // Note: Firebase's resend function uses the *currently signed-in* user,
            // which might be null if the user closed the tab after signup.
            // This button works best right after signup or a failed login attempt
            // where the unverified user context might still be available internally.
            await resendVerificationEmail();
            setResendStatus('success');
        } catch (err) {
            console.error("Resend Verification Error:", err);
            setResendStatus('error');
            setResendError(err.message || "Failed to resend verification email. You might need to try signing up again.");
        } finally {
            setResendLoading(false);
        }
    };

    // --- Switch between Login/Signup Views ---
    const switchView = (newView) => {
        setView(newView);
        setError('');
        // Keep email if switching? Optional: setEmail(''); setPassword('');
        setShowVerificationMessage(false); // Hide verification view when switching
        setResendStatus(null);
        setResendError('');
    };

    if (!isOpen) return null;

    // --- Render Logic ---
    return (
        <div className="modal modal-open"> {/* Ensure modal is controlled by isOpen */}            <motion.div
                className="modal-box bg-white dark:bg-slate-800 relative max-w-md w-full p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                <AnimatePresence mode="wait">
                    {showVerificationMessage ? (
                        // --- Verification Message View ---
                        <motion.div
                            key="verification"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                        >
                             <div className="mb-4 text-primary dark:text-primary-focus flex justify-center">
                                {/* Email Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">Check Your Email</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                We've sent a verification link to
                                <span className="font-medium text-slate-700 dark:text-slate-300 break-all"> {email}</span>.
                                Please click the link in the email to activate your account. Check your spam folder if you don't see it.
                            </p>

                            {/* Resend Button */}
                            <button
                                onClick={handleResendVerification}
                                className={`btn btn-outline btn-primary btn-sm w-full mb-4 ${resendLoading ? 'btn-disabled' : ''}`}
                                disabled={resendLoading}
                            >
                                {resendLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Resend Verification Email'}
                            </button>

                            {/* Resend Feedback */}
                            {resendStatus === 'success' && (
                                 <p className="text-xs text-success dark:text-success-content bg-success/10 dark:bg-success/20 p-2 rounded-md">Verification email resent successfully!</p>
                            )}
                            {resendStatus === 'error' && (
                                 <p className="text-xs text-error dark:text-error-content bg-error/10 dark:bg-error/20 p-2 rounded-md">{resendError || 'Failed to resend email.'}</p>
                            )}

                            {/* Link to close and try logging in */}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-5">
                                Verified your email?
                                <button onClick={onClose} className="link link-hover text-primary dark:text-primary-focus ml-1">Close this and log in.</button>
                            </p>
                            {/* Optional: Button to go back to login/signup */}
                           <button onClick={() => setShowVerificationMessage(false)} className="btn btn-ghost btn-xs mt-2">
                                Back to {view === 'login' ? 'Login' : 'Sign Up'}
                            </button>
                        </motion.div>
                    ) : view === 'login' ? (
                        // --- Login View ---
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">Welcome Back!</h2>
                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Email Input */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text dark:text-slate-300">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    />
                                </div>
                                {/* Password Input */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text dark:text-slate-300">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    />
                                </div>

                                {error && <p className="text-error text-sm text-center">{error}</p>}

                                <button type="submit" className={`btn btn-primary w-full mt-2 ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
                                    {loading ? <span className="loading loading-spinner loading-sm\"></span> : 'Log In'}
                                </button>
                                <p className="text-sm text-center text-slate-500 dark:text-slate-400 pt-2">
                                    Don't have an account?
                                    <button type="button" onClick={() => switchView('signup')} className="link link-hover text-primary dark:text-primary-focus ml-1">
                                        Sign Up
                                    </button>
                                </p>
                            </form>
                        </motion.div>
                    ) : (
                         // --- Signup View ---
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-100">Create Account</h2>
                            <form onSubmit={handleSignup} className="space-y-4">
                                {/* Email Input */}
                                <div className="form-control">
                                     <label className="label">
                                        <span className="label-text dark:text-slate-300">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    />
                                </div>
                                {/* Password Input */}
                                <div className="form-control">
                                     <label className="label">
                                        <span className="label-text dark:text-slate-300">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="******** (min. 6 characters)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6} // Basic validation
                                        className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    />
                                </div>

                                {error && <p className="text-error text-sm text-center">{error}</p>}

                                <button type="submit" className={`btn btn-primary w-full mt-2 ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
                                     {loading ? <span className="loading loading-spinner loading-sm\"></span> : 'Sign Up'}
                                </button>
                                <p className="text-sm text-center text-slate-500 dark:text-slate-400 pt-2">
                                    Already have an account?
                                    <button type="button" onClick={() => switchView('login')} className="link link-hover text-primary dark:text-primary-focus ml-1">
                                        Log In
                                    </button>
                                </p>
                            </form>
                         </motion.div>
                    )}
                 </AnimatePresence>
            </motion.div>
            {/* Click outside to close backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </div>
    );
} 
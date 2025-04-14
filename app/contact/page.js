'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// You might want to use a library like react-hook-form for more robust form handling

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // --- Form Submission Logic --- 
        // Replace this with your actual form submission endpoint (e.g., Formspree, Netlify Forms, backend API)
        console.log("Submitting form data:", formData);
        try {
            // Example: Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            // Assume success for demo
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-slate-800 dark:text-slate-100 mb-4">Get in Touch</h1>
                <p className="text-lg text-center text-slate-600 dark:text-slate-400 mb-12">Have questions or want to collaborate? Reach out!</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Info Section */}
                    <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Contact Information</h2>
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mt-1 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            <div>
                                <h3 className="font-medium text-slate-800 dark:text-slate-100">Email</h3>
                                <a href="mailto:alexandrosbostanidis09@gmail.com" className="text-primary hover:underline dark:text-primary-focus">alexandrosbostanidis09@gmail.com</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mt-1 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                             </svg>
                             <div>
                                 <h3 className="font-medium text-slate-800 dark:text-slate-100">Location</h3>
                                 <p className="text-slate-600 dark:text-slate-400">Limassol, Cyprus</p>
                             </div>
                         </div>

                         {/* Map Placeholder/Divider */}
                         <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0 0v-8.25M15 6.75v8.25m0 0V6.75M3 6.75h18M3 12h18m-7.5 8.25h.008v.008h-.008v-.008Zm0 0H12m3 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Zm0 0H9m12-8.25h.008v.008h-.008V12Zm0 0h-3.008v.008h3.008V12Zm-3 0h.008v.008h-.008V12Zm0 0h-3.008v.008h3.008V12Zm-3 0h.008v.008h-.008V12Zm0 0H9m12 8.25h.008v.008h-.008v-.008Zm0 0h-3.008v.008h3.008v-.008Zm-3 0h.008v.008h-.008v-.008Zm0 0h-3.008v.008h3.008v-.008Zm-3 0h.008v.008h-.008v-.008Zm0 0H9" />
                                </svg>
                                Find Us
                            </h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400">
                                 We are located in sunny Limassol!
                                 {/* Replace with map embed or link later */}
                             </p>
                         </div>
                         {/* Optional: Add Phone or Social Links here */}
                     </motion.div>

                     {/* Contact Form Section */}
                     <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className="form-control">
                                <label htmlFor="name" className="label">
                                    <span className="label-text dark:text-slate-300">Your Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    placeholder="John Doe"
                                />
                            </div>
                             <div className="form-control">
                                <label htmlFor="email" className="label">
                                    <span className="label-text dark:text-slate-300">Your Email</span>
                                </label>
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="subject" className="label">
                                    <span className="label-text dark:text-slate-300">Subject</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    placeholder="Question about LifeGame"
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="message" className="label">
                                    <span className="label-text dark:text-slate-300">Message</span>
                                </label>
                                <textarea 
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="textarea textarea-bordered w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary dark:focus:border-primary-focus dark:focus:ring-primary-focus"
                                    placeholder="Your message here..."
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`btn btn-primary w-full ${isSubmitting ? 'btn-disabled' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span> 
                                ) : (
                                    'Send Message'
                                )}
                            </button>

                            {submitStatus === 'success' && (
                                <div role="alert" className="alert alert-success mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Your message has been sent successfully!</span>
                                </div>
                            )}
                             {submitStatus === 'error' && (
                                <div role="alert" className="alert alert-error mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Error sending message. Please try again later.</span>
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // Import Link

export default function AboutPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-16 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-slate-800 dark:text-slate-100 mb-6">About CodeCultureCy</h1>
                <p className="text-xl text-center text-primary dark:text-primary-focus font-medium mb-12">Crafting Digital Experiences for Cyprus Businesses</p>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="relative h-64 md:h-full">
                            {/* Use Unsplash Source for a random Limassol image */}
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Skyscrapers_in_Limassol.jpg/960px-Skyscrapers_in_Limassol.jpg" // Fetches a random image tagged limassol, cyprus
                                alt="View of Limassol, Cyprus"
                                width="64"
                                height="64"
                                className="absolute inset-0 w-full h-full object-cover object-[70%] bg-slate-300 dark:bg-slate-600" // Added bg color while loading
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                             <div className="absolute bottom-0 left-0 p-6">
                                <h2 className="text-2xl font-semibold text-white">Limassol, Cyprus</h2>
                            </div>
                        </div>

                        {/* Text Content Section */}
                        <div className="p-8 md:p-10 space-y-6">
                            <motion.p 
                                className="text-slate-600 dark:text-slate-300 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                CodeCultureCy is a passionate web development agency based in the heart of Cyprus. We specialize in building beautiful, functional, and high-performing websites tailored specifically for small and medium-sized businesses across the island.
                            </motion.p>
                            <motion.p 
                                className="text-slate-600 dark:text-slate-300 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                Our mission is simple: to empower local businesses with a strong online presence. We believe that a great website is more than just code – it&apos;s a vital tool for growth, connection, and success in today&apos;s digital landscape. We blend cutting-edge technology with creative design to deliver results that matter.
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">What We Offer:</h3>
                                <ul className="list-none space-y-2">
                                    <li className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-slate-600 dark:text-slate-400">Custom Website Design & Development</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-slate-600 dark:text-slate-400">Responsive Design (Mobile-Friendly)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-slate-600 dark:text-slate-400">E-commerce Solutions</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-slate-600 dark:text-slate-400">Website Maintenance & Support</span>
                                    </li>
                                </ul>
                            </motion.div>
                            
                             <motion.div 
                                className="pt-6 border-t border-slate-200 dark:border-slate-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <p className="text-slate-600 dark:text-slate-400 mb-4">Ready to elevate your online presence?</p>
                                <Link href="/contact" className="btn btn-primary">
                                    Let&apos;s Build Together
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

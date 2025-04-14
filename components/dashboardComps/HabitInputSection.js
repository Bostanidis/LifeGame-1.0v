'use client';
import React from 'react';
import { motion } from 'framer-motion';

// Section 3: Habit Input
export default function HabitInputSection({ selectedGoals, habits, onHabitChange, onSubmit }) {
    return (
         <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col items-center gap-10 w-full'
        >
            <div className="card bg-white dark:bg-slate-800 shadow-xl w-full max-w-4xl border border-slate-200 dark:border-slate-700">
                <div className="card-body p-6 md:p-8">
                     <div className="flex items-center justify-between mb-6">
                         <h1 className="card-title text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-accent">
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" clipRule="evenodd" />
                            </svg>
                            Define Daily Habits
                         </h1>
                         <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Step 3 of 3</span>
                     </div>
                    <p className="mb-8 text-slate-600 dark:text-slate-400">Break down your goals into actionable daily habits (3 per goal).</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {selectedGoals.map((goal, goalIndex) => (
                            <div key={goalIndex} className="space-y-6 bg-slate-50 dark:bg-slate-700/40 p-6 rounded-lg border border-slate-200 dark:border-slate-600/50">
                                 <h2 className={`text-xl font-bold mb-2 text-center ${goalIndex === 0 ? 'text-primary' : 'text-secondary'} dark:${goalIndex === 0 ? 'text-primary-focus' : 'text-secondary-focus'}`}>{goal}</h2>
                                <div className="space-y-4">
                                    {[0, 1, 2].map((habitIndex) => (
                                        <div key={`goal${goalIndex}-habit-${habitIndex}`} className="form-control">
                                            <label className="label hidden">
                                                <span className="label-text font-medium text-slate-600 dark:text-slate-300">Habit {habitIndex + 1}</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={`Daily habit ${habitIndex + 1} for goal...`}
                                                className="input input-bordered w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-600 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                                                value={habits?.[goalIndex]?.[habitIndex] || ""}
                                                onChange={(e) => onHabitChange(goalIndex, habitIndex, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-actions justify-center mt-4">
                        <button onClick={onSubmit} className="btn btn-primary btn-lg group shadow-md hover:shadow-lg transition-shadow duration-200">
                            Create My Dashboard
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.section>
    );
} 
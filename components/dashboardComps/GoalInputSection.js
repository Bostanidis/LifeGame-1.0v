'use client';
import React from 'react';
import { motion } from 'framer-motion';

// Section 1: Goal Input
export default function GoalInputSection({ goals, setGoals, onSubmit }) {
    const handleGoalSetting = (e, index) => {
        const newGoals = [...goals];
        newGoals[index] = e.target.value;
        setGoals(newGoals);
    };

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
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-primary"><path fillRule="evenodd" d="M15.962 2.038a.75.75 0 0 1 .54.54l1.63 4.904a.75.75 0 0 1-.346.816l-4.04 2.02a.75.75 0 0 1-.83-.024l-1.68-1.403a.75.75 0 0 1-.024-.83l2.02-4.04a.75.75 0 0 1 .816-.346l4.904 1.63Zm-.338 8.956a.75.75 0 0 1 .024.83l-2.02 4.04a.75.75 0 0 1-.816.346l-4.904-1.63a.75.75 0 0 1-.54-.54l-1.63-4.904a.75.75 0 0 1 .346-.816l4.04-2.02a.75.75 0 0 1 .83.024l1.68 1.403Z" clipRule="evenodd" /><path fillRule="evenodd" d="M4.038 2.038a.75.75 0 0 1 .54-.54l4.904 1.63a.75.75 0 0 1 .346.816l-2.02 4.04a.75.75 0 0 1-.83.024l-1.68-1.403a.75.75 0 0 1-.024-.83L7.334 2.7a.75.75 0 0 1 .816-.346L4.038 2.038ZM3.003 11.018a.75.75 0 0 1 .83-.024l1.68 1.403a.75.75 0 0 1 .024.83l-2.02 4.04a.75.75 0 0 1-.816.346l-4.904-1.63a.75.75 0 0 1-.54-.54l-1.63-4.904a.75.75 0 0 1 .346-.816l4.04-2.02a.75.75 0 0 1 .83.024l1.68 1.403Zm6.934 6.934a.75.75 0 0 1 .83.024l4.04 2.02a.75.75 0 0 1 .346-.816l1.63-4.904a.75.75 0 0 1-.54-.54l-4.904-1.63a.75.75 0 0 1-.816.346l-2.02 4.04a.75.75 0 0 1 .024.83l1.403 1.68Z" clipRule="evenodd" /></svg>
                            Define 5 Goals
                         </h1>
                         <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Step 1 of 3</span>
                     </div>
                    <p className="mb-8 text-slate-600 dark:text-slate-400">What do you want to achieve this year? Write down five key objectives.</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                        {goals.map((goal, index) => (
                            <div key={index} className={`form-control ${index === 4 ? 'md:col-span-2' : ''}`}>
                                <label className="label">
                                    <span className="label-text font-medium text-slate-600 dark:text-slate-300">Goal {index + 1}</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={`e.g., ${['Learn Guitar', 'Run Marathon', 'Learn Spanish', 'Save $5k', 'Read 24 Books'][index]}`}
                                    className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-600 focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                                    value={goal}
                                    onChange={(e) => handleGoalSetting(e, index)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="card-actions justify-center mt-4">
                        <button onClick={onSubmit} className="btn btn-primary btn-lg group shadow-md hover:shadow-lg transition-shadow duration-200">
                            Continue
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.section>
    );
} 
'use client';
import React from 'react';
import { motion } from 'framer-motion';

// Section 2: Goal Selection
export default function GoalSelectionSection({ allGoals, selectedGoals, onSelect, onSubmit }) {
    const availableGoals = allGoals.filter(g => g.trim() !== "");

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col items-center gap-10 w-full'
        >
            <div className="card bg-white dark:bg-slate-800 shadow-xl w-full max-w-3xl border border-slate-200 dark:border-slate-700">
                <div className="card-body p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="card-title text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-secondary"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                             Select 2 Key Goals
                        </h1>
                         <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Step 2 of 3</span>
                    </div>
                    <p className="mb-8 text-slate-600 dark:text-slate-400">Which two goals will have the biggest impact? Choose your main quests.</p>
                    <div className="space-y-4 mb-8">
                        {availableGoals.map((goal, index) => {
                            const isSelected = selectedGoals.includes(goal);
                            const isDisabled = !isSelected && selectedGoals.length >= 2;
                            return (
                                 <label
                                    key={index}
                                    className={`cursor-pointer flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ease-in-out border-2 ${isSelected
                                         ? 'border-primary bg-primary/10 dark:bg-primary/20 scale-[1.02] shadow-md'
                                         : `border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`
                                        }`
                                    }
                                 >
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-lg form-checkbox h-6 w-6 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-primary dark:checked:border-primary"
                                        checked={isSelected}
                                        onChange={() => onSelect(goal)}
                                        disabled={isDisabled}
                                        style={{ display: 'none' }}
                                    />
                                    <span className={`flex-1 text-lg font-medium ${isSelected ? 'text-primary dark:text-primary-focus' : 'text-slate-700 dark:text-slate-200'}`}>{goal}</span>
                                     {isSelected && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-primary flex-shrink-0">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </label>
                            );
                        })}
                    </div>
                    <div className="card-actions justify-center items-center flex-col sm:flex-row gap-4 mt-4">
                         <div className="badge badge-outline badge-lg border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                            {selectedGoals.length}/2 selected
                        </div>
                        <button
                            onClick={onSubmit}
                            className="btn btn-primary btn-lg group w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            disabled={selectedGoals.length !== 2}
                        >
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
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { startOfWeek, subDays, subWeeks, addDays, format, isSameDay, parseISO, compareDesc } from 'date-fns';

// Section 4: Dashboard Display
export default function DashboardDisplaySection({ 
    level, experiencePoints, experienceToNextLevel,
    completedHabitsTodayCount, allHabitsTodayCount = 0, completionPercentageToday,
    streak,
    selectedGoals, habits, completedHabits, toggleHabitCompletion,
    completionHistory = {},
    unlockedAchievements,
    achievementsList,
    handleUpdateGoal,
    handleUpdateHabit
}) { 

    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    
    // Edit modal states
    const [showGoalEditModal, setShowGoalEditModal] = useState(false);
    const [showHabitEditModal, setShowHabitEditModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState({ index: -1, value: '' });
    const [editingHabit, setEditingHabit] = useState({ goalIndex: -1, habitIndex: -1, value: '' });

    // --- Recent Activity Log Data Prep ---
    const today = new Date();
    const startOfVisibleWeek = startOfWeek(subWeeks(today, 4), { weekStartsOn: 1 });
    const recentActivity = Object.entries(completionHistory)
        .map(([dateString, count]) => ({ dateString, date: parseISO(dateString), count }))
        .filter(entry => entry.count > 0)
        .sort((a, b) => compareDesc(a.date, b.date))
        .slice(0, 5);

    const handleOpenAchievementModal = (achievement) => {
        setSelectedAchievement(achievement);
        setShowAchievementModal(true);
    };

    const handleCloseAchievementModal = () => {
        setShowAchievementModal(false);
        setSelectedAchievement(null);
    };
    
    // Goal edit handlers
    const handleOpenGoalEditModal = (goal, index) => {
        setEditingGoal({ index, value: goal });
        setShowGoalEditModal(true);
    };
    
    const handleCloseGoalEditModal = () => {
        setShowGoalEditModal(false);
        setEditingGoal({ index: -1, value: '' });
    };
    
    const handleGoalEditSubmit = () => {
        if (editingGoal.index >= 0 && editingGoal.value.trim() !== '') {
            handleUpdateGoal(editingGoal.index, editingGoal.value);
            handleCloseGoalEditModal();
        }
    };
    
    // Habit edit handlers
    const handleOpenHabitEditModal = (habit, goalIndex, habitIndex) => {
        setEditingHabit({ goalIndex, habitIndex, value: habit });
        setShowHabitEditModal(true);
    };
    
    const handleCloseHabitEditModal = () => {
        setShowHabitEditModal(false);
        setEditingHabit({ goalIndex: -1, habitIndex: -1, value: '' });
    };
    
    const handleHabitEditSubmit = () => {
        if (editingHabit.goalIndex >= 0 && editingHabit.habitIndex >= 0 && editingHabit.value.trim() !== '') {
            handleUpdateHabit(editingHabit.goalIndex, editingHabit.habitIndex, editingHabit.value);
            handleCloseHabitEditModal();
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-10 w-full"
        >
            <div className="w-full max-w-7xl">
                 <h1 className="text-4xl font-bold mb-8 text-center text-slate-800 dark:text-slate-100">Your Quest Dashboard</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* --- Left Column (Character Stats & Recent Activity) --- */}
                    <div className="space-y-6 lg:space-y-8">
                        {/* Character Stats Card */}
                        <div className="card bg-slate-50 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="card-body items-center text-center">
                                 <div className="avatar mb-4">
                                    <div className="w-28 rounded-full ring ring-primary ring-offset-slate-50 dark:ring-offset-slate-800 ring-offset-2 overflow-hidden">
                                        <img 
                                            src={`https://api.dicebear.com/9.x/dylan/svg?seed=Hero${level}`}
                                            alt="Avatar" 
                                            width="112"
                                            height="112"
                                            className="bg-slate-100 dark:bg-slate-700"
                                        />
                                    </div>
                                </div>
                                <h2 className="card-title text-2xl text-slate-800 dark:text-slate-100">Level {level} Hero</h2>
    
                                 <div className="mt-4 w-full px-4">
                                    <div className="flex justify-between mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <span>Experience</span>
                                        <span>{experiencePoints % 100}/100 XP</span>
                                    </div>
                                    <progress className="progress progress-primary w-full h-3" value={experiencePoints % 100} max="100"></progress>
                                    <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{experienceToNextLevel} XP to next level</p>
                                </div>
    
                                <div className="stats stats-horizontal shadow mt-6 bg-transparent text-slate-700 dark:text-slate-300">
                                    <div className="stat">
                                        <div className="stat-title dark:text-slate-400">Today&apos;s Habits</div>
                                        <div className="stat-value text-primary">{completedHabitsTodayCount}/{allHabitsTodayCount}</div>
                                        <div className="stat-desc dark:text-slate-500">{completionPercentageToday}% complete</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title dark:text-slate-400">Current Streak</div>
                                        <div className="stat-value text-secondary">{streak}</div>
                                        <div className="stat-desc dark:text-slate-500">{streak > 0 ? (streak > 1 ? ' days 🔥' : ' day 🔥') : 'Start today!'}</div>
                                    </div>
                                 </div>
                             </div>
                        </div>

                        {/* Recent Activity Log Card - Replacement */}
                        <div className="card bg-slate-50 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                             <div className="card-body">
                                <h2 className="card-title text-xl text-slate-800 dark:text-slate-100 mb-2">Recent Activity</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Latest entries from your quest log.</p>
                                <div className="divider my-1 dark:before:bg-slate-700 dark:after:bg-slate-700"></div>
                                {recentActivity.length > 0 ? (
                                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                        {recentActivity.map((entry, index) => (
                                            <li key={`${entry.dateString}-${index}`} className="flex items-center justify-between gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-primary/70 dark:text-primary-focus/70 flex-shrink-0">
                                                        <path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 .75.75V3h6.5V2.5a.75.75 0 0 1 1.5 0V3h.25A2.75 2.75 0 0 1 15.75 5.75v5.5A2.75 2.75 0 0 1 13 14H3A2.75 2.75 0 0 1 .25 11.25v-5.5A2.75 2.75 0 0 1 3 3h.25V2.5A.75.75 0 0 1 4 1.75ZM1.75 5.75c0-.69.56-1.25 1.25-1.25H3V5h10V4.5h.25a1.25 1.25 0 0 1 1.25 1.25v5.5a1.25 1.25 0 0 1-1.25 1.25H3a1.25 1.25 0 0 1-1.25-1.25v-5.5Zm8.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                        {format(entry.date, 'MMMM d, yyyy')} 
                                                        {isSameDay(entry.date, today) && <span className="text-xs font-normal italic text-slate-400 dark:text-slate-500"> (Today)</span>}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{entry.count} {entry.count === 1 ? 'habit' : 'habits'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                                        Complete some habits to see your activity!
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Update History Card */}
                        <div className="card bg-slate-50 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="card-body">
                                <h2 className="card-title text-xl text-slate-800 dark:text-slate-100 mb-2">Update History</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Latest updates to the app.</p>
                                <div className="divider my-1 dark:before:bg-slate-700 dark:after:bg-slate-700"></div>
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                    <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100">v1.0 - Official Launch</h3>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">13.04.2025</span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            The official launch of LifeGame, a habit tracking app designed to help you build better habits and achieve your goals.
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100">v1.1 - Enhanced Experience</h3>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">14.04.2025</span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            Added hamster loader, working contact form, more achievements, goal and habit editing, and calendar functionality.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Center Column (Habits & Quests) --- */}
                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                        {/* Today's Habits */} 
                        <div className="card bg-slate-50 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="card-body">
                                <h2 className="card-title text-xl text-slate-800 dark:text-slate-100">Today&apos;s Habits</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Complete daily habits to gain XP!</p>
                                <div className="divider my-3 dark:before:bg-slate-700 dark:after:bg-slate-700"></div>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {selectedGoals.map((goal, goalIndex) => (
                                        <div key={`goal-section-${goalIndex}`} className="mb-4 last:mb-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`w-3 h-3 rounded-full ${goalIndex === 0 ? 'bg-primary' : 'bg-secondary'}`}></div>
                                                <h3 className="font-bold text-slate-700 dark:text-slate-200">{goal}</h3>
                                                <button 
                                                    className="btn btn-ghost btn-xs btn-circle ml-auto"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenGoalEditModal(goal, goalIndex);
                                                    }}
                                                    aria-label="Edit goal"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500 dark:text-slate-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="space-y-2 pl-5">
                                                {Array.isArray(habits?.[goalIndex]) && habits[goalIndex].map((habit, habitIndex) => {
                                                    const habitKey = `${goalIndex}-${habitIndex}`; 
                                                    const isCompleted = completedHabits.has(habitKey);
                                                    return (
                                                        <div
                                                            key={habitKey}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                                            onClick={() => toggleHabitCompletion(habitKey, habit)}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className={`checkbox checkbox-lg ${goalIndex === 0 ? 'checkbox-primary' : 'checkbox-secondary'}`}
                                                                checked={isCompleted}
                                                                readOnly 
                                                            />
                                                            <span className={`flex-1 text-slate-700 dark:text-slate-300 ${isCompleted ? 'line-through opacity-60' : ''}`}>
                                                                {habit}
                                                            </span>
                                                            <button 
                                                                className="btn btn-ghost btn-xs btn-circle"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenHabitEditModal(habit, goalIndex, habitIndex);
                                                                }}
                                                                aria-label="Edit habit"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500 dark:text-slate-400">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                </svg>
                                                            </button>
                                                            {isCompleted && (
                                                                <div className="badge badge-success gap-1 text-success-content">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                                                                    </svg>
                                                                    +25 XP
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         </div>
                         {/* Goals Progress */}
                           <div className="card bg-slate-50 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="card-body">
                                <h2 className="card-title text-xl text-slate-800 dark:text-slate-100">Your Quests</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Track progress towards your major goals</p>
                                <div className="divider my-3 dark:before:bg-slate-700 dark:after:bg-slate-700"></div>
                                <div className="space-y-6">
                                    {selectedGoals.map((goal, index) => {
                                        const goalHabits = habits[index];
                                        const completedForGoal = goalHabits.filter((_, habitIndex) =>
                                            completedHabits.has(`${index}-${habitIndex}`) 
                                        ).length;
                                        const progressPercent = Math.round((completedForGoal / goalHabits.length) * 100) || 0;

                                        return (
                                            <div key={`progress-${index}`} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-bold text-slate-700 dark:text-slate-200">{goal}</h3>
                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{progressPercent}%</span>
                                                </div>
                                                <progress
                                                    className={`progress ${index === 0 ? 'progress-primary' : 'progress-secondary'} w-full h-2.5`}
                                                    value={progressPercent}
                                                    max="100"
                                                ></progress>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                     {/* --- Right Column (Achievements & Activity) --- */}
                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                        {/* Achievements */} 
                        <div className="card bg-slate-50 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="card-body">
                                <h2 className="card-title text-xl text-slate-800 dark:text-slate-100">Achievements</h2>
                                 <p className="text-sm text-slate-500 dark:text-slate-400">Unlock rewards for consistency!</p>
                                <div className="divider my-3 dark:before:bg-slate-700 dark:after:bg-slate-700"></div>
                                <div className="flex flex-wrap gap-3 justify-start max-h-96 overflow-y-auto pr-2">
                                    {achievementsList.map((achievement) => {
                                        const isUnlocked = unlockedAchievements.has(achievement.id);
                                        const isHidden = achievement.hidden && !isUnlocked;
                                        const displayName = isHidden ? '???' : achievement.name;
                                        const displayDescription = isHidden ? achievement.description : (isUnlocked && achievement.unlockedDescription ? achievement.unlockedDescription : achievement.description);
                                        
                                        // Prepare achievement data for modal, using different desc if hidden & unlocked
                                        const modalAchievementData = {
                                             ...achievement,
                                             name: displayName,
                                             description: displayDescription 
                                        };

                                        return (
                                            <div
                                                key={achievement.id}
                                                className={`p-3 rounded-lg border dark:border-slate-600 w-[calc(50%-0.375rem)] flex-grow-0 flex-shrink-0 ${isUnlocked
                                                    ? 'bg-primary/10 dark:bg-primary/20 border-primary/30'
                                                    : 'bg-slate-100 dark:bg-slate-700/50 opacity-70' // Keep locked style even if hidden
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 justify-between w-full">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        {isUnlocked ? (
                                                             <div className="text-primary flex-shrink-0">
                                                                {/* Contextual icon based on achievement type */}
                                                                {achievement.id.startsWith('streak') ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : achievement.id.startsWith('level') ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : achievement.id.startsWith('habitMaster') ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : achievement.id === 'firstGoal' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : achievement.id === 'goalEditor' || achievement.id === 'habitEditor' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                                                    </svg>
                                                                ) : achievement.id === 'perfectWeek' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : achievement.id === 'habitDiversity' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                                                                    </svg>
                                                                ) : achievement.id === 'comebackKid' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : achievement.id.startsWith('hidden') ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        ) : (
                                                             <div className="text-slate-400 dark:text-slate-500 flex-shrink-0">
                                                                  {/* Locked Icon - Changed to info icon */}
                                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                                                  </svg>
                                                              </div>
                                                        )}
                                                        <h3 className={`font-bold text-sm truncate ${isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                                            {displayName} 
                                                        </h3>
                                                    </div>
                                                     <button 
                                                        className="btn btn-ghost btn-xs btn-circle flex-shrink-0"
                                                        onClick={() => handleOpenAchievementModal(modalAchievementData)} // Pass prepared data
                                                        disabled={isHidden} // Disable button for hidden, locked achievements
                                                        aria-label={isHidden ? "Unlock to reveal details" : "View achievement details"}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${isHidden ? 'text-slate-400 dark:text-slate-600' : ''}`}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                             </div>
                                        );
                                    })}
                                </div>
                            </div>
                         </div>
                         {/* Activity Heatmap */} 
                         <div className="card bg-slate-50 dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                            <div className="card-body">
                                <h2 className="card-title text-xl text-slate-800 dark:text-slate-100">Activity Calendar</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Your habit completion history (last 5 weeks)</p>
                                <div className="divider my-3 dark:before:bg-slate-700 dark:after:bg-slate-700"></div>

                                <div className="grid grid-cols-7 gap-1.5">
                                    {/* Render all day labels more consistently */}
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                        <div key={day} className="text-xs text-center text-slate-400 dark:text-slate-500">
                                            {day}
                                        </div>
                                    ))}
                                    
                                    {/* Render heatmap cells */}
                                    {Array.from({ length: 35 }).map((_, i) => {
                                        const cellDate = addDays(startOfVisibleWeek, i);
                                        const dateString = format(cellDate, 'yyyy-MM-dd');
                                        // Safely access completion count with fallback to 0
                                        const activityCount = completionHistory?.[dateString] || 0;
                                        
                                        // Use fixed denominator
                                        const maxPossible = 6; // Fixed total - 2 goals with 3 habits each
                                        const completionPercent = Math.min(100, Math.round((activityCount / maxPossible) * 100));
                                        
                                        const cellIsToday = isSameDay(cellDate, today);
                                        
                                        // Define classes based on completion percentage
                                        let baseClasses = "h-5 w-full rounded-sm transition-colors duration-150";
                                        let bgClass = completionPercent === 0 ? "bg-slate-200 dark:bg-slate-700/60" :
                                                    completionPercent <= 33 ? "bg-primary/20 dark:bg-primary/30" :
                                                    completionPercent <= 66 ? "bg-primary/50 dark:bg-primary/60" :
                                                    completionPercent < 100 ? "bg-primary/70 dark:bg-primary/80" :
                                                                            "bg-primary dark:bg-primary";
                                        
                                        let borderClass = cellIsToday 
                                            ? "border-2 border-secondary dark:border-secondary-focus shadow-inner" 
                                            : "hover:border-slate-400 dark:hover:border-slate-500 border-2 border-transparent";

                                        return (
                                            <div
                                                key={`heatmap-${i}`}
                                                className={`${baseClasses} ${bgClass} ${borderClass}`}
                                                title={`${format(cellDate, 'MMM d')}: ${activityCount} habit${activityCount === 1 ? '' : 's'} completed (${completionPercent}%) ${cellIsToday ? '(Today)' : ''}`}
                                            ></div>
                                        );
                                    })}
                                </div>
                                
                                <div className="flex justify-between text-xs mt-2 text-slate-400 dark:text-slate-500">
                                    <span>{format(startOfVisibleWeek, 'MMM d')}</span>
                                    <span>Today is {format(today, 'MMM d')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Info Modal (with Dark Mode) */}
            {selectedAchievement && (
                <dialog id="achievement_modal" className={`modal ${showAchievementModal ? 'modal-open' : ''}`}>
                    <div className="modal-box bg-white dark:bg-slate-800">
                        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">{selectedAchievement.name}</h3>
                        <p className="text-slate-600 dark:text-slate-300">{selectedAchievement.description}</p>
                        <div className="modal-action mt-6">
                            <button className="btn btn-ghost" onClick={handleCloseAchievementModal}>Close</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                         <button onClick={handleCloseAchievementModal}>close</button>
                    </form>
                </dialog>
            )}
            
            {/* Goal Edit Modal */}
            <dialog id="goal_edit_modal" className={`modal ${showGoalEditModal ? 'modal-open' : ''}`}>
                <div className="modal-box bg-white dark:bg-slate-800">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Edit Goal</h3>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-slate-700 dark:text-slate-300">Goal Name</span>
                        </label>
                        <input 
                            type="text" 
                            className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100" 
                            value={editingGoal.value}
                            onChange={(e) => setEditingGoal({...editingGoal, value: e.target.value})}
                            placeholder="Enter goal name"
                        />
                    </div>
                    <div className="modal-action mt-6">
                        <button className="btn btn-ghost" onClick={handleCloseGoalEditModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleGoalEditSubmit}>Save</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={handleCloseGoalEditModal}>close</button>
                </form>
            </dialog>
            
            {/* Habit Edit Modal */}
            <dialog id="habit_edit_modal" className={`modal ${showHabitEditModal ? 'modal-open' : ''}`}>
                <div className="modal-box bg-white dark:bg-slate-800">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Edit Habit</h3>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-slate-700 dark:text-slate-300">Habit Name</span>
                        </label>
                        <input 
                            type="text" 
                            className="input input-bordered w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100" 
                            value={editingHabit.value}
                            onChange={(e) => setEditingHabit({...editingHabit, value: e.target.value})}
                            placeholder="Enter habit name"
                        />
                    </div>
                    <div className="modal-action mt-6">
                        <button className="btn btn-ghost" onClick={handleCloseHabitEditModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleHabitEditSubmit}>Save</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={handleCloseHabitEditModal}>close</button>
                </form>
            </dialog>
        </motion.section>
    );
} 
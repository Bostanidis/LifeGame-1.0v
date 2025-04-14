"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format, parseISO, differenceInCalendarDays, startOfWeek, addDays, isSameDay, subDays } from 'date-fns';
import { useAuth } from '@/auth/AuthContext'; // Import useAuth
import {db} from '../../firebase'; // Import Firestore instance
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/auth/AuthContext';
import { updateDoc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import GoalInputSection from '@/components/dashboardComps/GoalInputSection';
import GoalSelectionSection from '@/components/dashboardComps/GoalSelectionSection';
import HabitInputSection from '@/components/dashboardComps/HabitInputSection';
import DashboardDisplaySection from '@/components/dashboardComps/DashboardDisplaySection';
import LoadingSpinner from '@/components/LoadingSpinner'; // Import the new spinner

// Define achievements
const achievementsList = [
    // Streaks
    { id: 'streak1', name: 'First Spark', description: 'Complete all habits for 1 day.', check: (streak) => streak >= 1 },
    { id: 'streak3', name: 'Consistency Cultivator', description: 'Complete all habits for 3 consecutive days.', check: (streak) => streak >= 3 },
    { id: 'streak7', name: 'Weekly Warrior', description: 'Complete all habits for 7 consecutive days.', check: (streak) => streak >= 7 },
    { id: 'streak14', name: 'Fortnightly Fire', description: 'Maintain a habit streak for 14 days.', check: (streak) => streak >= 14 },
    { id: 'streak30', name: 'Monthly Master', description: 'Achieve a 30-day habit streak.', check: (streak) => streak >= 30 },
    { id: 'streak100', name: 'Century Champion', description: 'Achieve a 100-day habit streak.', check: (streak) => streak >= 100 },
    // Levels
    { id: 'level5', name: 'Level 5 Hero', description: 'Reach level 5.', check: (level) => level >= 5 },
    { id: 'level10', name: 'Level 10 Champion', description: 'Reach level 10.', check: (level) => level >= 10 },
    { id: 'level20', name: 'Level 20 Legend', description: 'Reach level 20.', check: (level) => level >= 20 },
    { id: 'level30', name: 'Level 30 Mythic', description: 'Reach level 30.', check: (level) => level >= 30 },
    { id: 'level50', name: 'Level 50 Immortal', description: 'Reach level 50.', check: (level) => level >= 50 },
    { id: 'level100', name: 'Level 100 Deity', description: 'Reach level 100.', check: (level) => level >= 100 },
    // Habit Counts
    { id: 'habitMaster10', name: 'Habit Initiate (10)', description: 'Complete 10 habits in total.', check: (totalCompleted) => totalCompleted >= 10 },
    { id: 'habitMaster50', name: 'Habit Adept (50)', description: 'Complete 50 habits in total.', check: (totalCompleted) => totalCompleted >= 50 },
    { id: 'habitMaster100', name: 'Habit Veteran (100)', description: 'Complete 100 habits in total.', check: (totalCompleted) => totalCompleted >= 100 },
    { id: 'habitMaster250', name: 'Habit Expert (250)', description: 'Complete 250 habits in total.', check: (totalCompleted) => totalCompleted >= 250 },
    { id: 'habitMaster500', name: 'Habit Master (500)', description: 'Complete 500 habits in total.', check: (totalCompleted) => totalCompleted >= 500 },
    { id: 'habitMaster1000', name: 'Habit Grandmaster (1000)', description: 'Complete 1000 habits in total.', check: (totalCompleted) => totalCompleted >= 1000 },
    // Setup
    { id: 'firstGoal', name: 'Quest Giver', description: 'Set your first goals and habits.', check: (setupComplete) => setupComplete },
    { id: 'goalEditor', name: 'Quest Refiner', description: 'Edit a goal to better suit your journey.', check: (/* Will be checked manually */) => false },
    { id: 'habitEditor', name: 'Habit Sculptor', description: 'Edit a habit to better align with your goals.', check: (/* Will be checked manually */) => false },
    // Special Achievements
    { id: 'perfectWeek', name: 'Perfect Week', description: 'Complete all habits every day for a full week.', check: (/* Will be checked manually */) => false },
    { id: 'habitDiversity', name: 'Habit Diversity', description: 'Complete habits from all your different goals in a single day.', check: (/* Will be checked manually */) => false },
    { id: 'comebackKid', name: 'Comeback Kid', description: 'Break a streak and then start a new one of at least 3 days.', check: (/* Will be checked manually */) => false },
    // Hidden
    { id: 'hidden1', name: '???', description: 'Keep exploring and completing habits...', unlockedDescription: 'Early Bird: Completed a habit before 8 AM.', check: (/* Needs specific logic */) => false, hidden: true },
    { id: 'hidden2', name: '???', description: 'Something special awaits...', unlockedDescription: 'Night Owl: Completed a habit after 10 PM.', check: (/* Needs specific logic */) => false, hidden: true },
    { id: 'hidden3', name: '???', description: 'A mysterious achievement...', unlockedDescription: 'Weekend Warrior: Complete all habits on both Saturday and Sunday.', check: (/* Needs specific logic */) => false, hidden: true },
    { id: 'hidden4', name: '???', description: 'An enigmatic challenge...', unlockedDescription: 'Habit Explorer: Edit at least one goal and one habit.', check: (/* Will be checked manually */) => false, hidden: true },
];

// Function to calculate current streak
const calculateStreak = (completionHistory) => {
    let streak = 0;
    let currentDate = new Date();
    
    // Ensure date is valid
    if (isNaN(currentDate.getTime())) {
        console.error("Invalid date detected, using current system date");
        currentDate = new Date(); // Fallback to system date
    }
    
    while (true) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        if (completionHistory[dateString] && completionHistory[dateString] > 0) {
            streak++;
            currentDate = subDays(currentDate, 1);
        } else {
            break;
        }
    }
    return streak;
};

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Overall Page Status: loading, loggedOut, needsVerification, ready
    const [pageStatus, setPageStatus] = useState('loading');

    // Dashboard specific state
    const initialGoals = ["", "", "", "", ""];
    const initialSelectedGoals = [];
    const initialHabits = [["", "", ""], ["", "", ""]];
    const initialCompletedHabits = new Set();
    const initialCompletionHistory = {};
    const initialTotalHabitsCompleted = 0;
    const initialStreak = 0;
    const initialUnlockedAchievements = new Set();

    const [goals, setGoals] = useState(initialGoals);
    const [selectedGoals, setSelectedGoals] = useState(initialSelectedGoals);
    const [habits, setHabits] = useState(initialHabits);
    const [currentSection, setCurrentSection] = useState('goals'); // Default for ready state
    const [completedHabits, setCompletedHabits] = useState(initialCompletedHabits);
    const [completionHistory, setCompletionHistory] = useState(initialCompletionHistory);
    const [totalHabitsCompletedEver, setTotalHabitsCompletedEver] = useState(initialTotalHabitsCompleted);
    const [streak, setStreak] = useState(initialStreak);
    const [unlockedAchievements, setUnlockedAchievements] = useState(initialUnlockedAchievements);
    const [isSaving, setIsSaving] = useState(false); // Optional: track saving state

    // --- Reset State ---
    const resetDashboardState = useCallback(() => {
        console.log("Resetting dashboard state to defaults.");
        setGoals(initialGoals);
        setSelectedGoals(initialSelectedGoals);
        setHabits(initialHabits);
        setCurrentSection('goals'); // Reset section back to goals
        setCompletedHabits(initialCompletedHabits);
        setCompletionHistory(initialCompletionHistory);
        setTotalHabitsCompletedEver(initialTotalHabitsCompleted);
        setStreak(initialStreak);
        setUnlockedAchievements(initialUnlockedAchievements);
    }, []);

    // --- Effect for Auth State Change & Initial Load ---
    useEffect(() => {
        if (authLoading) {
            setPageStatus('loading');
            return; // Wait for auth state to be determined
        }

        if (!user) {
            console.log("Effect: User logged out");
            resetDashboardState();
            setPageStatus('loggedOut');
            return;
        }

        if (!user.emailVerified) {
            console.log("Effect: User logged in, needs verification");
            resetDashboardState();
            setPageStatus('needsVerification');
            return;
        }

        // --- User is Logged In and Verified ---
        console.log("Effect: Verified user detected. Loading dashboard data...");
        setPageStatus('loading'); // Show loading while fetching data

        const docRef = doc(db, "users", user.uid, "dashboardData", "main");
        let isMounted = true;

        getDoc(docRef).then(docSnap => {
            if (!isMounted) return;

            if (docSnap.exists()) {
                console.log("Effect: Data found, processing...");
                const data = docSnap.data();

                // Load base data
                const loadedGoals = data.goals || initialGoals;
                const loadedSelectedGoals = data.selectedGoals || initialSelectedGoals;
                const loadedHistory = data.completionHistory || initialCompletionHistory;
                const loadedTotalCompleted = data.totalHabitsCompletedEver || initialTotalHabitsCompleted;
                const loadedAchievements = new Set(data.unlockedAchievements || []);
                const calculatedStreak = calculateStreak(loadedHistory);
                const loadedCompletedHabits = new Set(data.todaysCompletedHabits?.[format(new Date(), 'yyyy-MM-dd')] || []);

                // Load and convert habits
                let loadedHabits = initialHabits;
                const firestoreHabits = data.habits;
                 if (typeof firestoreHabits === 'object' && !Array.isArray(firestoreHabits) && loadedSelectedGoals.length > 0) {
                      loadedHabits = loadedSelectedGoals.map((_, index) => firestoreHabits[String(index)] || []);
                 } else if (Array.isArray(firestoreHabits)) {
                     loadedHabits = firestoreHabits;
                 }

                // Determine section based on loaded data
                const hasSelectedGoals = loadedSelectedGoals.length > 0;
                const hasHabits = hasSelectedGoals && loadedHabits.some(gH => gH && gH.length > 0 && gH.some(h => h && h.trim() !== ''));
                const hasDefinedGoals = loadedGoals.some(g => g && g.trim() !== '');

                let section = 'goals'; // Default if data is somehow incomplete
                 if (hasSelectedGoals && hasHabits) {
                     section = 'dashboard';
                 } else if (hasSelectedGoals) {
                     section = 'habits';
                 } else if (hasDefinedGoals) {
                     section = 'select';
                 }

                // Update all state at once
                setGoals(loadedGoals);
                setSelectedGoals(loadedSelectedGoals);
                setHabits(loadedHabits);
                setCompletionHistory(loadedHistory);
                setTotalHabitsCompletedEver(loadedTotalCompleted);
                setUnlockedAchievements(loadedAchievements);
                setStreak(calculatedStreak);
                setCompletedHabits(loadedCompletedHabits);
                setCurrentSection(section); // Set the correct section
                console.log(`Effect: Data processed, setting section to '${section}'`);

            } else {
                // --- No data exists for this verified user ---
                console.log("Effect: No data found, initializing setup (goals section).");
                resetDashboardState(); // Ensure defaults are set
                setCurrentSection('goals'); // Explicitly set to goals for setup
            }
             setPageStatus('ready'); // Data processed (or not found), page is ready

        }).catch(error => {
            if (!isMounted) return;
            console.error("Effect: Error loading dashboard data:", error);
            resetDashboardState(); // Reset on error
            setCurrentSection('error'); // Set an error section state
            setPageStatus('ready'); // Still ready, but showing error
        });

        return () => { isMounted = false; } // Cleanup

    }, [user, authLoading, resetDashboardState]); // Depend on user and auth loading state

    // --- Firestore Data Saving Effect ---
    useEffect(() => {
        // Debounced save function
        const handler = setTimeout(() => {
            if (pageStatus === 'ready' && user && user.emailVerified) {
                setIsSaving(true);
                const habitsForFirestore = habits.reduce((obj, goalHabits, index) => {
                    obj[String(index)] = goalHabits;
                    return obj;
                }, {});

                const dataToSave = {
                    goals,
                    selectedGoals,
                    habits: habitsForFirestore,
                    currentSection, // Save current setup step if not dashboard yet
                    completionHistory,
                    totalHabitsCompletedEver,
                    unlockedAchievements: Array.from(unlockedAchievements),
                    todaysCompletedHabits: {
                        [format(new Date(), 'yyyy-MM-dd')]: Array.from(completedHabits)
                    }
                };
                const docRef = doc(db, "users", user.uid, "dashboardData", "main");
                setDoc(docRef, dataToSave, { merge: true })
                    .then(() => {
                        console.log("Data saved successfully.");
                    })
                    .catch((error) => {
                        console.error("Error saving dashboard data:", error);
                    })
                    .finally(() => {
                        setIsSaving(false);
                    });
            }
        }, 1500); // Adjust debounce time as needed

        return () => clearTimeout(handler);

    }, [goals, selectedGoals, habits, currentSection, completionHistory, totalHabitsCompletedEver, unlockedAchievements, completedHabits, user, pageStatus]); // Depend on relevant state

    // --- Derived State Calculations ---
    const allHabitsToday = habits.flat().filter(h => h.trim() !== "");
    const allHabitsTodayCount = allHabitsToday.length;
    const completedHabitsToday = completedHabits.size;
    const experiencePoints = totalHabitsCompletedEver * 25;
    const level = Math.floor(experiencePoints / 100) + 1;
    const experienceToNextLevel = 100 - (experiencePoints % 100);
    const completionPercentageToday = allHabitsTodayCount > 0
        ? Math.round((completedHabitsToday / allHabitsTodayCount) * 100)
        : 0;

    // --- Logic Functions ---

    const checkAchievements = useCallback(() => {
        const currentLevel = level;
        const currentStreak = streak;
        const currentTotalCompleted = totalHabitsCompletedEver;
        const setupComplete = selectedGoals.length > 0 && 
                              habits.some(goalHabits => goalHabits && goalHabits.length > 0 && goalHabits.some(h => h && h.trim() !== ''));

        let newlyUnlocked = false;
        const updatedAchievements = new Set(unlockedAchievements);

        achievementsList.forEach(achievement => {
            if (!updatedAchievements.has(achievement.id)) {
                let conditionMet = false;
                try {
                    if (achievement.id.startsWith('streak')) {
                        conditionMet = achievement.check(currentStreak);
                    } else if (achievement.id.startsWith('level')) {
                        conditionMet = achievement.check(currentLevel);
                    } else if (achievement.id.startsWith('habitMaster')) {
                        conditionMet = achievement.check(currentTotalCompleted);
                    } else if (achievement.id === 'firstGoal') {
                        conditionMet = achievement.check(setupComplete);
                    } else if (achievement.id === 'goalEditor' || achievement.id === 'habitEditor' || 
                               achievement.id === 'perfectWeek' || achievement.id === 'habitDiversity' || 
                               achievement.id === 'comebackKid' || achievement.id === 'hidden4') {
                        // These achievements will be checked manually when the user performs the action
                        // For now, we'll just skip them
                        conditionMet = false;
                    } else {
                        console.warn(`Unknown achievement check type for ID: ${achievement.id}`);
                    }
                } catch (e) {
                     console.error(`Error checking achievement ${achievement.id}:`, e)
                     conditionMet = false;
                }

                if (conditionMet) {
                    updatedAchievements.add(achievement.id);
                    newlyUnlocked = true;
                    console.log(`Achievement Unlocked: ${achievement.name}`);
                }
            }
        });

        if (newlyUnlocked) {
            setUnlockedAchievements(updatedAchievements);
        }
    }, [level, streak, totalHabitsCompletedEver, selectedGoals, habits, unlockedAchievements, setUnlockedAchievements]);

    // Function to update a goal
    const handleUpdateGoal = useCallback((index, newValue) => {
        setSelectedGoals(prev => {
            const updated = [...prev];
            updated[index] = newValue;
            return updated;
        });
        
        // Unlock the goalEditor achievement
        setUnlockedAchievements(prev => {
            const updated = new Set(prev);
            updated.add('goalEditor');
            return updated;
        });
    }, []);

    // Function to update a habit
    const handleUpdateHabit = useCallback((goalIndex, habitIndex, newValue) => {
        setHabits(prev => {
            const updated = [...prev];
            if (!updated[goalIndex]) {
                updated[goalIndex] = [];
            }
            updated[goalIndex][habitIndex] = newValue;
            return updated;
        });
        
        // Unlock the habitEditor achievement
        setUnlockedAchievements(prev => {
            const updated = new Set(prev);
            updated.add('habitEditor');
            return updated;
        });
        
        // Check if both goal and habit have been edited to unlock hidden4
        if (unlockedAchievements.has('goalEditor')) {
            setUnlockedAchievements(prev => {
                const updated = new Set(prev);
                updated.add('hidden4');
                return updated;
            });
        }
    }, [unlockedAchievements]);

    useEffect(() => {
        if (pageStatus === 'ready' && user?.emailVerified) {
            const calculatedStreak = calculateStreak(completionHistory);
            if (calculatedStreak !== streak) {
                setStreak(calculatedStreak);
            }
            checkAchievements();
        }
    }, [completionHistory, pageStatus, user, streak, checkAchievements]); 

    // Recalculate streak & check achievements whenever dependencies change
     useEffect(() => {
        // ... (streak and achievement check logic)
    }, [completionHistory, pageStatus, user, streak, checkAchievements]); 

    // --- Effect to Reset Daily Habits at Midnight ---
    useEffect(() => {
        // Explicitly use today's date
        const now = new Date(2025, 3, 14); // April 14th, 2025
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const timeToMidnight = tomorrow.getTime() - now.getTime();

        console.log(`Setting daily reset timer for ${timeToMidnight}ms`);

        const timerId = setTimeout(() => {
            console.log("Midnight reset: Clearing today's completed habits.");
            setCompletedHabits(initialCompletedHabits); 
        }, timeToMidnight);

        return () => {
            console.log("Clearing daily reset timer.");
            clearTimeout(timerId);
        };
    }, []);

    // --- Navigation Handlers ---
    function handleGoalSubmit() {
        const filledGoals = goals.filter(goal => goal.trim() !== "");
        if (filledGoals.length < 5) {
            window.alert("Please input all five goals."); return;
        }
        if (new Set(filledGoals).size !== filledGoals.length) {
            window.alert("Goals must be unique."); return;
        }
        setCurrentSection('select');
    }

    function handleSelectGoal(goal) {
        setSelectedGoals(prev => {
            if (prev.includes(goal)) return prev.filter(item => item !== goal);
            if (prev.length < 2) return [...prev, goal];
            return prev;
        });
    }

    function handleSelectSubmit() {
        if (selectedGoals.length !== 2) {
            window.alert("Please choose exactly 2 goals."); return;
        }
        setCurrentSection('habits');
    }

    function handleHabitChange(goalIndex, habitIndex, value) {
        setHabits(prev => {
            const newHabits = prev.map(arr => [...arr]);
            if (!newHabits[goalIndex]) {
              newHabits[goalIndex] = [];
            }
            newHabits[goalIndex][habitIndex] = value;
            return newHabits;
          });
    }

    function handleHabitSubmit() {
        if (!habits.every(goalHabits => goalHabits.every(habit => habit.trim() !== ""))) {
            window.alert("Please fill in all 3 habits for both selected goals."); return;
        }
        setCurrentSection('dashboard');
    }

    const toggleHabitCompletion = useCallback((habitKey, habitText) => {
        console.log(`Toggling habit: ${habitKey}`);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        let wasCompletedInitially = false; // State BEFORE toggle

        // --- Step 1: Update the Set of completed habits for today ---
        setCompletedHabits(prev => {
            const newSet = new Set(prev);
            if (newSet.has(habitKey)) {
                console.log(` - Habit ${habitKey} was completed, removing.`);
                wasCompletedInitially = true;
                newSet.delete(habitKey);
            } else {
                console.log(` - Habit ${habitKey} was not completed, adding.`);
                wasCompletedInitially = false;
                newSet.add(habitKey);
            }
            // Update completion history immediately based on the NEW set size
            setCompletionHistory(prevHistory => {
                const newHistory = { ...prevHistory };
                newHistory[todayStr] = newSet.size; // Store the size of the *new* set
                console.log(` - Updated completionHistory for ${todayStr}:`, newHistory[todayStr]);
                return newHistory;
            });
            return newSet; // Return the new set for the completedHabits state
        });

        // --- Step 2: Update the total count based on the INITIAL state ---
        // This needs to happen *after* setCompletedHabits has initiated its update,
        // but uses the `wasCompletedInitially` flag captured before the update.
        setTotalHabitsCompletedEver(prevTotal => {
            let newTotal;
            if (wasCompletedInitially) {
                // If it WAS completed and we unchecked it, DECREASE total
                newTotal = Math.max(0, prevTotal - 1);
                console.log(` - Decreasing total habits completed: ${prevTotal} -> ${newTotal}`);
            } else {
                // If it WAS NOT completed and we checked it, INCREASE total
                newTotal = prevTotal + 1;
                console.log(` - Increasing total habits completed: ${prevTotal} -> ${newTotal}`);
            }
            return newTotal;
        });

    }, [setCompletedHabits, setCompletionHistory, setTotalHabitsCompletedEver]); // Dependencies: Only the setters are needed here

    // --- Render Logic ---
    if (pageStatus === 'loading') {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)]">
                 <LoadingSpinner />
                 <p className="mt-4 text-slate-500 dark:text-slate-400">Loading dashboard...</p>
            </div>
        );
    }

    if (pageStatus === 'loggedOut') {
         return (
             <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)] text-center px-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                 <h2 className="text-2xl font-semibold mb-4">Access Your Dashboard</h2>
                 <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in or sign up to view your dashboard.</p>
                 {/* You could add buttons here to trigger the AuthModal */}
             </div>
         );
     }

     if (pageStatus === 'needsVerification') {
          return (
              <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)] text-center px-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  <div className="max-w-md p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
                      <div className="mb-4 text-primary dark:text-primary-focus flex justify-center">
                          {/* Email Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                          </svg>
                      </div>
                      <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">Verify Your Email</h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                         Please click the verification link sent to <span className="font-medium text-slate-700 dark:text-slate-300 break-all">{user?.email || 'your email'}</span> to activate your dashboard.
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                          (Check your spam folder. You might need to refresh this page after verifying.)
                      </p>
                  </div>
              </div>
          );
      }

    // --- Page Status is 'ready' ---
    const renderContent = () => {
        switch (currentSection) {
             case 'goals':
                 return (<GoalInputSection goals={goals} setGoals={setGoals} onSubmit={handleGoalSubmit} />);
             case 'select':
                 return (<GoalSelectionSection allGoals={goals.filter(g => g.trim() !== '')} selectedGoals={selectedGoals} onSelect={handleSelectGoal} onSubmit={handleSelectSubmit} />);
             case 'habits':
                  return (<HabitInputSection selectedGoals={selectedGoals} habits={habits} onHabitChange={handleHabitChange} onSubmit={handleHabitSubmit} />);
             case 'dashboard':
                 return (<DashboardDisplaySection
                              level={level}
                              experiencePoints={experiencePoints}
                              experienceToNextLevel={experienceToNextLevel}
                              completedHabitsTodayCount={completedHabitsToday}
                              allHabitsTodayCount={allHabitsTodayCount}
                              completionPercentageToday={completionPercentageToday}
                              streak={streak}
                              selectedGoals={selectedGoals}
                              habits={habits}
                              completedHabits={completedHabits}
                              toggleHabitCompletion={toggleHabitCompletion}
                              completionHistory={completionHistory}
                              unlockedAchievements={unlockedAchievements}
                              achievementsList={achievementsList}
                              handleUpdateGoal={handleUpdateGoal}
                              handleUpdateHabit={handleUpdateHabit}
                          />);
             case 'error': // Handle data loading error
                return (
                    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)] text-center px-4">
                         <h2 className="text-2xl font-semibold mb-4">Error</h2>
                         <p className="text-slate-600 dark:text-slate-400 mb-6">Could not load dashboard data. Please try again later.</p>
                    </div>
                );
             default: // Fallback for unexpected section state
                 console.warn("Rendering default fallback, currentSection:", currentSection);
                 return (
                      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-8rem)] text-center px-4">
                          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
                      </div>
                  );
         }
     };

    return (
         <div className='container mx-auto px-4 py-10 min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-slate-900 dark:to-slate-800'>
             {renderContent()}
         </div>
     );
}
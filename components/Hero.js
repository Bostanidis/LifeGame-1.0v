"use client"
// components/Hero.js
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  // Example Stats - In a real app, these might be fetched or static examples
  const heroLevel = 7;
  const heroXP = 65; // XP towards next level (out of 100)

  return (
    <div className="hero min-h-[80vh] py-8 lg:py-12 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 hero-content flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-center">
        {/* === Visual Section: Character Mockup === */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center">
          <div className="relative z-10 p-6 md:p-8 lg:p-10 rounded-2xl shadow-2xl overflow-hidden group w-full max-w-md bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
             {/* Subtle background gradient elements */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 opacity-50 dark:opacity-40 blur-3xl rounded-full transition-all duration-700 group-hover:opacity-60 group-hover:scale-110"></div>

            {/* Character Mockup Content */}
            <div className="relative z-20 flex flex-col items-center gap-6">
                {/* Avatar */}
                <div className="avatar mb-2">
                    <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full ring-4 ring-offset-4 ring-offset-base-100 dark:ring-offset-slate-900 ring-primary overflow-hidden shadow-xl">
                        <img 
                            src="https://api.dicebear.com/9.x/dylan/svg?seed=Felix"
                            alt="Hero Avatar"
                            width="64"
                            height="64"
                            className="w-full h-full object-cover bg-slate-100 dark:bg-slate-700"
                        />
                    </div>
                </div>

                 {/* Level Text */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Level {heroLevel} Adventurer
                </h3>

                {/* XP Bar */}
                <div className="w-full px-4">
                     <div className="flex justify-between mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <span>Experience</span>
                        <span>{heroXP}/100 XP</span>
                    </div>
                     <progress className="progress progress-primary w-full h-3 bg-slate-200 dark:bg-slate-700" value={heroXP} max="100"></progress>
                     <p className="text-xs text-right mt-1 text-slate-500 dark:text-slate-400">{100 - heroXP} to next level</p>
                </div>

                 {/* Example Badges/Icons */}
                 <div className="flex gap-4 mt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary dark:text-primary-focus" title="Streak Achieved">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                    </div>
                     <div className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-full text-secondary dark:text-secondary-focus" title="Goals Mastered">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 3.75Z" /><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0 1.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19Z" clipRule="evenodd" /></svg>
                     </div>
                     <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-full text-accent dark:text-accent-focus" title="Habit Ninja">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Text Content Section */}
        <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start gap-5">
             {/* Adjusted Badge */}
             <span className="inline-flex items-center rounded-full bg-secondary/10 px-4 py-1 text-sm font-medium text-secondary dark:bg-secondary/20 dark:text-secondary-focus">
                 ✨ Gamify Your Life
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-slate-100">
              Turn Hard <br className="hidden lg:block" /> Work Into <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary-focus dark:to-secondary-focus">
                A Rewarding Game
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg">
              Transform your daily tasks into rewarding adventures. Level up your life, track habits, and achieve goals with a gamified experience that makes productivity fun.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center lg:justify-start">
              <Link href="/dashboard" className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/about" className="btn btn-ghost btn-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                Learn More
              </Link>
            </div>

            <div className="flex items-center gap-3 mt-3 justify-center lg:justify-start">
              <div className="flex -space-x-3 avatar-group">
                <div className="avatar border-2 border-white dark:border-slate-800">
                  <div className="w-9 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-focus font-semibold">
                    <span className="text-xs">AV</span>
                  </div>
                </div>
                <div className="avatar border-2 border-white dark:border-slate-800">
                  <div className="w-9 bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary-focus font-semibold">
                    <span className="text-xs">BZ</span>
                  </div>
                </div>
                <div className="avatar border-2 border-white dark:border-slate-800">
                   <div className="w-9 bg-accent/20 dark:bg-accent/30 text-accent dark:text-accent-focus font-semibold">
                    <span className="text-xs">C+</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Join 2,500+ users leveling up</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
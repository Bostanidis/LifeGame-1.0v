"use client"
// components/Header.js
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/auth/AuthContext'
import AuthModal from './AuthModal'
import LoadingSpinner from './LoadingSpinner'

export default function Header() {
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const { user, logout, loading, resendVerificationEmail } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [initialModalView, setInitialModalView] = useState('login');
    const [isResending, setIsResending] = useState(false);
    const [resendBannerStatus, setResendBannerStatus] = useState(null);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    function handleThemeChange() {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const openAuthModal = (view = 'login') => {
        setInitialModalView(view);
        setIsAuthModalOpen(true);
    }
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const handleResendFromBanner = async () => {
        if (!user || isResending) return;
        setIsResending(true);
        setResendBannerStatus(null);
        try {
            await resendVerificationEmail();
            setResendBannerStatus({ type: 'success', message: 'Verification email sent!' });
            // Hide message after a few seconds
            setTimeout(() => setResendBannerStatus(null), 5000);
        } catch (error) {
            console.error("Error resending verification from banner:", error);
            setResendBannerStatus({ type: 'error', message: error.message || 'Failed to resend.' });
            setTimeout(() => setResendBannerStatus(null), 5000);
        } finally {
            setIsResending(false);
        }
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/contact", label: "Contact" },
        { href: "/about", label: "About Us" },
    ];

    return (
        <>
            {/* Verification Banner - Shows if user exists but is not verified */}
            {user && !user.emailVerified && !loading && (
                <div className="bg-yellow-100 dark:bg-yellow-900/50 border-b border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-sm px-4 py-2">
                    <div className="container mx-auto flex items-center justify-between gap-4">
                        <p className="flex-grow">
                            <span className="font-semibold">Action Required:</span> Please check your email (<span className="font-medium">{user.email}</span>) and click the verification link to fully activate your account.
                        </p>
                        <div className="flex-shrink-0">
                            <button 
                                onClick={handleResendFromBanner}
                                className={`btn btn-xs btn-warning btn-outline ${isResending ? 'btn-disabled' : ''}`}
                                disabled={isResending}
                            >
                                {isResending ? (
                                    <div style={{ fontSize: '6px' }}>
                                        <LoadingSpinner />
                                    </div>
                                ) : 'Resend Email'}
                            </button>
                        </div>
                    </div>
                    {resendBannerStatus && (
                        <p className={`text-xs mt-1 text-center ${resendBannerStatus.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {resendBannerStatus.message}
                        </p>
                    )}
                </div>
            )}

            <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm transition-colors duration-500">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-primary dark:text-primary-focus text-2xl font-bold tracking-tight transition-colors hover:text-primary/80 dark:hover:text-primary-focus/80">
                            LifeGame
                        </Link>
                    </div>

                    <nav className="hidden lg:flex flex-grow items-center justify-center">
                        <ul className="flex space-x-6">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`text-sm font-medium transition-colors duration-200 ${
                                            pathname === link.href
                                                ? 'text-primary dark:text-primary-focus font-semibold'
                                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-3">
                        <label className="swap swap-rotate h-8 w-8">
                            <input
                                type="checkbox"
                                className="theme-controller hidden"
                                checked={theme === "dark"}
                                onChange={handleThemeChange}
                                aria-label="Toggle theme"
                            />
                            <svg
                                className="swap-off h-6 w-6 fill-current text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                            <svg
                                className="swap-on h-6 w-6 fill-current text-yellow-500 hover:text-yellow-600 transition-colors"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                        </label>

                        {!loading && (
                            <div className="hidden lg:flex items-center space-x-2">
                                {user ? (
                                    <>
                                        <button onClick={handleLogout} className="btn btn-ghost btn-sm normal-case text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">Log Out</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => openAuthModal('login')} className="btn btn-ghost btn-sm normal-case text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">Log In</button>
                                        <button onClick={() => openAuthModal('signup')} className="btn btn-primary btn-sm normal-case">Sign up</button>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className={`block h-6 w-6 ${isMobileMenuOpen ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className={`block h-6 w-6 ${isMobileMenuOpen ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 shadow-lg" id="mobile-menu">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200 ${
                                        pathname === link.href
                                            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-focus'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
                                    }`}
                                    aria-current={pathname === link.href ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        {!loading && (
                            <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 space-y-3">
                                {user ? (
                                    <>
                                        <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full normal-case">Log Out</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => openAuthModal('login')} className="btn btn-ghost btn-sm w-full normal-case">Log In</button>
                                        <button onClick={() => openAuthModal('signup')} className="btn btn-primary btn-sm w-full normal-case">Sign up</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </header>

            <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialView={initialModalView} />
        </>
    )
}
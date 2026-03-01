import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const FinishSignIn: React.FC = () => {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your sign-in link...');
    const navigate = useNavigate();

    useEffect(() => {
        const completeSignIn = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');

                if (!email) {
                    email = window.prompt('Please provide your email for confirmation');
                }

                if (email) {
                    try {
                        await signInWithEmailLink(auth, email, window.location.href);
                        window.localStorage.removeItem('emailForSignIn');

                        // Haptic feedback for success
                        if ("vibrate" in navigator) {
                            navigator.vibrate([10, 30, 10]);
                        }

                        setStatus('success');
                        setMessage('Welcome back! Redirecting to your profile...');
                        setTimeout(() => navigate('/profile'), 2500);
                    } catch (error: any) {
                        console.error('Sign-in error:', error);
                        setStatus('error');
                        setMessage('The link may have expired or already been used.');
                    }
                } else {
                    setStatus('error');
                    setMessage('Email confirmation is required to proceed.');
                }
            }
        };

        completeSignIn();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 text-center max-w-sm w-full"
            >
                <AnimatePresence mode="wait">
                    {status === 'verifying' && (
                        <motion.div
                            key="verifying"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="relative w-12 h-12 mx-auto">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">Authenticating</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-emerald-400">Success</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="text-rose-500 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-rose-400">Error</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                            >
                                Back to Home
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default FinishSignIn;

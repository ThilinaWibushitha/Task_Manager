import React, { useState } from 'react';
import { LogIn, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '../api/googleSheet';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) return;

        setLoading(true);
        try {
            const result = await api.login(email.trim(), password.trim());

            if (result.valid) {
                onLogin(result); // Pass full user object {id, name, email, role}
                // Redirect based on role
                if (result.role === 'ADMIN') navigate('/admin');
                else if (result.role === 'PM') navigate('/pm');
                else navigate('/employee');
            } else {
                setError(result.message || 'Invalid Credentials');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950 p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>
            <div className="glass-card max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-12 h-12">
                        <rect x="16" y="14" width="32" height="40" rx="4" fill="white" opacity="0.95" />
                        <rect x="24" y="10" width="16" height="8" rx="3" fill="white" />
                        <rect x="27" y="12" width="10" height="4" rx="2" fill="#0d9488" />
                        <rect x="22" y="26" width="14" height="3" rx="1.5" fill="#e2e8f0" />
                        <path d="M36 25l3 3 5-5" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="22" y="34" width="14" height="3" rx="1.5" fill="#e2e8f0" />
                        <path d="M36 33l3 3 5-5" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="22" y="42" width="14" height="3" rx="1.5" fill="#e2e8f0" />
                        <circle cx="40" cy="43.5" r="3" fill="#f59e0b" opacity="0.7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1 font-display">Daily Task Manager</h1>
                <p className="text-slate-400 mb-8">Sign in to access your dashboard</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />

                    {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-white/10 pt-6">
                    <p className="text-slate-400 text-sm mb-2">Don't have an account?</p>
                    <Link to="/register" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline flex items-center justify-center gap-1 transition-colors">
                        Register New Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

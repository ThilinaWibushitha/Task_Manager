import React, { useState } from 'react';
import { LogIn, Loader2, ShieldCheck, UserPlus } from 'lucide-react';
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
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]"></div>
            </div>

            <div className="glass-card max-w-md w-full text-center p-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(6,182,212,0.3)] rotate-3 hover:rotate-0 transition-transform duration-500 group">
                    <ShieldCheck className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                </div>

                <h1 className="text-4xl font-black text-white mb-2 font-display tracking-tight leading-tight uppercase">
                    Daily <br />
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Task System</span>
                </h1>
                <p className="text-slate-500 font-light mb-10 tracking-widest uppercase text-xs">Aesthetics & Performance</p>

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="Employee Email"
                            className="input-field py-3"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="Security Key"
                            className="input-field py-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 animate-in shake duration-300">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 group relative overflow-hidden" disabled={loading}>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>
                                <span className="font-bold tracking-widest uppercase text-sm">Login</span>
                                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-white/5 pt-8">
                    <p className="text-slate-500 text-xs mb-3 font-light">Don't have an account?</p>
                    <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                        Register <UserPlus className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/googleSheet';
import { UserPlus, ArrowLeft, Loader2, LogIn } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'EMPLOYEE', // Default
        dept: 'DevOps' // Default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (!formData.id || !formData.name || !formData.email || !formData.password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        const res = await api.addEmployee({
            ...formData
        });

        setLoading(false);

        if (res.status === 'success') {
            alert('Registration Successful! Please login.');
            navigate('/login');
        } else {
            setError(res.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="glass-card max-w-lg w-full p-10 animate-in fade-in zoom-in duration-500 relative z-10 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                <div className="text-center mb-10">
                    <div className="bg-cyan-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <UserPlus className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white font-display tracking-tight">CREATE ACCOUNT</h2>
                    <p className="text-slate-500 tracking-widest uppercase text-[10px] font-bold mt-1">Daily Task Manager</p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl text-sm mb-8 text-center border border-rose-500/20 animate-in shake duration-300 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Employee ID</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. EMP001"
                                value={formData.id}
                                onChange={e => setFormData({ ...formData, id: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Department</label>
                            <select
                                className="input-field bg-navy-900/50"
                                value={formData.dept}
                                onChange={e => setFormData({ ...formData, dept: e.target.value })}
                            >
                                <option value="DevOps" className="bg-navy-900 text-slate-300">DevOps Dept.</option>
                                <option value="TecOps" className="bg-navy-900 text-slate-300">TecOps Dept.</option>
                                <option value="Accounting" className="bg-navy-900 text-slate-300">Accounting Dept.</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Role</label>
                            <select
                                className="input-field bg-navy-900/50"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="EMPLOYEE" className="bg-navy-900 text-slate-300">Others</option>
                                <option value="PM" className="bg-navy-900 text-slate-300">Project Manager</option>
                                <option value="ADMIN" className="bg-navy-900 text-slate-300">HR</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="Strong encryption key"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 flex justify-center items-center gap-2 mt-8 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <span className="font-bold tracking-widest uppercase text-sm">Register</span>
                                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-white/5 pt-8">
                    <p className="text-slate-500 text-xs mb-3 font-light">Already have an account?</p>
                    <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}

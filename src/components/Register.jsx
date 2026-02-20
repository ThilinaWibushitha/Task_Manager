import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/googleSheet';
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';

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
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>
            <div className="glass-card rounded-2xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300 relative z-10">
                <div className="text-center mb-8">
                    <div className="bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-cyan-500/30">
                        <UserPlus className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-display">Create Account</h2>
                    <p className="text-slate-400">Join the Daily Task Manager</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-6 text-center border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-1">Employee ID</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="e.g. EMP001"
                            value={formData.id}
                            onChange={e => setFormData({ ...formData, id: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-1">Department</label>
                        <select
                            className="input-field bg-navy-900 border-white/10 text-white"
                            value={formData.dept}
                            onChange={e => setFormData({ ...formData, dept: e.target.value })}
                        >
                            <option value="DevOps" className="bg-navy-900">DevOps</option>
                            <option value="TecOps" className="bg-navy-900">TecOps</option>
                            <option value="Accounting" className="bg-navy-900">Accounting</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-1">Role</label>
                        <select
                            className="input-field bg-navy-900 border-white/10 text-white"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="EMPLOYEE" className="bg-navy-900">Employee</option>
                            <option value="PM" className="bg-navy-900">Project Manager (PM)</option>
                            <option value="ADMIN" className="bg-navy-900">HR / Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="Strong password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex justify-center items-center gap-2 mt-6"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-white/10 pt-6">
                    <p className="text-slate-400 text-sm mb-2">Already have an account?</p>
                    <Link to="/login" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline flex items-center justify-center gap-1 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

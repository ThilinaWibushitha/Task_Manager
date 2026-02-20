import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    LogOut,
    Menu,
    X,
    PieChart,
    ClipboardList
} from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const LinkItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all border border-transparent ${isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
            }
            onClick={() => setIsOpen(false)} // Close mobile menu on click
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </NavLink>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button onClick={toggle} className="md:hidden fixed top-4 right-4 z-50 p-2 bg-navy-900/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg text-white">
                {isOpen ? <X /> : <Menu />}
            </button>
            |
            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 bg-navy-900/40 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-6 h-6">
                                <rect x="16" y="14" width="32" height="40" rx="4" fill="white" opacity="0.95" />
                                <rect x="24" y="10" width="16" height="8" rx="3" fill="white" />
                                <rect x="22" y="26" width="14" height="3" rx="1.5" fill="#e2e8f0" />
                                <path d="M36 25l3 3 5-5" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="22" y="34" width="14" height="3" rx="1.5" fill="#e2e8f0" />
                                <path d="M36 33l3 3 5-5" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-sm leading-tight neon-text">Daily Task<br />Manager</h1>
                            <p className="text-[10px] text-cyan-500/80 font-bold uppercase tracking-widest">{user.role}</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {user.role === 'EMPLOYEE' && (
                            <>
                                <LinkItem to="/employee" icon={LayoutDashboard} label="Dashboard" />
                                <LinkItem to="/employee" icon={CheckSquare} label="My Tasks" />
                            </>
                        )}

                        {user.role === 'PM' && (
                            <>
                                <LinkItem to="/pm" icon={LayoutDashboard} label="Overview" />
                                <LinkItem to="/employee" icon={CheckSquare} label="My Tasks" />
                            </>
                        )}

                        {user.role === 'ADMIN' && (
                            <>
                                <LinkItem to="/admin" icon={LayoutDashboard} label="Overview" />
                                <LinkItem to="/employee" icon={CheckSquare} label="My Tasks" />
                            </>
                        )}
                    </nav>

                    <div className="pt-6 border-t border-white/5">
                        <div className="mb-4 px-4">
                            <p className="text-sm font-medium text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div onClick={toggle} className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-30 md:hidden"></div>
            )}
        </>
    );
}

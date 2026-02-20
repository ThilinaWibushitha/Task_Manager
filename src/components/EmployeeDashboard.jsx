import React, { useState, useEffect } from 'react';
import { api } from '../api/googleSheet';
import TaskForm from './TaskForm';
import TaskTable from './TaskTable';
import StatsCards from './StatsCards';

export default function EmployeeDashboard({ user }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [continueTask, setContinueTask] = useState(null);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        const data = await api.getTasks(user.id, 'EMPLOYEE'); // Pass ID, not object
        setTasks(data);
        setLoading(false);
    };

    const handleAddTask = async (taskData) => {
        await api.addTask(taskData);
        setContinueTask(null); // Clear after submission
        await loadData();
    };

    const handleContinueTask = (task) => {
        setContinueTask(task);
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteTask = async (task) => {
        if (!confirm(`Delete this task? This cannot be undone.`)) return;
        const res = await api.deleteTask(task.rowIndex, user.id);
        if (res.status === 'success') {
            await loadData();
        } else {
            alert('Error: ' + res.message);
        }
    };

    // Derived stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.signature !== 'Pending').length,
        pending: tasks.filter(t => t.signature === 'Pending').length,
        unapproved: tasks.filter(t => t.signature === 'Pending').length
    };

    // Filter tasks for tabs
    const filteredTasks = activeTab === 'pending'
        ? tasks.filter(t => t.signature === 'Pending' || t.pending)
        : tasks.filter(t => t.signature !== 'Pending' && !t.pending);

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 neon-text">
                    Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{user.name}</span> 👋
                </h1>
                <p className="text-slate-400 font-light">Here is your daily activity overview</p>
            </header>

            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Task Entry */}
                <div className="lg:col-span-1">
                    <TaskForm
                        onSubmit={handleAddTask}
                        empId={user.id}
                        userName={user.name}
                        linkedTask={continueTask}
                    />
                </div>

                {/* Right Column: Task List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${activeTab === 'pending' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                Pending / Unapproved
                                {activeTab === 'pending' && <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded-full"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                My History (Approved)
                                {activeTab === 'history' && <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded-full"></div>}
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-slate-400 text-sm">Syncing...</p>
                            </div>
                        ) : (
                            <TaskTable
                                tasks={filteredTasks}
                                allTasks={tasks}
                                role="EMPLOYEE"
                                onApprove={handleContinueTask}
                                onDelete={handleDeleteTask}
                                currentUserId={user.id}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api/googleSheet';
import TaskTable from './TaskTable';
import StatsCards from './StatsCards';
import TaskForm from './TaskForm';
import { Search } from 'lucide-react';

export default function PMDashboard({ user }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // overview, my-tasks

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        // PM sees all tasks. Backend 'getAll' with role='PM' should return all.
        const data = await api.getTasks(user.id, 'PM');
        setTasks(data);
        setLoading(false);
    };

    const handleApprove = async (task) => {
        if (!confirm(`Approve task for ${task.name}?`)) return;

        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.rowIndex === task.rowIndex ? { ...t, signature: user.name } : t
        ));

        const res = await api.approveTask(task.rowIndex, user.name, user.name);
        if (res.status !== 'success') {
            alert('Error approving task: ' + res.message);
            loadData(); // Revert on error
        }
    };

    const handleAddTask = async (taskData) => {
        await api.addTask(taskData);
        await loadData();
        setActiveTab('overview');
    };

    // Derived Stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.signature !== 'Pending').length,
        pending: tasks.filter(t => t.signature === 'Pending').length,
        unapproved: tasks.filter(t => t.signature === 'Pending').length
    };

    // Filter Logic
    const filteredTasks = useMemo(() => {
        if (activeTab === 'my-tasks') {
            return tasks.filter(t => String(t.empId) === String(user.id));
        }

        if (!filterQuery) return tasks;

        const lowerQ = filterQuery.toLowerCase();
        return tasks.filter(t =>
            t.name.toLowerCase().includes(lowerQ) ||
            t.project.toLowerCase().includes(lowerQ)
        );
    }, [tasks, filterQuery, activeTab, user.id]);

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 neon-text">Project Manager</h1>
                    <p className="text-slate-400 font-light">Team Performance & Approvals</p>
                </div>
                <div className="flex bg-navy-900/50 rounded-xl p-1.5 shadow-sm border border-white/5">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('my-tasks')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'my-tasks' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        My Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('new-task')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'new-task' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        Create Report
                    </button>
                </div>
            </header>

            <StatsCards stats={stats} />

            {activeTab === 'new-task' ? (
                <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                    <TaskForm onSubmit={handleAddTask} empId={user.id} userName={user.name} isPM={true} />
                </div>
            ) : (
                <div className="glass-card">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {activeTab === 'my-tasks' ? 'My Activity History' : 'Team Activity Log'}
                        </h2>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/60" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="input-field pl-10 w-full"
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-400">Loading tasks...</p>
                        </div>
                    ) : (
                        <TaskTable tasks={filteredTasks} allTasks={tasks} role="PM" onApprove={handleApprove} />
                    )}
                </div>
            )}
        </div>
    );
}

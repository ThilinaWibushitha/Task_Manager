import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api/googleSheet';
import TaskTable from './TaskTable';
import StatsCards from './StatsCards';
import PerformanceChart from './PerformanceChart';
import TaskForm from './TaskForm';
import { Search, Plus, UserPlus, X } from 'lucide-react';

export default function AdminDashboard({ user }) {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, unapproved: 0, byEmployee: [] });
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    const [showAddEmp, setShowAddEmp] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);

    // Add Employee Form State
    const [newEmp, setNewEmp] = useState({ id: '', name: '', email: '', password: '', role: 'EMPLOYEE' });
    const [empLoading, setEmpLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        // Admin gets all tasks and stats
        const [tasksData, statsData] = await Promise.all([
            api.getTasks(user.id, 'ADMIN'),
            api.getStats(user.id, 'ADMIN')
        ]);

        setTasks(tasksData);
        setStats({
            ...statsData,
            unapproved: tasksData.filter(t => t.signature === 'Pending').length
        });
        setLoading(false);
    };

    const handleApprove = async (task) => {
        // Admins can also approve if needed, though usually PMs do.
        if (!confirm(`Approve task for ${task.name} as Admin?`)) return;

        setTasks(prev => prev.map(t =>
            t.rowIndex === task.rowIndex ? { ...t, signature: user.name + ' (Admin)' } : t
        ));

        await api.approveTask(task.rowIndex, user.name + ' (Admin)', user.name);
        // refresh in bg
        loadData();
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setEmpLoading(true);
        const res = await api.addEmployee(newEmp);
        setEmpLoading(false);
        if (res.status === 'success') {
            alert('Employee Added Successfully!');
            setShowAddEmp(false);
            setNewEmp({ id: '', name: '', email: '', password: '', role: 'EMPLOYEE' });
        } else {
            alert('Error: ' + res.message);
        }
    };

    const filteredTasks = useMemo(() => {
        if (!filterQuery) return tasks;
        const lowerQ = filterQuery.toLowerCase();
        return tasks.filter(t =>
            t.name.toLowerCase().includes(lowerQ) ||
            t.project.toLowerCase().includes(lowerQ) ||
            String(t.empId).toLowerCase().includes(lowerQ)
        );
    }, [tasks, filterQuery]);

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                    <p className="text-slate-400">System Overview & Analytics</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddEmp(true)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg shadow-cyan-900/20"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Employee
                    </button>
                    <button
                        onClick={loadData}
                        className="bg-navy-800 border border-white/10 text-slate-300 hover:bg-navy-700 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        Refresh Data
                    </button>
                </div>
            </header>

            <StatsCards stats={stats} />

            <PerformanceChart stats={stats} />

            <div className="mb-8">
                <div className="bg-navy-900 rounded-lg p-1 shadow-sm border border-white/10 w-fit mb-4">
                    <button
                        onClick={() => setShowTaskForm(!showTaskForm)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${showTaskForm ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {showTaskForm ? 'Hide Task Form' : 'Submit Admin Task'}
                    </button>
                </div>

                {showTaskForm && (
                    <div className="max-w-2xl">
                        <TaskForm
                            onSubmit={async (data) => {
                                await api.addTask(data);
                                loadData();
                                setShowTaskForm(false);
                            }}
                            empId={user.id}
                            userName={user.name}
                            isPM={true} // Admin can self-approve theoretically, but logic handles it
                        />
                    </div>
                )}
            </div>

            <div className="glass-card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-200">Audit Log & Tasks</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                        <input
                            type="text"
                            placeholder="Search employee, project..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-navy-900 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 w-64 placeholder:text-slate-500"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading system data...</p>
                    </div>
                ) : (
                    <TaskTable tasks={filteredTasks} allTasks={tasks} isAdmin={true} role="ADMIN" onApprove={handleApprove} />
                )}
            </div>

            {/* Add Employee Modal */}
            {showAddEmp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="glass-card p-6 w-full max-w-md relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Register New User</h3>
                            <button onClick={() => setShowAddEmp(false)} className="text-slate-400 hover:text-red-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-cyan-100 mb-1">Employee ID</label>
                                <input required className="input-field bg-navy-900 border-white/10 text-white" value={newEmp.id} onChange={e => setNewEmp({ ...newEmp, id: e.target.value })} placeholder="e.g. 102" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cyan-100 mb-1">Full Name</label>
                                <input required className="input-field bg-navy-900 border-white/10 text-white" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} placeholder="e.g. Jane Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cyan-100 mb-1">Email</label>
                                <input type="email" required className="input-field bg-navy-900 border-white/10 text-white" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} placeholder="jane@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cyan-100 mb-1">Password</label>
                                <input type="text" required className="input-field bg-navy-900 border-white/10 text-white" value={newEmp.password} onChange={e => setNewEmp({ ...newEmp, password: e.target.value })} placeholder="Temporary Password" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cyan-100 mb-1">Role</label>
                                <select className="input-field bg-navy-900 border-white/10 text-white" value={newEmp.role} onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}>
                                    <option value="EMPLOYEE" className="bg-navy-900">Employee</option>
                                    <option value="PM" className="bg-navy-900">Project Manager</option>
                                    <option value="ADMIN" className="bg-navy-900">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cyan-100 mb-1">Department</label>
                                <select
                                    className="input-field bg-navy-900 border-white/10 text-white"
                                    value={newEmp.dept || 'DevOps'}
                                    onChange={e => setNewEmp({ ...newEmp, dept: e.target.value })}
                                >
                                    <option value="DevOps" className="bg-navy-900">DevOps</option>
                                    <option value="TecOps" className="bg-navy-900">TecOps</option>
                                    <option value="Accounting" className="bg-navy-900">Accounting</option>
                                </select>
                            </div>
                            <button type="submit" disabled={empLoading} className="btn-primary mt-4 w-full">
                                {empLoading ? 'Saving...' : 'Register User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

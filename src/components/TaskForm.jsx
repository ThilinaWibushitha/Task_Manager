import React, { useState, useEffect } from 'react';
import { PlusCircle, Send, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { api } from '../api/googleSheet';

export default function TaskForm({ onSubmit, empId, userName, isPM, linkedTask }) {
    const [formData, setFormData] = useState({
        name: userName || '',
        project: '',
        deadline: '',
        assigned: '',
        completed: '',
        pending: '',
        timeSpent: '',
        hours: '',
        minutes: '',
        isSelfAuth: false,
        status: 'Completed' // Default status
    });
    const [loading, setLoading] = useState(false);
    const [pendingTasks, setPendingTasks] = useState([]);

    useEffect(() => {
        if (userName) setFormData(prev => ({ ...prev, name: userName }));
        loadPendingTasks();
    }, [userName, empId]);

    // React to linked task from parent (Dashboard click)
    useEffect(() => {
        if (linkedTask) {
            setFormData(prev => ({
                ...prev,
                project: linkedTask.project,
                assigned: `Continued: ${linkedTask.name} - ${linkedTask.pending}`, // Auto-fill description
                status: 'Completed'
            }));
        }
    }, [linkedTask]);

    const loadPendingTasks = async () => {
        if (!empId) return;
        try {
            const tasks = await api.getTasks(empId, 'EMPLOYEE');
            // Filter tasks that have something in 'pending' column (meaning they were pending)
            // And maybe we want to filter out those that are "old"? For now, just show all pending.
            const pending = tasks.filter(t => t.pending && t.pending.trim() !== '');
            setPendingTasks(pending);
        } catch (error) {
            console.error("Failed to load pending tasks", error);
        }
    };

    const handlePendingSelect = (e) => {
        const taskId = e.target.value;
        if (!taskId) return;

        const task = pendingTasks.find(t => String(t.rowIndex) === String(taskId));
        if (task) {
            setFormData(prev => ({
                ...prev,
                project: task.project,
                assigned: `Continued: ${task.name} - ${task.pending}`, // Auto-fill description
                status: 'Completed' // Default to completing it? Or let user choose.
            }));
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // If PM self-auth, we might append a signature immediately in the backend, or handle it here.
        // The backend 'addTask' doesn't currently accept a signature. 
        // We might need to handle this. For now, let's just submit the task standard way. 
        // If self-auth is true, the PM can just go and approve it in their dashboard, or we can update backend to accept it.
        // Given backend limitation, let's keep it simple: PM submits -> then approves. 
        // OR better: if isPM, we can call 'approveTask' right after 'addTask' if we had the ROI. 
        // Actually, let's just let PM submit and then they can approve it in their lists 
        // (or we can add 'signature' to saveTask if we modify backend).
        // Let's modify backend later if needed. For now, normal submit.

        // Map Status to backend fields
        const submissionData = {
            ...formData,
            empId,
            linkedTaskId: linkedTask ? linkedTask.rowIndex : null, // Send linked ID
            date: new Date().toISOString(),
            // If Completed, 'pending' is empty. If Pending, 'pending' has the reason. 
            // We can set 'completed' to 'Completed' string or leave empty if status is 'Pending'.
            completed: formData.status === 'Completed' ? 'Completed' : '',
            pending: formData.status === 'Pending' ? formData.pending : '',
            timeSpent: (parseFloat(formData.hours || 0) + parseFloat(formData.minutes || 0) / 60).toFixed(2)
        };

        await onSubmit(submissionData);
        setLoading(false);
        // Reset form but keep name
        setFormData({
            name: userName,
            project: '',
            deadline: '',
            assigned: '',
            completed: '',
            pending: '',
            hours: '',
            minutes: '',
            timeSpent: '',
            isSelfAuth: false
        });
    };

    return (
        <div className="glass-card mb-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-6 text-cyan-400">
                <PlusCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">New Daily Report</h2>
            </div>

            {pendingTasks.length > 0 && (
                <div className="mb-6 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                    <label className="block text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> Continue a Pending Task
                    </label>
                    <select className="input-field border-amber-500/30 focus:border-amber-400 focus:ring-amber-500/20" onChange={handlePendingSelect}>
                        <option value="">-- Select a pending task to continue --</option>
                        {pendingTasks.map(t => (
                            <option key={t.rowIndex} value={t.rowIndex} className="bg-navy-900 text-slate-200">
                                {t.date} - {t.project} ({t.pending})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Employee Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field opacity-60 cursor-not-allowed"
                            placeholder="Your Name"
                            readOnly // Auto-filled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Project</label>
                        <input name="project" value={formData.project} onChange={handleChange} required className="input-field" placeholder="e.g. Mobile App" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Deadline</label>
                        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="input-field [color-scheme:dark]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Time Spent</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input type="number" min="0" name="hours" value={formData.hours} onChange={handleChange} className="input-field pr-12" placeholder="Hrs" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">hrs</span>
                            </div>
                            <div className="relative flex-1">
                                <input type="number" min="0" max="59" name="minutes" value={formData.minutes} onChange={handleChange} className="input-field pr-12" placeholder="Min" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">min</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Task Name & Description</label>
                    <textarea name="assigned" value={formData.assigned} onChange={handleChange} className="input-field min-h-[80px] py-3" placeholder="Enter task name and description..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status || 'Completed'}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="input-field bg-navy-900/50"
                        >
                            <option value="Completed" className="bg-navy-900">Completed</option>
                            <option value="Pending" className="bg-navy-900">Pending</option>
                        </select>
                    </div>

                    {formData.status === 'Pending' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Reason for Pending</label>
                            <textarea
                                name="pending"
                                value={formData.pending}
                                onChange={handleChange}
                                className="input-field min-h-[80px] py-3"
                                placeholder="Why is this task pending?"
                                required
                            />
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-4">
                    {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Report</>}
                </button>
            </form>
        </div>
    );
}

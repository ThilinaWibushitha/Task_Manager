import React from 'react';
import { Calendar, User, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronRight, History, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function TaskTable({ tasks, allTasks = [], isAdmin, role, onApprove, onDelete, currentUserId }) {
    const [expandedRows, setExpandedRows] = useState(new Set());

    const isPMOrAdmin = isAdmin || role === 'PM' || role === 'ADMIN';
    const showApprovalColumn = true; // Always show actions column
    const showEmployeeColumn = isPMOrAdmin;

    const toggleRow = (taskId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedRows(newExpanded);
    };

    const formatTime = (decimalHours) => {
        const totalMinutes = Math.round(parseFloat(decimalHours || 0) * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        if (h === 0 && m === 0) return '';
        if (h === 0) return `${m}m`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    };

    if (!tasks.length) {
        return (
            <div className="text-center py-10 text-slate-400">
                <p>No records found.</p>
            </div>
        );
    }

    const lookupList = allTasks.length > 0 ? allTasks : tasks;
    const parentIds = new Set(lookupList.filter(t => t.parentId).map(t => t.parentId));
    const visibleTasks = tasks.filter(t => !parentIds.has(t.rowIndex));

    // Status badge helper
    const getStatusBadge = (signature) => {
        if (!signature || signature === 'Pending') {
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                    <AlertCircle className="w-3 h-3" /> Pending
                </span>
            );
        }
        if (signature === 'Resolved') {
            return (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(96,165,250,0.2)]">
                    <CheckCircle className="w-3 h-3" /> Resolved
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                <CheckCircle className="w-3 h-3" /> Approved
            </span>
        );
    };

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-cyan-200/70 text-sm uppercase tracking-wider font-display">
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Project</th>
                            {showEmployeeColumn && <th className="p-4 font-semibold">Employee</th>}
                            <th className="p-4 font-semibold">Tasks / Activities</th>
                            <th className="p-4 font-semibold">Time</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {visibleTasks.map((task, i) => {
                            const history = [];
                            let currentParentId = task.parentId;
                            while (currentParentId) {
                                const parent = lookupList.find(t => t.rowIndex === currentParentId);
                                if (parent) {
                                    history.push(parent);
                                    currentParentId = parent.parentId;
                                } else {
                                    break;
                                }
                            }

                            const hasHistory = history.length > 0;
                            const isExpanded = expandedRows.has(task.rowIndex);

                            const allChainTasks = [task, ...history];
                            const allApproved = allChainTasks.every(t => t.signature && t.signature !== 'Pending');
                            const aggregateStatus = allApproved ? 'Approved' : 'Pending';

                            const getTime = (t) => parseFloat(t?.timeSpent) || 0;
                            const currentTime = getTime(task);
                            const historyTime = history.reduce((acc, t) => acc + getTime(t), 0);
                            const totalTime = currentTime + historyTime;

                            // Check if current user owns this task
                            const isOwner = currentUserId && String(task.empId) === String(currentUserId);

                            return (
                                <React.Fragment key={task.rowIndex || i}>
                                    <tr
                                        className={`transition-colors border-b border-white/5 group ${hasHistory ? 'cursor-pointer hover:bg-cyan-500/5' : 'hover:bg-white/5'}`}
                                        onClick={() => hasHistory && toggleRow(task.rowIndex)}
                                    >
                                        <td className="p-4 align-top whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {hasHistory && (
                                                    <div className="text-cyan-400">
                                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </div>
                                                )}
                                                <Calendar className="w-4 h-4 text-cyan-500/70" />
                                                <span className="text-sm font-medium text-slate-200">{task.date && new Date(task.date).toLocaleDateString()}</span>
                                            </div>
                                            {task.deadline && (
                                                <div className="text-[10px] text-slate-500 mt-1 ml-6 uppercase tracking-wider">
                                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className="bg-cyan-500/10 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-cyan-500/20 uppercase tracking-widest">
                                                {task.project}
                                            </span>
                                        </td>
                                        {showEmployeeColumn && (
                                            <td className="p-4 align-top">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-navy-800 border border-white/10 flex items-center justify-center text-slate-400">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-200 text-sm">{task.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-mono">ID: {task.empId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="p-4 align-top">
                                            {task.assigned && task.assigned.startsWith('Continued:') ? (
                                                <div className="space-y-2">
                                                    <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                                                        <History className="w-3 h-3" />
                                                        Final Task
                                                    </div>
                                                    <div className="bg-navy-950/50 border border-white/5 rounded-lg p-2.5 text-sm text-slate-300 font-light leading-relaxed">
                                                        {task.assigned.replace('Continued:', '').trim()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-slate-300 whitespace-pre-wrap font-light leading-relaxed">{task.assigned}</div>
                                            )}
                                            {task.completed && (
                                                <div className="text-[11px] text-emerald-400/80 flex items-start gap-1 mt-2 font-medium">
                                                    <CheckCircle className="w-3 h-3 mt-0.5" /> {task.completed}
                                                </div>
                                            )}
                                            {task.pending && (
                                                <div className="text-[11px] text-amber-400/80 flex items-start gap-1 mt-1 font-medium italic">
                                                    <AlertCircle className="w-3 h-3 mt-0.5" /> {task.pending}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-top whitespace-nowrap">
                                            <div className="flex flex-col gap-2">
                                                {task.timeSpent && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5 w-fit">
                                                        <Clock className="w-3 h-3" /> {formatTime(task.timeSpent)}
                                                    </div>
                                                )}
                                                {hasHistory && historyTime > 0 && (
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20 w-fit shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                                        Total: {formatTime(totalTime)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5">
                                                {getStatusBadge(task.signature)}
                                                {hasHistory && (
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-tighter shadow-sm ${aggregateStatus === 'Approved'
                                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                                        }`}>
                                                        {aggregateStatus === 'Approved' ? '✓ All Approved' : '⏳ Chain Pending'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                {isPMOrAdmin && task.signature === 'Pending' && onApprove && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onApprove(task); }}
                                                        className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] active:scale-95"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {role === 'EMPLOYEE' && task.pending && onApprove && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onApprove(task); }}
                                                        className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] active:scale-95"
                                                    >
                                                        Continue
                                                    </button>
                                                )}
                                                {isOwner && onDelete && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                                                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border border-red-500/20 active:scale-95"
                                                        title="Delete task"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Sub-row for Parent Task History */}
                                    {hasHistory && isExpanded && (
                                        <tr className="bg-navy-950/50 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <td colSpan={10} className="p-0">
                                                <div className="p-4 pl-12 border-b border-white/5">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <History className="w-4 h-4" />
                                                        Task History ({history.length} previous items)
                                                    </div>

                                                    <div className="space-y-3 relative">
                                                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/10"></div>
                                                        {history.map((histTask, idx) => (
                                                            <div key={idx} className="relative pl-10">
                                                                <div className={`absolute left-[13px] top-3 w-2 h-2 rounded-full border-2 border-navy-900 ${histTask.signature && histTask.signature !== 'Pending' ? 'bg-emerald-400' : 'bg-amber-400'
                                                                    }`}></div>
                                                                <div className="bg-navy-900 border border-white/10 rounded-lg p-3 shadow-sm">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                                                                {histTask.date && new Date(histTask.date).toLocaleDateString()}
                                                                            </span>
                                                                            {histTask.project && (
                                                                                <span className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                                                                                    {histTask.project}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            {histTask.timeSpent && (
                                                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                                    <Clock className="w-3 h-3" /> {formatTime(histTask.timeSpent)}
                                                                                </span>
                                                                            )}
                                                                            {getStatusBadge(histTask.signature)}
                                                                        </div>
                                                                    </div>
                                                                    {histTask.assigned && (
                                                                        <div className="text-sm text-slate-300 mb-1">
                                                                            {histTask.assigned.replace('Continued:', '').trim()}
                                                                        </div>
                                                                    )}
                                                                    {histTask.pending && (
                                                                        <div className="text-sm text-amber-700 font-medium mb-1">
                                                                            Pending Reason: {histTask.pending}
                                                                        </div>
                                                                    )}
                                                                    {histTask.completed && (
                                                                        <div className="text-xs text-emerald-400 flex items-center gap-1">
                                                                            <CheckCircle className="w-3 h-3" /> {histTask.completed}
                                                                        </div>
                                                                    )}
                                                                    {showEmployeeColumn && histTask.name && (
                                                                        <div className="text-xs text-slate-400 mt-1">
                                                                            By: {histTask.name}
                                                                        </div>
                                                                    )}
                                                                    {/* Sub-task Approve Button */}
                                                                    {isPMOrAdmin && histTask.signature === 'Pending' && onApprove && (
                                                                        <div className="mt-2 flex justify-end">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); onApprove(histTask); }}
                                                                                className="bg-teal-50 text-teal-600 hover:bg-teal-100 px-3 py-1 rounded-md text-xs font-medium transition-colors border border-teal-200"
                                                                            >
                                                                                ✓ Approve Sub-task
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

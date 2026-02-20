import React from 'react';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

export default function StatsCards({ stats }) {
    const Card = ({ title, value, icon: Icon, color, bg }) => (
        <div className="glass-card flex items-center justify-between group hover:border-cyan-500/30 transition-all duration-300">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bg} ${color} shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
                title="Total Tasks"
                value={stats.total}
                icon={FileText}
                color="text-cyan-400"
                bg="bg-cyan-500/10 border border-cyan-500/20"
            />
            <Card
                title="Completed"
                value={stats.completed}
                icon={CheckCircle}
                color="text-emerald-400"
                bg="bg-emerald-500/10 border border-emerald-500/20"
            />
            <Card
                title="Pending"
                value={stats.pending}
                icon={Clock}
                color="text-amber-400"
                bg="bg-amber-500/10 border border-amber-500/20"
            />
            {/* Optional unapproved stat if available */}
            <Card
                title="Unapproved"
                value={stats.unapproved || 0}
                icon={AlertCircle}
                color="text-rose-400"
                bg="bg-rose-500/10 border border-rose-500/20"
            />
        </div>
    );
}

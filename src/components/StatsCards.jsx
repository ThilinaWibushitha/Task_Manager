import React from 'react';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

export default function StatsCards({ stats }) {
    const Card = ({ title, value, icon: Icon, color, bg }) => (
        <div className="glass-card flex items-center justify-between group hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
            <div className="relative z-10">
                <p className="text-slate-500 text-[10px] font-bold mb-1 uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display tracking-tight">{value}</h3>
            </div>
            <div className={`relative z-10 p-3 rounded-2xl ${bg} ${color} shadow-lg backdrop-blur-md group-hover:scale-110 transition-transform duration-300`}>
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

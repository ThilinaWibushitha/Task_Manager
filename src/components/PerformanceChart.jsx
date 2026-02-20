import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function PerformanceChart({ stats }) {
    if (!stats || !stats.byEmployee || !stats.byEmployee.length) {
        return <div className="p-8 text-center text-slate-400">No performance data available.</div>;
    }

    const data = stats.byEmployee;

    // Colors for Pie Chart - Futuristic Neon Palette
    const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="glass-card">
                <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Activity Matrix <span className="text-cyan-400 text-xs font-normal tracking-widest uppercase ml-2 opacity-60">Tasks / Employee</span></h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-5} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', color: '#f1f5f9' }}
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            />
                            <Bar dataKey="tasks" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Tasks" />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card">
                <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Temporal Flux <span className="text-cyan-400 text-xs font-normal tracking-widest uppercase ml-2 opacity-60">Hours Distribution</span></h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                innerRadius={60}
                                stroke="rgba(15, 23, 42, 0.5)"
                                strokeWidth={4}
                                fill="#8884d8"
                                dataKey="time"
                                nameKey="name"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

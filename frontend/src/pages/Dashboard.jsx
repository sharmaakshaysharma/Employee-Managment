import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Building, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../lib/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_employees: 0,
        present_today: 0,
        departments: 0,
        weekly_data: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/dashboard/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching dashboard stats', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Employees',
            value: loading ? '...' : stats.total_employees,
            icon: <Users size={22} className="text-indigo-600" />,
            bg: 'bg-indigo-100',
        },
        {
            title: 'Present Today',
            value: loading ? '...' : stats.present_today,
            icon: <TrendingUp size={22} className="text-emerald-600" />,
            bg: 'bg-emerald-100',
        },
        {
            title: 'Departments',
            value: loading ? '...' : stats.departments,
            icon: <Building size={22} className="text-blue-600" />,
            bg: 'bg-blue-100',
        },
        {
            title: 'Absent Today',
            value: loading ? '...' : (stats.total_employees - stats.present_today),
            icon: <UserPlus size={22} className="text-rose-600" />,
            bg: 'bg-rose-100',
        },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
                    <p className="font-semibold text-slate-700 mb-1">{label}</p>
                    {payload.map((entry) => (
                        <p key={entry.name} style={{ color: entry.color }}>
                            {entry.name}: <span className="font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome back. Here's your workforce summary.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="glass-card rounded-2xl p-5 flex items-start justify-between animate-slide-up"
                        style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{card.value}</h3>
                        </div>
                        <div className={`p-2.5 rounded-xl ${card.bg} flex-shrink-0`}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts + Recent Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Weekly Attendance Chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Weekly Attendance</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Last 7 days overview</p>
                        </div>
                        <span className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                            This Week
                        </span>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                            Loading chart...
                        </div>
                    ) : stats.weekly_data.length === 0 || stats.weekly_data.every(d => d.present === 0 && d.absent === 0) ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                            <TrendingUp size={40} className="opacity-20 mb-3" />
                            <p className="text-sm">Mark attendance to see chart data</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.weekly_data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(val) => <span className="text-xs font-medium text-slate-600 capitalize">{val}</span>}
                                />
                                <Bar dataKey="present" name="Present" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="absent" name="Absent" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Today's Summary Card */}
                <div className="glass-card rounded-2xl p-6 flex flex-col">
                    <h3 className="text-base font-bold text-slate-800 mb-4">Today's Summary</h3>

                    {/* Donut-style progress bar */}
                    {!loading && stats.total_employees > 0 && (
                        <div className="mb-5">
                            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                <span>Attendance Rate</span>
                                <span className="font-semibold text-slate-700">
                                    {Math.round((stats.present_today / stats.total_employees) * 100)}%
                                </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700"
                                    style={{ width: `${(stats.present_today / stats.total_employees) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mt-2 flex-1">
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-sm font-medium text-slate-700">Present</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-600">{loading ? '...' : stats.present_today}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                <span className="text-sm font-medium text-slate-700">Absent</span>
                            </div>
                            <span className="text-lg font-bold text-rose-500">
                                {loading ? '...' : Math.max(0, stats.total_employees - stats.present_today)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                                <span className="text-sm font-medium text-slate-700">Total</span>
                            </div>
                            <span className="text-lg font-bold text-slate-700">{loading ? '...' : stats.total_employees}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Calendar, LayoutDashboard, Building2 } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-indigo-500 p-2 rounded-lg">
                    <Building2 size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">HRMS Lite</h1>
            </div>

            <div className="mt-8 flex flex-col gap-2 px-4">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                </NavLink>

                <NavLink
                    to="/employees"
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <Users size={20} />
                    <span className="font-medium">Directory</span>
                </NavLink>

                <NavLink
                    to="/attendance"
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <Calendar size={20} />
                    <span className="font-medium">Attendance</span>
                </NavLink>
            </div>

            <div className="mt-auto p-6">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-sm font-medium text-slate-300">Admin Portal</p>
                    <p className="text-xs text-slate-500 mt-1">Version 1.0.0</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

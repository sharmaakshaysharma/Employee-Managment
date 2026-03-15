import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-200/50 blur-3xl pointer-events-none"></div>
                <div className="absolute top-40 left-10 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;

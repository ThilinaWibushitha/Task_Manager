import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ user, onLogout }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar user={user} onLogout={onLogout} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
                <Outlet />
            </main>
        </div>
    );
}

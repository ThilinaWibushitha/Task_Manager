import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ user, onLogout }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} onLogout={onLogout} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative z-10">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

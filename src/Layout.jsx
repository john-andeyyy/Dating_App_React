import React from 'react'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router'

export default function Layout() {
    return (
        <div className="flex h-screen overflow-hidden z-50">
            <aside className='flex '>
                <Sidebar />
            </aside>
            <main className="flex-grow  p-2 rounded-xl ">
                <Outlet />
            </main>

        </div>
    )
}

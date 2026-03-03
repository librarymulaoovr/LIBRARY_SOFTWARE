"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, BookOpen, Users, LayoutDashboard,
    CheckSquare, FileBox, Database, Settings, LogOut, Heart, Menu, X, ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Navigation() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setUserRole(localStorage.getItem('userRole'));
    }, [pathname]);

    // Close mobile menu when navigating
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Hide navigation on public/auth routes
    if (!isMounted || ['/', '/login', '/member-login'].includes(pathname)) return null;

    // Determine roles
    const isMember = userRole === 'member';
    const isLibrarian = userRole === 'librarian';
    const isGuest = !userRole;

    const allNavItems = [
        { href: '/', label: 'Home', icon: Home, restrict: 'both' },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, restrict: 'librarian' },
        { href: '/member/dashboard-mem', label: 'My Dashboard', icon: Heart, restrict: 'member' },
        { href: '/catalog', label: 'Catalog', icon: BookOpen, restrict: 'both' },
        { href: '/check', label: 'Check In/Out', icon: CheckSquare, restrict: 'librarian' },
        { href: '/books', label: 'Management', icon: FileBox, restrict: 'librarian' },
        { href: '/members', label: 'Members', icon: Users, restrict: 'librarian' },
        { href: '/history', label: 'Stats', icon: Database, restrict: 'both' },
        { href: '/transactions', label: 'Circulation History', icon: ArrowLeftRight, restrict: 'librarian' },
        { href: '/backup', label: 'Backup', icon: Settings, restrict: 'librarian' },
    ];

    const navItems = allNavItems.filter(item => {
        if (item.restrict === 'both') return true;
        if (isMember) return item.restrict === 'member';
        if (isLibrarian) return item.restrict === 'librarian';
        return false; // Guests only see 'both'
    });

    const portalName = isMember ? "MEMBER PORTAL" : isLibrarian ? "LIBRARIAN PORTAL" : "PMSA LIBRARY";

    return (
        <>
            {/* Mobile Header / Toggle */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 fixed top-0 w-full z-50">
                <span className="font-bold tracking-wider text-black">
                    {portalName}
                </span>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 border rounded-md hover:bg-gray-50"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Main Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex min-h-screen",
                isMobileOpen ? "translate-x-0 flex" : "-translate-x-full hidden md:flex"
            )}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
                    <span className="font-bold text-lg tracking-wider text-black hidden md:block">
                        {portalName}
                    </span>
                    <span className="font-bold text-lg tracking-wider text-black md:hidden">MENU</span>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-1 hover:bg-gray-100 rounded-md"
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex-1 py-4 flex flex-col gap-1 px-3 mt-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm",
                                    isActive
                                        ? "bg-yellow-400 text-black shadow-sm"
                                        : "text-gray-600 hover:bg-yellow-50 hover:text-black"
                                )}
                            >
                                <Icon size={20} className={isActive ? "text-black" : "text-gray-500"} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                {userRole && (
                    <div className="p-4 border-t border-gray-200">
                        <Link href="/" onClick={() => localStorage.removeItem('userRole')}>
                            <button className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium text-sm">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}

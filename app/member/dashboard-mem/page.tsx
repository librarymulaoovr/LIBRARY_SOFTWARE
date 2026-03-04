"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, History, BookmarkCheck } from "lucide-react";
import { getMemberDashboardStats } from "@/lib/supabase/actions";
import { useRouter } from "next/navigation";

export default function MemberDashboardPage() {
    const router = useRouter();
    const [memberName, setMemberName] = useState<string>("MEMBER");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRead: 0,
        currentlyBorrowed: 0,
        returnedHistory: 0,
        dueThisWeek: 0
    });
    const [activeBorrows, setActiveBorrows] = useState<any[]>([]);
    const [returnedBooks, setReturnedBooks] = useState<any[]>([]);
    const [allBooks, setAllBooks] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState<"read" | "borrowed" | "returned" | null>(null);

    useEffect(() => {
        const barcode = localStorage.getItem('memberBarcode');
        const name = localStorage.getItem('memberName');

        if (!barcode) {
            router.push('/member-login');
            return;
        }

        if (name) setMemberName(name);

        async function fetchDashboard() {
            setLoading(true);
            const res = await getMemberDashboardStats(barcode as string);
            if (res.success && res.stats) {
                setStats(res.stats);
                if (res.activeBorrows) setActiveBorrows(res.activeBorrows);
                if (res.returnedBooks) setReturnedBooks(res.returnedBooks);
                if (res.allBooks) setAllBooks(res.allBooks);
            }
            setLoading(false);
        }

        fetchDashboard();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-20"><span className="text-gray-500 font-bold uppercase tracking-widest text-xl">Loading Dashboard...</span></div>;
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-8 pt-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">WELCOME BACK, {memberName.toUpperCase()}</h1>
                <p className="text-gray-500 mt-1">Here is a summary of your library activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Total Books Read */}
                <Card className="border-t-4 border-t-yellow-400">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Total Books Read</CardTitle>
                        <button onClick={() => setOpenModal("read")} className="p-1 hover:bg-yellow-50 rounded-full transition-colors" title="View Details">
                            <BookOpen size={18} className="text-yellow-500" />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.totalRead}</div>
                    </CardContent>
                </Card>

                {/* Currently Borrowed */}
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Currently Borrowed</CardTitle>
                        <button onClick={() => setOpenModal("borrowed")} className="p-1 hover:bg-blue-50 rounded-full transition-colors" title="View Details">
                            <BookmarkCheck size={18} className="text-blue-500" />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.currentlyBorrowed}</div>
                        <p className={`text-xs mt-1 ${stats.dueThisWeek > 0 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                            {stats.dueThisWeek} due this week
                        </p>
                    </CardContent>
                </Card>

                {/* Returned History */}
                <Card className="border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Returned History</CardTitle>
                        <button onClick={() => setOpenModal("returned")} className="p-1 hover:bg-green-50 rounded-full transition-colors" title="View Details">
                            <History size={18} className="text-green-500" />
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.returnedHistory}</div>
                    </CardContent>
                </Card>

            </div>

            <div className="mt-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>CURRENTLY BORROWED</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeBorrows.length > 0 ? (
                            activeBorrows.map((borrow) => {
                                const isDueSoon = borrow.daysUntilDue <= 7 && borrow.daysUntilDue >= 0;
                                const isOverdue = borrow.daysUntilDue < 0;

                                return (
                                    <div key={borrow.id} className={`flex justify-between items-center p-4 border rounded-lg bg-gray-50 border-l-4 ${isOverdue ? 'border-l-red-600' : isDueSoon ? 'border-l-yellow-400' : 'border-l-green-500'}`}>
                                        <div>
                                            <h3 className="font-bold">{borrow.books?.title || "Unknown Book"}</h3>
                                            <p className="text-sm text-gray-500">{borrow.books?.author || "Unknown Author"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-500' : 'text-green-600'}`}>
                                                {isOverdue ? `Overdue by ${Math.abs(borrow.daysUntilDue)} days` : `Due in ${borrow.daysUntilDue} days`}
                                            </p>
                                            <p className="text-xs text-gray-500">Barcode: {borrow.books?.barcode}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                You have no active borrowed books.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modals for Stats Details */}
            <Dialog open={openModal !== null} onOpenChange={(open) => !open && setOpenModal(null)}>
                <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {openModal === "read" && "Total Books Read Details"}
                            {openModal === "borrowed" && "Currently Borrowed Details"}
                            {openModal === "returned" && "Returned History Details"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                        {openModal === "read" && allBooks.length > 0 && allBooks.map((t) => (
                            <div key={t.id} className="p-3 border rounded-lg bg-gray-50 border-l-4 border-l-yellow-400">
                                <h3 className="font-bold">{t.books?.title || "Unknown Book"}</h3>
                                <p className="text-sm text-gray-500">Author: {t.books?.author}</p>
                                <p className="text-xs text-gray-400 mt-1">Borrowed: {new Date(t.borrow_date).toLocaleDateString()} | Status: {t.status}</p>
                            </div>
                        ))}
                        {openModal === "read" && allBooks.length === 0 && <p className="text-gray-500">No books found.</p>}

                        {openModal === "borrowed" && activeBorrows.length > 0 && activeBorrows.map((t) => {
                            const isOverdue = t.daysUntilDue < 0;
                            return (
                                <div key={t.id} className={`p-3 border rounded-lg bg-gray-50 border-l-4 ${isOverdue ? 'border-l-red-600' : 'border-l-blue-500'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold">{t.books?.title || "Unknown Book"}</h3>
                                            <p className="text-sm text-gray-500">Author: {t.books?.author}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                                                {isOverdue ? `Overdue by ${Math.abs(t.daysUntilDue)} days` : `Due in ${t.daysUntilDue} days`}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Borrowed: {new Date(t.borrow_date).toLocaleDateString()}</p>
                                </div>
                            );
                        })}
                        {openModal === "borrowed" && activeBorrows.length === 0 && <p className="text-gray-500">No active borrowed books.</p>}

                        {openModal === "returned" && returnedBooks.length > 0 && returnedBooks.map((t) => (
                            <div key={t.id} className="p-3 border rounded-lg bg-gray-50 border-l-4 border-l-green-500">
                                <h3 className="font-bold">{t.books?.title || "Unknown Book"}</h3>
                                <p className="text-sm text-gray-500">Author: {t.books?.author}</p>
                                <p className="text-xs text-gray-400 mt-1">Returned: {new Date(t.return_date).toLocaleDateString()} (Borrowed: {new Date(t.borrow_date).toLocaleDateString()})</p>
                            </div>
                        ))}
                        {openModal === "returned" && returnedBooks.length === 0 && <p className="text-gray-500">No returned books found.</p>}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

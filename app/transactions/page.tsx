"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllTransactions } from "@/lib/supabase/actions";

export default function CirculationHistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(7);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            const data = await getAllTransactions();
            const formatted = data.map((t: any) => ({
                id: t.id.split('-')[0].toUpperCase(),
                bookTitle: t.books?.title || "Unknown Book",
                barcode: t.books?.barcode || "Unknown",
                memberName: t.members?.full_name || "Unknown Member",
                memberId: t.members?.barcode || "Unknown",
                type: t.status === "Returned" ? "Check In" : "Check Out",
                date: new Date(t.borrow_date).toLocaleDateString(),
                dueDate: new Date(t.due_date).toLocaleDateString(),
                status: t.status === "Borrowed" && new Date(t.due_date) < new Date() ? "Overdue" : t.status
            }));
            setTransactions(formatted);
            setLoading(false);
        }
        fetchHistory();
    }, []);

    // Filter Logic
    const filteredTransactions = transactions.filter((trx) => {
        const matchesSearch =
            trx.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.memberId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "All" || trx.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        // Handle responsive pagination
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile(); // Check on mount
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Effect to update itemsPerPage based on mobile state and total records
    useEffect(() => {
        if (isMobile) {
            // Show all transactions on mobile
            setItemsPerPage(Math.max(1, filteredTransactions.length));
        } else {
            // Default 7 on desktop
            setItemsPerPage(7);
        }
    }, [isMobile, transactions.length, filteredTransactions.length]);

    // Reset to page 1 when search query or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // CSV Download Logic
    const handleDownloadExcel = () => {
        // Define CSV Headers
        const headers = ["Transaction ID", "Book Title", "Barcode", "Member Name", "Member ID", "Type", "Date", "Due Date", "Status"];

        // Map data to CSV rows
        const csvRows = filteredTransactions.map(trx => [
            trx.id,
            `"${trx.bookTitle}"`, // Quote strings that might contain commas
            trx.barcode,
            `"${trx.memberName}"`,
            trx.memberId,
            trx.type,
            trx.date,
            trx.dueDate,
            trx.status
        ].join(','));

        // Combine headers and rows
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvRows].join('\n');

        // Trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Circulation_History_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">CIRCULATION HISTORY</h1>
                    <p className="text-gray-500 mt-1">Track check-ins, check-outs, and current borrwings.</p>
                </div>
                <Button onClick={handleDownloadExcel} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                    <FileSpreadsheet size={18} />
                    Download Excel (CSV)
                </Button>
            </div>

            <Card className="shadow-sm border-t-4 border-t-yellow-400">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Search books, members, barcodes..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Borrowed">Currently Borrowed</SelectItem>
                                <SelectItem value="Returned">Returned</SelectItem>
                                <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-white rounded-md border overflow-hidden">
                        <div className="overflow-x-auto sm:overflow-x-auto max-h-[65vh] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-bold whitespace-nowrap">TRX ID</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap min-w-[200px]">BOOK</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap">MEMBER</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap">TYPE</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap">DATE</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap text-right">STATUS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                                Loading transactions...
                                            </TableCell>
                                        </TableRow>
                                    ) : paginatedTransactions.length > 0 ? (
                                        paginatedTransactions.map((trx) => (
                                            <TableRow key={trx.id}>
                                                <TableCell className="font-mono text-xs text-gray-500 whitespace-nowrap">{trx.id}</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <p className="font-medium">{trx.bookTitle}</p>
                                                    <p className="text-xs text-gray-500">{trx.barcode}</p>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <p className="font-medium">{trx.memberName}</p>
                                                    <p className="text-xs text-gray-500">{trx.memberId}</p>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <Badge variant="outline" className={trx.type === 'Check Out' ? 'border-orange-200 text-orange-700 bg-orange-50' : 'border-blue-200 text-blue-700 bg-blue-50'}>
                                                        {trx.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <p className="text-sm">{trx.date}</p>
                                                    <p className="text-xs text-gray-500">Due: {trx.dueDate}</p>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-right">
                                                    <Badge variant="secondary" className={
                                                        trx.status === 'Borrowed' ? 'bg-yellow-100 text-yellow-800' :
                                                            trx.status === 'Returned' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                    }>
                                                        {trx.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                                No transactions found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                            <div className="text-sm text-center sm:text-left text-gray-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="bg-white border-gray-300"
                                >
                                    <ChevronLeft size={16} className="mr-1" /> Prev
                                </Button>
                                <div className="text-sm font-medium px-2 py-1 bg-white border border-gray-300 rounded-md">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="bg-white border-gray-300"
                                >
                                    Next <ChevronRight size={16} className="ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

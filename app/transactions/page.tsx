"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Search } from "lucide-react";

// Mock Data
const mockTransactions = [
    { id: "TRX-001", bookTitle: "The Alchemist", barcode: "B-1029", memberName: "John Doe", memberId: "M-5001", type: "Check Out", date: "2023-10-25", dueDate: "2023-11-08", status: "Borrowed" },
    { id: "TRX-002", bookTitle: "Introduction to Algorithms", barcode: "B-4402", memberName: "Jane Smith", memberId: "M-5002", type: "Check Out", date: "2023-10-20", dueDate: "2023-11-03", status: "Borrowed" },
    { id: "TRX-003", bookTitle: "The Pragmatic Programmer", barcode: "B-3199", memberName: "Ali Hasan", memberId: "M-5003", type: "Check In", date: "2023-10-28", dueDate: "2023-10-30", status: "Returned" },
    { id: "TRX-004", bookTitle: "Clean Code", barcode: "B-2211", memberName: "John Doe", memberId: "M-5001", type: "Check In", date: "2023-10-15", dueDate: "2023-10-15", status: "Returned" },
    { id: "TRX-005", bookTitle: "Design Patterns", barcode: "B-5533", memberName: "Jane Smith", memberId: "M-5002", type: "Check Out", date: "2023-09-10", dueDate: "2023-09-24", status: "Overdue" },
];

export default function CirculationHistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Filter Logic
    const filteredTransactions = mockTransactions.filter((trx) => {
        const matchesSearch =
            trx.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trx.memberId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "All" || trx.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

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
                    <div className="bg-white rounded-md border min-w-[800px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-bold">TRX ID</TableHead>
                                    <TableHead className="font-bold min-w-[200px]">BOOK</TableHead>
                                    <TableHead className="font-bold">MEMBER</TableHead>
                                    <TableHead className="font-bold">TYPE</TableHead>
                                    <TableHead className="font-bold">DATE</TableHead>
                                    <TableHead className="font-bold">STATUS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((trx) => (
                                        <TableRow key={trx.id}>
                                            <TableCell className="font-mono text-xs text-gray-500">{trx.id}</TableCell>
                                            <TableCell>
                                                <p className="font-medium">{trx.bookTitle}</p>
                                                <p className="text-xs text-gray-500">{trx.barcode}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{trx.memberName}</p>
                                                <p className="text-xs text-gray-500">{trx.memberId}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={trx.type === 'Check Out' ? 'border-orange-200 text-orange-700 bg-orange-50' : 'border-blue-200 text-blue-700 bg-blue-50'}>
                                                    {trx.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">{trx.date}</p>
                                                <p className="text-xs text-gray-500">Due: {trx.dueDate}</p>
                                            </TableCell>
                                            <TableCell>
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
                </CardContent>
            </Card>
        </div>
    );
}

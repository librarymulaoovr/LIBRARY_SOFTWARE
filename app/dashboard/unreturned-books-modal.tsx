"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UnreturnedBooksModalProps {
    loans: any[];
}

export function UnreturnedBooksModal({ loans }: UnreturnedBooksModalProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLoans = loans.filter((loan) => {
        const term = searchTerm.toLowerCase();
        return (
            loan.books?.title?.toLowerCase().includes(term) ||
            loan.books?.author?.toLowerCase().includes(term) ||
            loan.books?.barcode?.toLowerCase().includes(term) ||
            loan.members?.full_name?.toLowerCase().includes(term) ||
            loan.members?.barcode?.toLowerCase().includes(term)
        );
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center h-full min-h-[120px] text-gray-500 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors">
                    <span className="underline hover:text-black font-medium">View All Unreturned Books</span>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Unreturned Books</DialogTitle>
                </DialogHeader>

                <div className="relative w-full max-w-sm my-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search books, authors, members..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <ScrollArea className="flex-1 w-full rounded-md border">
                    <Table>
                        <TableHeader className="bg-gray-50 sticky top-0 z-10">
                            <TableRow>
                                <TableHead className="font-bold">Book Details</TableHead>
                                <TableHead className="font-bold min-w-[120px]">Book Barcode</TableHead>
                                <TableHead className="font-bold">Member Name</TableHead>
                                <TableHead className="font-bold min-w-[140px]">Member Barcode</TableHead>
                                <TableHead className="font-bold text-right">Due Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLoans.length > 0 ? (
                                filteredLoans.map((loan: any) => {
                                    const isOverdue = new Date(loan.due_date) < new Date();
                                    return (
                                        <TableRow key={loan.id}>
                                            <TableCell>
                                                <p className="font-semibold text-sm">{loan.books?.title || 'Unknown Title'}</p>
                                                <p className="text-xs text-gray-500">{loan.books?.author || 'Unknown Author'}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs font-mono">{loan.books?.barcode || 'N/A'}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-sm">{loan.members?.full_name || 'Unknown Member'}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs font-mono">{loan.members?.barcode || 'N/A'}</p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={isOverdue ? "destructive" : "outline"} className={isOverdue ? "" : "bg-orange-50 text-orange-700 border-orange-200"}>
                                                    {new Date(loan.due_date).toLocaleDateString()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        No unreturned books found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <div className="mt-2 text-xs text-gray-500 text-right">
                    Showing {filteredLoans.length} total active loans.
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users } from "lucide-react";

const topReaders = [
    { id: 1, name: 'Ahmad Raza', category: 'Student', count: 42 },
    { id: 2, name: 'Fathima Noor', category: 'Student', count: 38 },
    { id: 3, name: 'Mr. Siddique', category: 'Teacher', count: 35 },
];

const popularBooks = [
    { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', borrows: 156 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', borrows: 142 },
    { id: 3, title: 'Aadujeevitham', author: 'Benyamin', borrows: 138 },
];

export default function HistoryPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">LIBRARY ANALYTICS</h1>
                <p className="text-gray-500 mt-1">Insights into reading habits and popular collections.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Top Readers */}
                <Card className="border-t-4 border-t-yellow-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users size={20} className="text-yellow-500" />
                            TOP READERS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Books</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topReaders.map((reader) => (
                                    <TableRow key={reader.id}>
                                        <TableCell>
                                            <p className="font-medium">{reader.name}</p>
                                            <p className="text-xs text-gray-500">{reader.category}</p>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{reader.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Most Popular Books */}
                <Card className="border-t-4 border-t-yellow-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BookOpen size={20} className="text-yellow-500" />
                            POPULAR BOOKS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="text-right">Borrows</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {popularBooks.map((book) => (
                                    <TableRow key={book.id}>
                                        <TableCell>
                                            <p className="font-medium truncate max-w-[150px]">{book.title}</p>
                                            <p className="text-xs text-gray-500">{book.author}</p>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{book.borrows}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

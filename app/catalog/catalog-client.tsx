"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Edit } from "lucide-react";
import type { Book } from "@/lib/supabase/queries"; // ONLY import types, NOT functions that use next/headers

export default function CatalogClient({ initialBooks }: { initialBooks: Book[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLibrarian, setIsLibrarian] = useState(false);

    useEffect(() => {
        setIsLibrarian(localStorage.getItem('userRole') === 'librarian');
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
        );
    };

    // Filter based on real book data
    const filtered = initialBooks.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">CATALOG</h1>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search by title, author, or ISBN..."
                        className="pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-6">Search</Button>
            </div>

            <div className="bg-white rounded-md border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-bold whitespace-nowrap min-w-[200px]">TITLE</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[150px]">AUTHOR</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[100px]">LANGUAGE</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[120px]">CATEGORY</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[100px]">SHELF</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[120px]">CALL NO.</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[120px]">BARCODE</TableHead>
                                <TableHead className="font-bold whitespace-nowrap">COPIES</TableHead>
                                <TableHead className="font-bold whitespace-nowrap">STATUS</TableHead>
                                {!isLibrarian && <TableHead className="font-bold whitespace-nowrap text-center text-yellow-600">FAVORITE</TableHead>}
                                {isLibrarian && <TableHead className="font-bold whitespace-nowrap text-right min-w-[100px]">ACTION</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((book) => {
                                const isAvailable = book.available_copies > 0;

                                return (
                                    <TableRow key={book.id}>
                                        <TableCell className="min-w-[200px] font-medium">{book.title}</TableCell>
                                        <TableCell className="min-w-[150px]">{book.author}</TableCell>
                                        <TableCell className="whitespace-nowrap">{book.language || 'N/A'}</TableCell>
                                        <TableCell className="whitespace-nowrap">{book.category || 'N/A'}</TableCell>
                                        <TableCell className="whitespace-nowrap text-gray-600 font-mono text-xs">{book.shelf_location || 'N/A'}</TableCell>
                                        <TableCell className="whitespace-nowrap text-gray-600 font-mono text-xs">{book.call_number || 'N/A'}</TableCell>
                                        <TableCell className="whitespace-nowrap text-gray-600 font-mono text-xs">{book.barcode || 'N/A'}</TableCell>
                                        <TableCell className="whitespace-nowrap text-center text-gray-600">
                                            {book.available_copies} / {book.total_copies}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <Badge
                                                className={
                                                    isAvailable
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200 shadow-none border-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200 shadow-none border-red-200'
                                                }
                                            >
                                                {isAvailable ? 'Available' : 'Checked out'}
                                            </Badge>
                                        </TableCell>
                                        {!isLibrarian && (
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleFavorite(book.id)}
                                                    className="hover:bg-red-50"
                                                >
                                                    <Heart
                                                        size={20}
                                                        className={favorites.includes(book.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                                                    />
                                                </Button>
                                            </TableCell>
                                        )}
                                        {isLibrarian && (
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 px-2">
                                                    <Edit size={16} />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                                        No books found matching criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

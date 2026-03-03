"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Edit } from "lucide-react";

const mockCatalog = [
    { barcode: 'B-1001', title: 'To Kill a Mockingbird', author: 'Harper Lee', lang: 'ENG', pages: 281, callNo: 'FIC LEE', shelf: 'A1', status: 'Available' },
    { barcode: 'B-1002', title: '1984', author: 'George Orwell', lang: 'ENG', pages: 328, callNo: 'FIC ORW', shelf: 'A2', status: 'Checked out' },
    { barcode: 'B-1003', title: 'Aadujeevitham', author: 'Benyamin', lang: 'MAL', pages: 250, callNo: 'FIC BEN', shelf: 'M1', status: 'Available' },
];

export default function CatalogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLibrarian, setIsLibrarian] = useState(false);

    useEffect(() => {
        setIsLibrarian(localStorage.getItem('userRole') === 'librarian');
    }, []);

    const toggleFavorite = (barcode: string) => {
        setFavorites(prev =>
            prev.includes(barcode) ? prev.filter(b => b !== barcode) : [...prev, barcode]
        );
    };

    const filtered = mockCatalog.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.barcode.toLowerCase().includes(searchQuery.toLowerCase())
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
                        placeholder="Search by title, author, or barcode..."
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
                                <TableHead className="font-bold whitespace-nowrap min-w-[100px]">BARCODE</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[200px]">TITLE</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[150px]">AUTHOR</TableHead>
                                <TableHead className="font-bold whitespace-nowrap">LANGUAGE</TableHead>
                                <TableHead className="font-bold whitespace-nowrap">PAGES</TableHead>
                                <TableHead className="font-bold whitespace-nowrap min-w-[120px]">CALL NUMBER</TableHead>
                                <TableHead className="font-bold whitespace-nowrap">SHELF</TableHead>
                                <TableHead className="font-bold whitespace-nowrap">STATUS</TableHead>
                                {!isLibrarian && <TableHead className="font-bold whitespace-nowrap text-center text-yellow-600">FAVORITE</TableHead>}
                                {isLibrarian && <TableHead className="font-bold whitespace-nowrap text-right min-w-[100px]">ACTION</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((book) => (
                                <TableRow key={book.barcode}>
                                    <TableCell className="font-medium whitespace-nowrap">{book.barcode}</TableCell>
                                    <TableCell className="min-w-[200px]">{book.title}</TableCell>
                                    <TableCell className="min-w-[150px]">{book.author}</TableCell>
                                    <TableCell className="whitespace-nowrap">{book.lang}</TableCell>
                                    <TableCell className="whitespace-nowrap">{book.pages}</TableCell>
                                    <TableCell className="whitespace-nowrap">{book.callNo}</TableCell>
                                    <TableCell className="whitespace-nowrap">{book.shelf}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <Badge
                                            className={
                                                book.status === 'Available'
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200 shadow-none border-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200 shadow-none border-red-200'
                                            }
                                        >
                                            {book.status}
                                        </Badge>
                                    </TableCell>
                                    {!isLibrarian && (
                                        <TableCell className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleFavorite(book.barcode)}
                                                className="hover:bg-red-50"
                                            >
                                                <Heart
                                                    size={20}
                                                    className={favorites.includes(book.barcode) ? "fill-red-500 text-red-500" : "text-gray-400"}
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
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
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

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "@/lib/supabase/queries";
import Link from "next/link";

export default function FavoritesClient({ initialBooks }: { initialBooks: Book[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Handle responsive pagination
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile(); // Check on mount
        window.addEventListener('resize', checkMobile);

        // Load favorites from local storage
        const storedFavorites = localStorage.getItem('memberFavorites');
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
                console.error("Could not parse favorites");
            }
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const newFavorites = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
            localStorage.setItem('memberFavorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    // Filter to only show favorited books, and then apply search
    const favoritedBooks = initialBooks.filter(book => favorites.includes(book.id));

    const filtered = favoritedBooks.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Effect to update itemsPerPage based on mobile state and total books
    useEffect(() => {
        if (isMobile) {
            // Show all books on mobile
            setItemsPerPage(Math.max(1, filtered.length));
        } else {
            // Default 10 on desktop
            setItemsPerPage(10);
        }
    }, [isMobile, filtered.length, initialBooks.length]);

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedBooks = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (!isMounted) {
        return <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24 min-h-screen">Loading favorites...</div>;
    }

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-red-600 flex items-center gap-2">
                        <Heart className="fill-red-600" size={28} /> MY FAVORITES
                    </h1>
                    <p className="text-gray-500 mt-1">Books you&apos;ve saved for later.</p>
                </div>
            </div>

            {favoritedBooks.length > 0 ? (
                <>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full flex-1 sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Search your favorites by title, author..."
                                className="pl-10 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-md border shadow-sm overflow-hidden border-t-4 border-t-red-500">
                        <div className="overflow-x-auto sm:overflow-x-auto max-h-[65vh] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-bold whitespace-nowrap min-w-[200px]">TITLE</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap min-w-[150px]">AUTHOR</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap min-w-[100px]">LANGUAGE</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap min-w-[120px]">CATEGORY</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap min-w-[100px]">SHELF</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap">COPIES</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap">STATUS</TableHead>
                                        <TableHead className="font-bold whitespace-nowrap text-center text-red-600">FAVORITE</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedBooks.map((book) => {
                                        const isAvailable = book.available_copies > 0;

                                        return (
                                            <TableRow key={book.id}>
                                                <TableCell className="min-w-[200px] whitespace-nowrap font-medium">{book.title}</TableCell>
                                                <TableCell className="min-w-[150px] whitespace-nowrap">{book.author}</TableCell>
                                                <TableCell className="whitespace-nowrap">{book.language || 'N/A'}</TableCell>
                                                <TableCell className="whitespace-nowrap">{book.category || 'N/A'}</TableCell>
                                                <TableCell className="whitespace-nowrap text-gray-600 font-mono text-xs">{book.shelf_location || 'N/A'}</TableCell>
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
                                            </TableRow>
                                        );
                                    })}
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                No favorites found matching your search.
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
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} books
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
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-8">
                    <Heart className="text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Favorites Yet</h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                        You haven&apos;t added any books to your favorites list. Browse the catalog and click the heart icon to save books here.
                    </p>
                    <Link href="/catalog">
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                            Explore Catalog
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

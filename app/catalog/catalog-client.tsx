"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Heart, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { updateBook } from "@/lib/supabase/actions";
import type { Book } from "@/lib/supabase/queries";

export default function CatalogClient({ initialBooks }: { initialBooks: Book[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLibrarian, setIsLibrarian] = useState(false);

    // Edit state
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsLibrarian(localStorage.getItem('userRole') === 'librarian');

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

    // Effect to update itemsPerPage based on mobile state and total books
    useEffect(() => {
        if (isMobile) {
            // Show all books on mobile
            setItemsPerPage(Math.max(1, filtered.length));
        } else {
            // Default 10 on desktop
            setItemsPerPage(10);
        }
    }, [isMobile, initialBooks.length]);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const newFavorites = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
            localStorage.setItem('memberFavorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    // Filter based on real book data
    const filtered = initialBooks.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedBooks = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEditSubmit = async (formData: FormData) => {
        if (!editingBook) return;
        setEditLoading(true);
        setEditMessage(null);

        // Ensure we pass the *original* barcode to updateBook to find the record, 
        // even if the user changed the barcode in the form.
        const res = await updateBook(editingBook.barcode || "", formData);

        if (res.error) {
            setEditMessage({ type: 'error', text: res.error });
        } else {
            setEditMessage({ type: 'success', text: "Book updated successfully!" });
            setTimeout(() => {
                setIsEditDialogOpen(false);
                setEditMessage(null);
            }, 1500);
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">CATALOG</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search by title, author, or ISBN..."
                        className="pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button className="w-full sm:w-auto bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-6">Search</Button>
            </div>

            <div className="bg-white rounded-md border shadow-sm overflow-hidden">
                <div className="overflow-x-auto sm:overflow-x-auto max-h-[65vh] overflow-y-auto">
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
                            {paginatedBooks.map((book) => {
                                const isAvailable = book.available_copies > 0;

                                return (
                                    <TableRow key={book.id}>
                                        <TableCell className="min-w-[200px] whitespace-nowrap font-medium">{book.title}</TableCell>
                                        <TableCell className="min-w-[150px] whitespace-nowrap">{book.author}</TableCell>
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 px-2"
                                                    onClick={() => {
                                                        setEditingBook(book);
                                                        setEditMessage(null);
                                                        setIsEditDialogOpen(true);
                                                    }}
                                                >
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Book Details</DialogTitle>
                        <DialogDescription>
                            Update the properties for &quot;{editingBook?.title}&quot;
                        </DialogDescription>
                    </DialogHeader>
                    {editMessage && (
                        <div className={`p-3 rounded-md text-sm font-medium ${editMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {editMessage.text}
                        </div>
                    )}
                    <form action={handleEditSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Title</label>
                            <Input name="title" required defaultValue={editingBook?.title} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Author</label>
                            <Input name="author" required defaultValue={editingBook?.author} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Language</label>
                                <Input name="language" defaultValue={editingBook?.language || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Category</label>
                                <Input name="category" defaultValue={editingBook?.category || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Shelf</label>
                                <Input name="shelf_location" defaultValue={editingBook?.shelf_location || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Call No.</label>
                                <Input name="call_number" defaultValue={editingBook?.call_number || ""} />
                            </div>
                        </div>
                        <div className="space-y-2 pb-4">
                            <label className="text-sm font-bold text-gray-700">Barcode</label>
                            <Input name="barcode" required defaultValue={editingBook?.barcode || ""} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button disabled={editLoading} type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                                {editLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

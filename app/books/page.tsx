"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, UploadCloud, PlusCircle, Edit, Search } from "lucide-react";
import { useState, useRef } from "react";
import Papa from "papaparse";
import { addBook, updateBook, deleteBooks, getBookByBarcode, bulkAddBooks } from "@/lib/supabase/actions";

export default function BookManagementPage() {
    const [isEditing, setIsEditing] = useState(false);

    // UI States
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form Refs
    const formRef = useRef<HTMLFormElement>(null);

    // Edit Form specific state
    const [editBarcodeToSearch, setEditBarcodeToSearch] = useState("");
    const [originalBarcode, setOriginalBarcode] = useState("");

    // Current Book Data
    const [bookData, setBookData] = useState({
        title: "", author: "", language: "", category: "", shelf_location: "", call_number: "", barcode: ""
    });

    const resetForm = () => {
        setBookData({ title: "", author: "", language: "", category: "", shelf_location: "", call_number: "", barcode: "" });
        setOriginalBarcode("");
        setEditBarcodeToSearch("");
        if (formRef.current) formRef.current.reset();
    };

    const handleSearchForEdit = async () => {
        if (!editBarcodeToSearch) return;
        setLoading(true);
        setMessage(null);

        const res = await getBookByBarcode(editBarcodeToSearch);
        if (res.error) {
            setMessage({ type: 'error', text: res.error });
            resetForm();
        } else if (res.book) {
            setBookData({
                title: res.book.title || "",
                author: res.book.author || "",
                language: res.book.language || "",
                category: res.book.category || "",
                shelf_location: res.book.shelf_location || "",
                call_number: res.book.call_number || "",
                barcode: res.book.barcode || "",
            });
            setOriginalBarcode(res.book.barcode);
            setMessage({ type: 'success', text: "Book found! You can now edit its details." });
        }
        setLoading(false);
    };

    const handleFormSubmit = async (formData: FormData) => {
        setLoading(true);
        setMessage(null);

        // Ensure select values are passed properly
        if (bookData.language) formData.set("language", bookData.language);
        if (bookData.category) formData.set("category", bookData.category);

        let res;
        if (isEditing) {
            if (!originalBarcode) {
                setMessage({ type: 'error', text: "Search for a book first before saving edits." });
                setLoading(false);
                return;
            }
            res = await updateBook(originalBarcode, formData);
        } else {
            res = await addBook(formData);
        }

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessage({ type: 'success', text: isEditing ? "Book successfully updated!" : "Book successfully added!" });
            if (!isEditing) resetForm(); // Keep form populated if editing, reset if adding
        }
        setLoading(false);
    };

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const barcodesToDelete = fd.get("barcodesToDelete") as string;

        if (!barcodesToDelete) {
            setMessage({ type: 'error', text: "Please enter barcodes to delete." });
            return;
        }

        setLoading(true);
        setMessage(null);
        const res = await deleteBooks(barcodesToDelete);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessage({ type: 'success', text: res.message || "Books deleted successfully." });
            (e.target as HTMLFormElement).reset();
        }
        setLoading(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const booksData = results.data as Record<string, unknown>[];
                if (booksData.length === 0) {
                    setMessage({ type: 'error', text: "CSV file is empty or invalid." });
                    setUploading(false);
                    return;
                }

                const res = await bulkAddBooks(booksData);

                if (res.error) {
                    setMessage({ type: 'error', text: res.error });
                } else if (res.success) {
                    setMessage({ type: 'success', text: res.message || "Bulk upload successful!" });
                }
                setUploading(false);
                if (e.target) e.target.value = ''; // Reset input
            },
            error: (error: Error) => {
                setMessage({ type: 'error', text: `Failed to parse CSV: ${error.message}` });
                setUploading(false);
            }
        });
    };

    const handleDownloadTemplate = () => {
        const headers = ["title", "author", "language", "category", "shelf_location", "call_number", "barcode"];
        const exampleRow = ["The Great Gatsby", "F. Scott Fitzgerald", "English", "Fiction", "A1", "800-FIC", "B-001"];

        const csvContent = [
            headers.join(","),
            exampleRow.join(",")
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", "book_upload_template.csv");
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <h1 className="text-3xl font-bold tracking-tight">BOOK MANAGEMENT</h1>

            {message && (
                <div className={`p-4 rounded-md font-medium text-sm ${message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add/Edit Single Book */}
                <Card className={`border-t-4 shadow-sm transition-colors ${isEditing ? 'border-t-blue-500' : 'border-t-yellow-400'}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {isEditing ? <Edit size={20} className="text-blue-500" /> : <PlusCircle size={20} className="text-yellow-500" />}
                                {isEditing ? "UPDATE BOOK DETAILS" : "ADD SINGLE BOOK"}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">

                        {isEditing && (
                            <div className="flex gap-2 mb-6 pb-6 border-b border-gray-100">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        placeholder="Enter Barcode to fetch book..."
                                        className="pl-9"
                                        value={editBarcodeToSearch}
                                        onChange={(e) => setEditBarcodeToSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearchForEdit()}
                                    />
                                </div>
                                <Button onClick={handleSearchForEdit} disabled={loading} variant="secondary">Search</Button>
                            </div>
                        )}

                        <form ref={formRef} action={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title *</label>
                                    <Input name="title" placeholder="Title" required value={bookData.title} onChange={e => setBookData({ ...bookData, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Author *</label>
                                    <Input name="author" placeholder="Author" required value={bookData.author} onChange={e => setBookData({ ...bookData, author: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</label>
                                    <Select name="language" value={bookData.language} onValueChange={v => setBookData({ ...bookData, language: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select Lang" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Malayalam">Malayalam</SelectItem>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Arabic">Arabic</SelectItem>
                                            <SelectItem value="Urdu">Urdu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                                    <Select name="category" value={bookData.category} onValueChange={v => setBookData({ ...bookData, category: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Novel">Novel</SelectItem>
                                            <SelectItem value="Story">Story</SelectItem>
                                            <SelectItem value="Poetry">Poetry</SelectItem>
                                            <SelectItem value="Academic">Academic</SelectItem>
                                            <SelectItem value="Reference">Reference</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Shelf Loc.</label>
                                    <Input name="shelf_location" placeholder="e.g., A1" value={bookData.shelf_location} onChange={e => setBookData({ ...bookData, shelf_location: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Call Number</label>
                                    <Input name="call_number" placeholder="Call Number" value={bookData.call_number} onChange={e => setBookData({ ...bookData, call_number: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Barcode *</label>
                                <Input name="barcode" placeholder="Unique Barcode" required value={bookData.barcode} onChange={e => setBookData({ ...bookData, barcode: e.target.value })} />
                            </div>
                            <div className="pt-2">
                                <Button type="submit" disabled={loading} className={`w-full font-bold text-black ${isEditing ? 'bg-blue-400 hover:bg-blue-500 text-white' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
                                    {loading ? "Processing..." : (isEditing ? "SAVE CHANGES" : "ADD BOOK")}
                                </Button>
                            </div>
                        </form>

                        <div className="text-center mt-2 border-t pt-4">
                            <button
                                onClick={() => { setIsEditing(!isEditing); resetForm(); setMessage(null); }}
                                className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer hover:text-blue-800"
                            >
                                {isEditing ? "Cancel Edit (Switch to Add New Book)" : "Need to edit an existing book?"}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    {/* Bulk Upload */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <UploadCloud size={20} className="text-blue-600" />
                                    BULK UPLOAD BOOKS (CSV)
                                </span>
                                <button
                                    onClick={handleDownloadTemplate}
                                    type="button"
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    Download Template
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-10 text-center flex flex-col items-center justify-center">
                                <UploadCloud className="text-blue-400 mb-2" size={36} />
                                <p className="text-sm font-medium text-gray-600 mb-4">Select a CSV file to upload multiple books</p>
                                <Input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="max-w-xs cursor-pointer text-sm"
                                />
                                {uploading && <p className="text-sm font-bold text-blue-600 mt-3 animate-pulse">Uploading and adding to catalog...</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delete Book */}
                    <Card className="border border-red-200 bg-red-50/20 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <Trash2 size={20} />
                                DELETE BOOK(S)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleDelete} className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Barcodes</label>
                                    <Input name="barcodesToDelete" required placeholder="Enter Barcode(s) comma separated" className="bg-white border-red-100 focus-visible:ring-red-400 text-red-900" />
                                </div>
                                <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">
                                    {loading ? "..." : "DELETE"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { Search, Download, UploadCloud, UserPlus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Member } from "@/lib/supabase/queries";
import { addMember, bulkAddMembers, editMember, deleteMember } from "@/lib/supabase/actions";
import Papa from "papaparse";
import { useRouter } from "next/navigation";

export default function MembersClient({ initialMembers }: { initialMembers: Member[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [editingPatron, setEditingPatron] = useState<Member | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const handleDownloadTemplate = () => {
        const headers = ["full_name", "phone", "address", "place", "barcode", "password"];
        const sampleData = ["John Doe", "1234567890", "123 Main St", "City", "M-9000", "pass123"];
        const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "patron_upload_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const membersData = results.data as Record<string, unknown>[];
                const res = await bulkAddMembers(membersData);

                if (res.error) {
                    setMessage({ type: 'error', text: res.error });
                } else if (res.success) {
                    setMessage({ type: 'success', text: res.message || "Bulk upload successful!" });
                }
                setUploading(false);
                if (event.target) event.target.value = ''; // clear input
            },
            error: (error) => {
                setMessage({ type: 'error', text: `Error parsing CSV: ${error.message}` });
                setUploading(false);
                if (event.target) event.target.value = ''; // clear input
            }
        });
    };

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredPatrons = initialMembers.filter(patron =>
        patron.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patron.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patron.phone?.includes(searchQuery)
    );

    const totalPages = Math.ceil(filteredPatrons.length / itemsPerPage);
    const paginatedPatrons = filteredPatrons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFormSubmit = async (formData: FormData) => {
        setLoading(true);
        setMessage(null);

        const res = await addMember(formData);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessage({ type: 'success', text: "Patron successfully added!" });
            if (formRef.current) formRef.current.reset();
        }
        setLoading(false);
    };

    const handleEditSubmit = async (formData: FormData) => {
        if (!editingPatron) return;
        setEditLoading(true);
        setMessage(null);

        const res = await editMember(editingPatron.id, formData);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessage({ type: 'success', text: res.message || "Patron successfully updated!" });
            setEditingPatron(null);
        }
        setEditLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this patron? This action cannot be undone.")) {
            return;
        }

        setDeleteLoading(id);
        setMessage(null);

        const res = await deleteMember(id);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessage({ type: 'success', text: "Patron successfully deleted!" });
        }
        setDeleteLoading(null);
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <h1 className="text-3xl font-bold tracking-tight">PATRON MANAGEMENT</h1>

            {message && (
                <div className={`p-4 rounded-md font-medium text-sm ${message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Patron Status Table */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <CardTitle>PATRON STATUS</CardTitle>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        placeholder="Search by name, barcode, phone..."
                                        className="pl-9 h-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0"><Download size={18} /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white rounded-md border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="font-bold whitespace-nowrap min-w-[150px]">NAME</TableHead>
                                                <TableHead className="font-bold whitespace-nowrap">BARCODE</TableHead>
                                                <TableHead className="font-bold whitespace-nowrap">PHONE</TableHead>
                                                <TableHead className="font-bold whitespace-nowrap">ADDRESS & PLACE</TableHead>
                                                <TableHead className="font-bold whitespace-nowrap">PASSWORD</TableHead>
                                                <TableHead className="font-bold text-right whitespace-nowrap min-w-[120px]">ACTION</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedPatrons.length > 0 ? (
                                                paginatedPatrons.map((patron) => (
                                                    <TableRow key={patron.id || patron.barcode}>
                                                        <TableCell className="font-medium whitespace-nowrap">{patron.full_name}</TableCell>
                                                        <TableCell className="whitespace-nowrap">{patron.barcode || "N/A"}</TableCell>
                                                        <TableCell className="whitespace-nowrap">{patron.phone || "N/A"}</TableCell>
                                                        <TableCell className="whitespace-nowrap max-w-[200px] truncate" title={`${patron.address || ''}, ${patron.place || ''}`}>
                                                            {patron.address || "N/A"}, {patron.place || "N/A"}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap font-mono text-gray-600">
                                                            {patron.password || "N/A"}
                                                        </TableCell>
                                                        <TableCell className="text-right whitespace-nowrap">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 px-3"
                                                                    onClick={() => setEditingPatron(patron)}
                                                                    disabled={deleteLoading === patron.id}
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3"
                                                                    onClick={() => handleDelete(patron.id)}
                                                                    disabled={deleteLoading === patron.id}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                                        No patrons matched your search or no patrons exist.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 border-t pt-4">
                                    <div className="text-sm text-gray-500">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPatrons.length)} of {filteredPatrons.length} patrons
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft size={16} className="mr-1" /> Prev
                                        </Button>
                                        <div className="text-sm font-medium px-2">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next <ChevronRight size={16} className="ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <Card className="border-t-4 border-t-yellow-400 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus size={20} className="text-yellow-500" />
                                ADD PATRON
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form ref={formRef} action={handleFormSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Input name="full_name" required placeholder="Full Name *" />
                                </div>
                                <div className="space-y-2">
                                    <Input name="phone" placeholder="Phone Number" />
                                </div>
                                <div className="space-y-2">
                                    <Input name="address" placeholder="Address" />
                                </div>
                                <div className="space-y-2">
                                    <Input name="place" placeholder="Place / City" />
                                </div>
                                <div className="space-y-2 pt-2 border-t border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Login Credentials</h3>
                                    <Input name="barcode" required placeholder="Barcode (Username) *" />
                                </div>
                                <div className="space-y-2">
                                    <Input name="password" required type="password" placeholder="Password *" />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                                    {loading ? "PROCESSING..." : "ADD PATRON"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="py-2 px-4">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-xs">
                                    <UploadCloud size={14} className="text-gray-600" />
                                    BULK UPLOAD
                                </span>
                                <button
                                    onClick={handleDownloadTemplate}
                                    type="button"
                                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                >
                                    Template
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3">
                            <div className="border border-dashed border-gray-300 bg-gray-50 rounded p-1 text-center flex items-center justify-center h-10 relative">
                                <Input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                />
                                <span className="text-[10px] font-medium text-gray-600">
                                    {uploading ? "Uploading..." : "Click or drag CSV"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Patron Dialog */}
            <Dialog open={!!editingPatron} onOpenChange={(open) => !open && setEditingPatron(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Patron Details</DialogTitle>
                    </DialogHeader>
                    {editingPatron && (
                        <form action={handleEditSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600">Full Name *</label>
                                <Input name="full_name" required defaultValue={editingPatron.full_name || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                                <Input name="phone" defaultValue={editingPatron.phone || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600">Address</label>
                                <Input name="address" defaultValue={editingPatron.address || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600">Place / City</label>
                                <Input name="place" defaultValue={editingPatron.place || ""} />
                            </div>
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Login Credentials</h3>
                                <label className="text-xs font-semibold text-gray-600">Barcode (Username) *</label>
                                <Input name="barcode" required defaultValue={editingPatron.barcode || ""} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-600">Password *</label>
                                <Input name="password" required defaultValue={editingPatron.password || ""} />
                            </div>
                            <Button type="submit" disabled={editLoading} className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold mt-4">
                                {editLoading ? "UPDATING..." : "UPDATE CHANGES"}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}

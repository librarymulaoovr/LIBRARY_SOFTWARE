"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Search, Download, UploadCloud, UserPlus, Eye, Edit } from "lucide-react";

const mockPatrons = [
    { barcode: 'M-5001', name: 'John Doe', phone: '123-456-7890', address: '123 Main St', place: 'Kochi' },
    { barcode: 'M-5002', name: 'Jane Smith', phone: '987-654-3210', address: '456 Elm St', place: 'Trivandrum' },
    { barcode: 'M-5003', name: 'Ali Hasan', phone: '456-123-7890', address: '789 Oak St', place: 'Kozhikode' },
];

export default function MembersPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPatrons = mockPatrons.filter(patron =>
        patron.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patron.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patron.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <h1 className="text-3xl font-bold tracking-tight">PATRON MANAGEMENT</h1>

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
                                                <TableHead className="font-bold text-right whitespace-nowrap min-w-[120px]">ACTION</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPatrons.length > 0 ? (
                                                filteredPatrons.map((patron) => (
                                                    <TableRow key={patron.barcode}>
                                                        <TableCell className="font-medium whitespace-nowrap">{patron.name}</TableCell>
                                                        <TableCell className="whitespace-nowrap">{patron.barcode}</TableCell>
                                                        <TableCell className="whitespace-nowrap">{patron.phone}</TableCell>
                                                        <TableCell className="whitespace-nowrap max-w-[200px] truncate" title={`${patron.address}, ${patron.place}`}>
                                                            {patron.address}, {patron.place}
                                                        </TableCell>
                                                        <TableCell className="text-right whitespace-nowrap">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 px-2">
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2">
                                                                    <Eye size={16} className="mr-1" /> View Details
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                                        No patrons matched your search.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
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
                            <div className="space-y-2">
                                <Input placeholder="Full Name" />
                            </div>
                            <div className="space-y-2">
                                <Input placeholder="Phone Number" />
                            </div>
                            <div className="space-y-2">
                                <Input placeholder="Address" />
                            </div>
                            <div className="space-y-2">
                                <Input placeholder="Place / City" />
                            </div>
                            <div className="space-y-2">
                                <Input placeholder="Barcode" />
                            </div>
                            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold">ADD PATRON</Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <UploadCloud size={16} className="text-gray-600" />
                                BULK UPLOAD
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                                <p className="text-xs font-medium text-gray-600">Drag & Drop CSV</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}

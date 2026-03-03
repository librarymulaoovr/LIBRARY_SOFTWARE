"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, UploadCloud, PlusCircle, Edit } from "lucide-react";
import { useState } from "react";

export default function BookManagementPage() {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <h1 className="text-3xl font-bold tracking-tight">BOOK MANAGEMENT</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add/Edit Single Book */}
                <Card className={`border-t-4 shadow-sm transition-colors ${isEditing ? 'border-t-blue-500' : 'border-t-yellow-400'}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Edit size={20} className="text-blue-500" />
                                    UPDATE BOOK DETAILS
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} className="text-yellow-500" />
                                    ADD SINGLE BOOK
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                                <Input placeholder="Title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</label>
                                <Input placeholder="Author" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select Lang" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MAL">Malayalam (MAL)</SelectItem>
                                        <SelectItem value="ENG">English (ENG)</SelectItem>
                                        <SelectItem value="ARB">Arabic (ARB)</SelectItem>
                                        <SelectItem value="URD">Urdu (URD)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="novel">Novel</SelectItem>
                                        <SelectItem value="story">Story</SelectItem>
                                        <SelectItem value="poetry">Poetry</SelectItem>
                                        <SelectItem value="academic">Academic</SelectItem>
                                        <SelectItem value="reference">Reference</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Shelf Location</label>
                                <Input placeholder="e.g., A1" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Call Number</label>
                                <Input placeholder="Call Number" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Barcode</label>
                                <Input placeholder="Barcode" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button className={`w-full font-bold text-black ${isEditing ? 'bg-blue-400 hover:bg-blue-500 text-white' : 'bg-yellow-400 hover:bg-yellow-500'}`}>
                                {isEditing ? "SAVE CHANGES" : "ADD BOOK"}
                            </Button>
                        </div>
                        <div className="text-center mt-2 border-t pt-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-sm font-semibold text-blue-600 underline cursor-pointer hover:text-blue-800"
                            >
                                {isEditing ? "Switch to Add New Book instead" : "Update Book Details instead"}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    {/* Bulk Upload */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <UploadCloud size={20} className="text-gray-600" />
                                BULK UPLOAD BOOKS
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-10 text-center flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                                <UploadCloud className="text-gray-400 mb-2" size={36} />
                                <p className="text-sm font-medium text-gray-600">Drag & Drop CSV/Excel file here</p>
                                <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                                <Button variant="outline" className="mt-4 border-gray-300">Browse Files</Button>
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
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Barcodes</label>
                                    <Input placeholder="Enter Barcode(s) comma separated" className="bg-white border-red-100 focus-visible:ring-red-400 text-red-900" />
                                </div>
                                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">DELETE</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

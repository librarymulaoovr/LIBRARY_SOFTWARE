"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CirculationPage() {
    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <h1 className="text-3xl font-bold tracking-tight">CIRCULATION DESK</h1>

            <Tabs defaultValue="checkout" className="w-full max-w-3xl">
                <TabsList className="grid w-full grid-cols-4 bg-gray-200 p-1 h-12 rounded-lg">
                    <TabsTrigger value="checkout" className="font-bold text-sm h-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition-all">CHECK OUT</TabsTrigger>
                    <TabsTrigger value="checkin" className="font-bold text-sm h-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition-all">CHECK IN</TabsTrigger>
                    <TabsTrigger value="renew" className="font-bold text-sm h-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition-all">RENEW</TabsTrigger>
                    <TabsTrigger value="hold" className="font-bold text-sm h-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition-all">HOLD</TabsTrigger>
                </TabsList>

                <TabsContent value="checkout" className="mt-6">
                    <Card className="border-t-4 border-t-yellow-400">
                        <CardHeader>
                            <CardTitle>Check Out Book</CardTitle>
                            <CardDescription>Scan patron barcode and book barcode to process checkout.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Member Name / Barcode</label>
                                <Input placeholder="Enter member name or scan barcode" className="bg-gray-50 h-14 text-base sm:text-lg" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Book Barcode</label>
                                <Input placeholder="Scan book barcode" className="bg-gray-50 h-14 text-base sm:text-lg" />
                            </div>
                            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold mt-4 h-16 text-lg sm:text-xl shadow-md transition-all">PROCESS CHECKOUT</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="checkin" className="mt-6">
                    <Card className="border-t-4 border-t-yellow-400">
                        <CardHeader>
                            <CardTitle>Check In Book</CardTitle>
                            <CardDescription>Scan book barcode to process return.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Book Barcode</label>
                                <Input placeholder="Scan book barcode to return" className="bg-gray-50 h-14 text-base sm:text-lg" />
                            </div>
                            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold mt-4 h-16 text-lg sm:text-xl shadow-md transition-all">PROCESS RETURN</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="renew" className="mt-6">
                    <Card className="border-t-4 border-t-yellow-400">
                        <CardHeader>
                            <CardTitle>Renew Book</CardTitle>
                            <CardDescription>Extend the due date for a checked out book.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Book Barcode</label>
                                <Input placeholder="Scan book barcode to renew" className="bg-gray-50 h-14 text-base sm:text-lg" />
                            </div>
                            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold mt-4 h-16 text-lg sm:text-xl shadow-md transition-all">RENEW BOOK</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hold" className="mt-6">
                    <Card className="border-t-4 border-t-yellow-400">
                        <CardHeader>
                            <CardTitle>Place on Hold</CardTitle>
                            <CardDescription>Reserve a book for a member.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Member Barcode</label>
                                    <Input placeholder="Scan member barcode" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Book Barcode</label>
                                    <Input placeholder="Scan book barcode" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                            </div>
                            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold mt-4 h-16 text-lg sm:text-xl shadow-md transition-all">PLACE HOLD</Button>
                            <div className="border-t pt-6 text-center mt-4">
                                <span className="text-base font-semibold text-blue-600 underline cursor-pointer hover:text-blue-800">
                                    View Held Books
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

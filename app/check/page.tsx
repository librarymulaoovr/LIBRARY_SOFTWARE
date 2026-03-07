"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { processCheckOut, processCheckIn, processRenew } from "@/lib/supabase/actions";

export default function CirculationPage() {
    const [loadingOut, setLoadingOut] = useState(false);
    const [loadingIn, setLoadingIn] = useState(false);
    const [loadingRenew, setLoadingRenew] = useState(false);

    const [messageOut, setMessageOut] = useState<{ type: 'success' | 'error', text: string, details?: { member: string; book: string; checkoutDate: string; returnDate: string } } | null>(null);
    const [messageIn, setMessageIn] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [messageRenew, setMessageRenew] = useState<{ type: 'success' | 'error', text: string, details?: { member: string; book: string; newDueDate: string; } } | null>(null);

    const checkoutFormRef = useRef<HTMLFormElement>(null);
    const checkinFormRef = useRef<HTMLFormElement>(null);
    const renewFormRef = useRef<HTMLFormElement>(null);

    const handleCheckOut = async (formData: FormData) => {
        setLoadingOut(true);
        setMessageOut(null);

        const memberBarcode = formData.get("memberBarcode") as string;
        const bookBarcode = formData.get("bookBarcode") as string;
        const transactionDate = formData.get("transactionDate") as string;

        const res = await processCheckOut(memberBarcode, bookBarcode, transactionDate);

        if (res.error) {
            setMessageOut({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessageOut({
                type: 'success',
                text: res.message || "Book checked out successfully!",
                details: res.details
            });
            if (checkoutFormRef.current) checkoutFormRef.current.reset();
        }
        setLoadingOut(false);
    };

    const handleCheckIn = async (formData: FormData) => {
        setLoadingIn(true);
        setMessageIn(null);

        const bookBarcode = formData.get("bookBarcode") as string;
        const transactionDate = formData.get("transactionDate") as string;

        const res = await processCheckIn(bookBarcode, transactionDate);

        if (res.error) {
            setMessageIn({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessageIn({ type: 'success', text: res.message || "Book returned successfully!" });
            if (checkinFormRef.current) checkinFormRef.current.reset();
        }
        setLoadingIn(false);
    };

    const handleRenew = async (formData: FormData) => {
        setLoadingRenew(true);
        setMessageRenew(null);

        const bookBarcode = formData.get("bookBarcode") as string;
        const transactionDate = formData.get("transactionDate") as string;

        const res = await processRenew(bookBarcode, transactionDate);

        if (res.error) {
            setMessageRenew({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessageRenew({
                type: 'success',
                text: res.message || "Book renewed successfully!",
                details: res.details as { member: string; book: string; newDueDate: string }
            });
            if (renewFormRef.current) renewFormRef.current.reset();
        }
        setLoadingRenew(false);
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <h1 className="text-3xl font-bold tracking-tight">CIRCULATION DESK</h1>

            <Tabs defaultValue="checkout" className="w-full max-w-3xl">
                <TabsList className="grid w-full grid-cols-3 bg-gray-200 p-1 h-12 rounded-lg">
                    <TabsTrigger value="checkout" className="font-bold text-sm h-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition-all">CHECK OUT</TabsTrigger>
                    <TabsTrigger value="checkin" className="font-bold text-sm h-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition-all">CHECK IN</TabsTrigger>
                    <TabsTrigger value="renew" className="font-bold text-sm h-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md transition-all">RENEW</TabsTrigger>
                </TabsList>

                <TabsContent value="checkout" className="mt-6">
                    <Card className="border-t-4 border-t-yellow-400">
                        <CardHeader>
                            <CardTitle>Check Out Book</CardTitle>
                            <CardDescription>Scan patron barcode and book barcode to process checkout.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            {messageOut && (
                                <div className={`p-4 rounded-md text-sm font-medium ${messageOut.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                    <p className="font-bold">{messageOut.text}</p>
                                    {messageOut.details && (
                                        <div className="mt-3 space-y-1 text-green-800 text-xs sm:text-sm bg-green-100 p-3 rounded-md">
                                            <p><span className="font-semibold uppercase text-xs text-green-600">Patron:</span> {messageOut.details.member}</p>
                                            <p><span className="font-semibold uppercase text-xs text-green-600">Book:</span> {messageOut.details.book}</p>
                                            <p><span className="font-semibold uppercase text-xs text-green-600">Checkout Date:</span> {messageOut.details.checkoutDate}</p>
                                            <p><span className="font-semibold uppercase text-xs text-green-600">Due Date (30 Days):</span> {messageOut.details.returnDate}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <form action={handleCheckOut} ref={checkoutFormRef} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Member Name / Barcode</label>
                                    <Input name="memberBarcode" required placeholder="Enter member barcode" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Book Barcode</label>
                                    <Input name="bookBarcode" required placeholder="Scan book barcode" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Transaction Date (Optional)</label>
                                    <Input type="date" name="transactionDate" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <Button disabled={loadingOut} type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold mt-4 h-16 text-lg sm:text-xl shadow-md transition-all">
                                    {loadingOut ? "PROCESSING..." : "PROCESS CHECKOUT"}
                                </Button>
                            </form>
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
                            {messageIn && (
                                <div className={`p-4 rounded-md text-sm font-medium ${messageIn.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                                    {messageIn.text}
                                </div>
                            )}
                            <form action={handleCheckIn} ref={checkinFormRef} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Book Barcode</label>
                                    <Input name="bookBarcode" required placeholder="Scan book barcode to return" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Transaction Date (Optional)</label>
                                    <Input type="date" name="transactionDate" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <Button disabled={loadingIn} type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold mt-4 h-16 text-lg sm:text-xl shadow-md transition-all">
                                    {loadingIn ? "PROCESSING..." : "PROCESS RETURN"}
                                </Button>
                            </form>
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
                            {messageRenew && (
                                <div className={`p-4 rounded-md text-sm font-medium ${messageRenew.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                    <p className="font-bold">{messageRenew.text}</p>
                                    {messageRenew.details && (
                                        <div className="mt-3 space-y-1 text-green-800 text-xs sm:text-sm bg-green-100 p-3 rounded-md">
                                            <p><span className="font-semibold uppercase text-xs text-green-600">Patron:</span> {messageRenew.details.member}</p>
                                            <p><span className="font-semibold uppercase text-xs text-green-600">Book:</span> {messageRenew.details.book}</p>
                                            <p><span className="font-semibold uppercase text-xs text-green-600">New Due Date:</span> {messageRenew.details.newDueDate}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <form action={handleRenew} ref={renewFormRef} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Book Barcode</label>
                                    <Input name="bookBarcode" required placeholder="Scan book barcode to renew" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Transaction Date (Optional)</label>
                                    <Input type="date" name="transactionDate" className="bg-gray-50 h-14 text-base sm:text-lg" />
                                </div>
                                <Button disabled={loadingRenew} type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold mt-4 h-16 text-lg sm:text-xl shadow-md transition-all">
                                    {loadingRenew ? "PROCESSING..." : "RENEW BOOK"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

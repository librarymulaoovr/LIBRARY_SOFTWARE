import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertCircle, History, BookmarkCheck } from "lucide-react";

export default function MemberDashboardPage() {
    const memberName = "Ahmad Raza";
    const mockMemberStats = {
        totalRead: 42,
        currentlyBorrowed: 3,
        returnedHistory: 39,
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-8 pt-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">WELCOME BACK, {memberName.toUpperCase()}</h1>
                <p className="text-gray-500 mt-1">Here is a summary of your library activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Total Books Read */}
                <Card className="border-t-4 border-t-yellow-400">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Total Books Read</CardTitle>
                        <BookOpen size={18} className="text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockMemberStats.totalRead}</div>
                    </CardContent>
                </Card>

                {/* Currently Borrowed */}
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Currently Borrowed</CardTitle>
                        <BookmarkCheck size={18} className="text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{mockMemberStats.currentlyBorrowed}</div>
                        <p className="text-xs text-gray-500 mt-1">2 due this week</p>
                    </CardContent>
                </Card>

                {/* Returned History */}
                <Card className="border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Returned History</CardTitle>
                        <History size={18} className="text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{mockMemberStats.returnedHistory}</div>
                    </CardContent>
                </Card>

            </div>

            <div className="mt-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>CURRENTLY BORROWED</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 border-l-4 border-l-yellow-400">
                                <div>
                                    <h3 className="font-bold">Introduction to Algorithms</h3>
                                    <p className="text-sm text-gray-500">Thomas H. Cormen</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-red-600">Due in 2 days</p>
                                    <p className="text-xs text-gray-500">Barcode: B-4402</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 border-l-4 border-l-green-500">
                                <div>
                                    <h3 className="font-bold">The Pragmatic Programmer</h3>
                                    <p className="text-sm text-gray-500">Andrew Hunt</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-green-600">Due in 14 days</p>
                                    <p className="text-xs text-gray-500">Barcode: B-3199</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

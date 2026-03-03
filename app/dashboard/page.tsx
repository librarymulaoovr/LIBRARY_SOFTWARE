import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockStats = {
    totalBooks: 6359,
    byLanguage: { Malayalam: 2100, English: 2500, Urdu: 800, Arabic: 959 },
    totalMembers: 199,
    borrowedNow: 128,
};

const dueTomorrow = [
    { id: 1, title: 'The Alchemist', member: 'John Doe', barcode: 'B-1029' },
    { id: 2, title: 'Introduction to Algorithms', member: 'Jane Smith', barcode: 'B-4402' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
                <p className="text-gray-500 mt-1">Overview of library statistics and pending tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Total Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockStats.totalBooks}</div>
                        <p className="text-xs text-gray-500 mt-1">MAL: {mockStats.byLanguage.Malayalam} | ENG: {mockStats.byLanguage.English}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockStats.totalMembers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Borrowed Now</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{mockStats.borrowedNow}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>DUE TOMORROW</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book</TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Barcode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dueTomorrow.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.member}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.barcode}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>UNRETURNED BOOKS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-full min-h-[120px] text-gray-500 border-2 border-dashed rounded-md">
                            <span className="underline cursor-pointer hover:text-black">View All Unreturned Books</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch Total Books
    const { count: totalBooks } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

    // Fetch Total Members
    const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

    // Fetch Currently Borrowed
    const { count: borrowedNow } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'borrowed');

    // For demo purposes, fetch some active loans (usually we'd filter by due_date)
    const { data: activeLoans } = await supabase
        .from('loans')
        .select(`
            id,
            due_date,
            books ( title, isbn ),
            members ( full_name )
        `)
        .eq('status', 'borrowed')
        .limit(5);

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
                        <div className="text-3xl font-bold">{totalBooks || 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Catalog items across all categories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalMembers || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase text-gray-500">Borrowed Now</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{borrowedNow || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>RECENT ACTIVE LOANS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Book</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Due Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activeLoans && activeLoans.length > 0 ? (
                                        activeLoans.map((loan: any) => (
                                            <TableRow key={loan.id}>
                                                <TableCell className="font-medium">{loan.books?.title || 'Unknown'}</TableCell>
                                                <TableCell>{loan.members?.full_name || 'Unknown'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {new Date(loan.due_date).toLocaleDateString()}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                                                No active loans found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTopReaders, getPopularBooks } from "@/lib/supabase/queries";
import { BookOpen, Users, AlertCircle } from "lucide-react";

export default async function HistoryPage() {
    const topReaders = await getTopReaders();
    const popularBooks = await getPopularBooks();

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">LIBRARY ANALYTICS</h1>
                <p className="text-gray-500 mt-1">Insights into reading habits and popular collections.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Top Readers */}
                <Card className="border-t-4 border-t-yellow-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users size={20} className="text-yellow-500" />
                            TOP READERS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Books</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topReaders.length > 0 ? (
                                    topReaders.map((reader: any) => (
                                        <TableRow key={reader.id}>
                                            <TableCell>
                                                <p className="font-medium">{reader.name || "Unknown Member"}</p>
                                                <p className="text-xs text-gray-500">{reader.category}</p>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-yellow-600">{reader.count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                                            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            No checkout data available yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Most Popular Books */}
                <Card className="border-t-4 border-t-yellow-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BookOpen size={20} className="text-yellow-500" />
                            POPULAR BOOKS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="text-right">Borrows</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {popularBooks.length > 0 ? (
                                    popularBooks.map((book: any) => (
                                        <TableRow key={book.id}>
                                            <TableCell>
                                                <p className="font-medium truncate max-w-[150px]">{book.title || "Unknown Book"}</p>
                                                <p className="text-xs text-gray-500">{book.author}</p>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-blue-600">{book.borrows}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                                            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            No checkout data available yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Loader2 } from "lucide-react";
import { generateSystemBackup } from "@/lib/supabase/actions";
import { useState } from "react";

export default function BackupPage() {
    const [isExporting, setIsExporting] = useState(false);
    const [lastBackup, setLastBackup] = useState<string>("Never");

    const handleBackup = async () => {
        setIsExporting(true);
        try {
            const result = await generateSystemBackup();

            if (result.error || !result.data) {
                alert("Failed to generate backup: " + "Network Error");
                return;
            }

            // Map Supabase rows into a flat CSV-friendly array
            const flatData = result.data.map((row: any) => {
                const isOverdue = new Date(row.due_date) < new Date() && row.status === 'Borrowed';
                return {
                    "Transaction ID": row.id,
                    "Checkout Date": new Date(row.borrow_date).toLocaleString(),
                    "Due Date": new Date(row.due_date).toLocaleString(),
                    "Return Date": row.return_date ? new Date(row.return_date).toLocaleString() : 'Not Returned',
                    "Status": row.status,
                    "Overdue": isOverdue ? 'YES' : 'NO',
                    "Book Barcode": row.books?.barcode || 'N/A',
                    "Book Title": row.books?.title || 'Unknown',
                    "Book Author": row.books?.author || 'Unknown',
                    "Member Barcode": row.members?.barcode || 'N/A',
                    "Member Name": row.members?.full_name || 'Unknown',
                    "Membership": row.members?.membership_type || 'Unknown'
                };
            });

            if (flatData.length === 0) {
                alert("No circulation data found to backup.");
                setIsExporting(false);
                return;
            }

            // Create CSV Headers
            const headers = Object.keys(flatData[0]).join(",");
            // Create CSV Rows
            const csvRows = flatData.map(row =>
                Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
            );

            const csvData = [headers, ...csvRows].join("\n");

            // Trigger Browser Download
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const dateStr = new Date().toISOString().split('T')[0];
            link.setAttribute("download", `Library_Analytics_Backup_${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setLastBackup(new Date().toLocaleString());
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">BACKUP & RESET</h1>
                <p className="text-gray-500 mt-1">Manage system data, generate backups, and perform yearly resets.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">

                <Card className="border-t-4 border-t-yellow-400 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DatabaseBackup size={20} className="text-yellow-500" />
                            LIVE ANALYTICS BACKUP
                        </CardTitle>
                        <CardDescription>Generate a complete CSV export of all library transaction history including real-time returned, overdue, and active metrics.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                            <p><strong>Last Export Generated:</strong> {lastBackup}</p>
                            <p><strong>Format:</strong> .CSV (Excel Supported)</p>
                        </div>
                        <Button
                            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6 text-md"
                            onClick={handleBackup}
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    GENERATING FILE...
                                </>
                            ) : (
                                "GENERATE FULL BACKUP"
                            )}
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

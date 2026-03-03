import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatabaseBackup } from "lucide-react";

export default function BackupPage() {
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
                            SYSTEM BACKUP
                        </CardTitle>
                        <CardDescription>Generate a complete backup of all library data, including patrons, books, and transaction history.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                            <p><strong>Last Backup:</strong> 2026-03-01 18:45</p>
                            <p><strong>Size:</strong> 45.2 MB</p>
                        </div>
                        <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6 text-md">
                            GENERATE FULL BACKUP
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

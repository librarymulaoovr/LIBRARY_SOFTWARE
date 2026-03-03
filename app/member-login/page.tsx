"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MemberLogin() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, perform auth here.
        localStorage.setItem('userRole', 'member');
        // For now, just redirect to the member dashboard.
        router.push('/member/dashboard-mem');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border-t-8 border-t-blue-500">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight uppercase">Member Login</CardTitle>
                    <CardDescription>
                        Use your library barcode and PIN to view your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="barcode"
                                    placeholder="Barcode (e.g., M-5001)"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="pin"
                                    type="password"
                                    placeholder="4-Digit PIN"
                                    maxLength={4}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 font-bold py-6 text-md" type="submit">
                            ACCESS MY ACCOUNT
                        </Button>
                        <div className="text-sm text-center text-gray-500">
                            <Link href="/" className="hover:text-black underline underline-offset-4">
                                Return to Homepage
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

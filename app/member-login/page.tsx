"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, KeyRound, Phone, Mail, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { loginMember } from "@/lib/supabase/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MemberLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        const barcode = formData.get("barcode") as string;
        const password = formData.get("password") as string;

        const res = await loginMember(barcode, password);

        if (res.error) {
            setErrorMsg(res.error);
            setLoading(false);
            return;
        }

        if (res.success && res.member) {
            localStorage.setItem('userRole', 'member');
            localStorage.setItem('memberBarcode', res.member.barcode || "");
            localStorage.setItem('memberName', res.member.full_name || "");

            router.push('/member/dashboard-mem');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-0">
            <Card className="w-full max-w-md shadow-lg border-t-8 border-t-blue-500">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight uppercase">Member Login</CardTitle>
                    <CardDescription>
                        Use your library barcode and PIN to view your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {errorMsg && (
                            <div className="p-3 bg-red-100 text-red-800 text-sm font-medium rounded-md border border-red-200">
                                {errorMsg}
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="barcode"
                                    name="barcode"
                                    placeholder="Barcode (e.g., M-5001)"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    required
                                    disabled={loading}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    disabled={loading}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex justify-center pt-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded">
                                            Forgot password?
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-xl rounded-xl">
                                        <DialogHeader className="space-y-3">
                                            <DialogTitle className="text-xl font-bold text-gray-900 border-b pb-3">Account Recovery</DialogTitle>
                                            <DialogDescription asChild>
                                                <div className="pt-2 text-base text-gray-600 leading-relaxed text-left">
                                                    <p>
                                                        For security reasons, member accounts do not have automated password resets.
                                                        Please contact the library administration to update your password.
                                                    </p>

                                                    <div className="mt-5 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                        <div className="flex items-center gap-3 text-gray-800">
                                                            <UserRound className="w-5 h-5 text-blue-500 shrink-0" />
                                                            <span><span className="font-semibold text-gray-900">Chief Librarian:</span> Binu</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-gray-800">
                                                            <Phone className="w-5 h-5 text-green-500 shrink-0" />
                                                            <a href="tel:+919605659222" className="hover:text-blue-600 transition-colors font-medium">+91 9605659222</a>
                                                        </div>
                                                        <div className="flex items-start gap-3 text-gray-800">
                                                            <Mail className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                                            <a href="mailto:vinjanaposhinigrandhasalamulav@gmail.com" className="hover:text-blue-600 transition-colors font-medium break-all">vinjanaposhinigrandhasalamulav@gmail.com</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-6">
                        <Button disabled={loading} className="w-full bg-blue-500 text-white hover:bg-blue-600 font-bold py-6 text-md" type="submit">
                            {loading ? "VERIFYING..." : "ACCESS MY ACCOUNT"}
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

"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LibrarianLogin() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Hardcoded credentials for librarians
        const validUsers = [
            { email: "adhilmulavoor", password: "adhilmulavoor" },
            { email: "binu", password: "9605659222" },
            { email: "admin", password: "mulavoorlibary" }
        ];

        const isValidUser = validUsers.some(
            (user) => user.email === email && user.password === password
        );

        if (isValidUser) {
            localStorage.setItem('userRole', 'librarian');
            router.push('/dashboard');
        } else {
            setErrorMsg("Invalid username or password");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-0">
            <Card className="w-full max-w-md shadow-lg border-t-8 border-t-yellow-400">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight uppercase">Librarian Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the management portal
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
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Username"
                                    type="text"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-6">
                        <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6 text-md" type="submit">
                            LOGIN TO DASHBOARD
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

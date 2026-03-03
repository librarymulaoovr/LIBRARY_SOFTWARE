"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const mockTickets = [
    { id: 'TKT-001', type: 'Bug', priority: 'High', status: 'Open', date: '2026-03-01' },
    { id: 'TKT-002', type: 'Feature', priority: 'Low', status: 'Closed', date: '2026-02-28' },
];

export default function SupportPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">SYSTEM SUPPORT</h1>
                <p className="text-gray-500 mt-1">Submit tickets for bugs or feature requests.</p>
            </div>

            <Card className="border-t-4 border-t-yellow-400 shadow-sm">
                <CardHeader>
                    <CardTitle>Submit a Ticket</CardTitle>
                    <CardDescription>Fill out the form below to report an issue to the dev team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Type</label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bug">Bug Report</SelectItem>
                                    <SelectItem value="feature">Feature Request</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                        <Input placeholder="Brief description of the issue" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</label>
                        <Textarea placeholder="Provide steps to reproduce or feature details..." className="min-h-[100px]" />
                    </div>
                    <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold mt-2">SUBMIT TICKET</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>TICKET HISTORY</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockTickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{ticket.id}</span>
                                        <Badge variant="outline">{ticket.type}</Badge>
                                        <Badge className={
                                            ticket.priority === 'High' ? 'bg-red-100 text-red-800 hover:bg-red-100 shadow-none' : 'bg-blue-100 text-blue-800 hover:bg-blue-100 shadow-none'
                                        }>{ticket.priority}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Submitted on {ticket.date}</p>
                                </div>
                                <Badge className={
                                    ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 shadow-none' : 'bg-gray-200 text-gray-800 hover:bg-gray-200 shadow-none'
                                }>{ticket.status}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

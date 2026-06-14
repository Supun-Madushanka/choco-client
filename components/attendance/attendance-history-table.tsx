"use client";

import { useState, useEffect } from "react";
import { attendanceService } from "@/services/attendance-service";
import { AttendanceResponse } from "@/types/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function AttendanceHistoryTable() {

    const [records, setRecords] = useState<AttendanceResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState(
        format(startOfMonth(new Date()), "yyyy-MM-dd")
    );
    const [endDate, setEndDate] = useState(
        format(endOfMonth(new Date()), "yyyy-MM-dd")
    );

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await attendanceService.getMyHistory(
                startDate, endDate
            );
            setRecords(response.data);
        } catch {
            console.error("Failed to fetch attendance history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            PRESENT: "bg-success-light text-success border-success/20",
            LATE: "bg-warning-light text-warning border-warning/20",
            HALF_DAY: "bg-info-light text-info border-info/20",
            ABSENT: "bg-error-light text-error border-error/20",
            ON_LEAVE: "bg-purple-50 text-purple-600 border-purple-200",
        };
        return map[status] || "bg-cream-100 text-text-secondary border-cream-200";
    };

    const calculateHours = (checkIn: string | null, checkOut: string | null) => {
        if (!checkIn || !checkOut) return "—";
        const inTime = new Date(checkIn).getTime();
        const outTime = new Date(checkOut).getTime();
        const hours = (outTime - inTime) / (1000 * 60 * 60);
        return `${hours.toFixed(1)} hrs`;
    };

    return (
        <Card className="border-cream-200 shadow-card mt-6">
            <CardHeader className="pb-3 border-b border-cream-200">
                <div className="flex flex-col sm:flex-row sm:items-center
                                sm:justify-between gap-3">
                    <CardTitle className="text-base font-semibold text-text-primary">
                        Attendance History
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-text-muted">From</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-8 text-xs border-cream-200
                                           focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-text-muted">To</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-8 text-xs border-cream-200
                                           focus-visible:ring-gold-500"
                            />
                        </div>
                        <button
                            onClick={fetchHistory}
                            className="h-8 px-3 mt-5 text-xs font-medium
                                       bg-gold-500 hover:bg-gold-400
                                       text-white rounded-md transition-colors">
                            Filter
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">

                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-cream-50 hover:bg-cream-50">
                                    <TableHead className="text-text-secondary font-medium">
                                        Date
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Check In
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Check Out
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium hidden sm:table-cell">
                                        Hours
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-10 text-text-muted">
                                            No attendance records found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    records.map((record) => (
                                        <TableRow
                                            key={record.id}
                                            className="hover:bg-cream-50 transition-colors">
                                            <TableCell className="text-sm text-text-primary font-medium">
                                                {format(new Date(record.workDate), "dd MMM yyyy")}
                                            </TableCell>
                                            <TableCell className="text-sm text-text-secondary">
                                                {record.checkIn
                                                    ? format(new Date(record.checkIn), "hh:mm a")
                                                    : "—"}
                                            </TableCell>
                                            <TableCell className="text-sm text-text-secondary">
                                                {record.checkOut
                                                    ? format(new Date(record.checkOut), "hh:mm a")
                                                    : "—"}
                                            </TableCell>
                                            <TableCell className="text-sm text-text-secondary hidden sm:table-cell">
                                                {calculateHours(record.checkIn, record.checkOut)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getStatusBadge(record.status)}`}>
                                                    {record.status.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
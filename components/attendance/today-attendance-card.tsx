"use client";

import { useState, useEffect } from "react";
import { attendanceService } from "@/services/attendance-service";
import { AttendanceResponse } from "@/types/attendance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, LogOut, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function TodayAttendanceCard() {

    const [attendance, setAttendance] = useState<AttendanceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchToday = async () => {
        setLoading(true);
        try {
            const response = await attendanceService.getMyToday();
            setAttendance(response.data);
        } catch {
            console.error("Failed to fetch today's attendance");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchToday();
    }, []);

    const handleCheckIn = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await attendanceService.checkIn();
            fetchToday();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to check in");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await attendanceService.checkOut();
            fetchToday();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to check out");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setActionLoading(false);
        }
    };

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

    if (loading) {
        return (
            <Card className="border-cream-200 shadow-card">
                <CardContent className="p-6">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-cream-200 shadow-card">
            <CardContent className="p-6">

                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-sm font-semibold text-text-primary">
                            Today - {format(new Date(), "EEEE, dd MMM yyyy")}
                        </p>
                    </div>
                    {attendance && (
                        <Badge
                            variant="outline"
                            className={`text-xs ${getStatusBadge(attendance.status)}`}>
                            {attendance.status.replace("_", " ")}
                        </Badge>
                    )}
                </div>

                {error && (
                    <div className="bg-error-light border border-error/20
                                    text-error rounded-lg px-4 py-3 text-sm mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Check In */}
                    <div className="rounded-lg border border-cream-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-success-light
                                            flex items-center justify-center">
                                <LogIn size={15} className="text-success" />
                            </div>
                            <p className="text-sm font-medium text-text-primary">
                                Check In
                            </p>
                        </div>

                        {attendance?.checkIn ? (
                            <div className="flex items-center gap-2 mt-3">
                                <CheckCircle2 size={16} className="text-success" />
                                <p className="text-lg font-bold text-text-primary">
                                    {format(new Date(attendance.checkIn), "hh:mm a")}
                                </p>
                            </div>
                        ) : (
                            <Button
                                onClick={handleCheckIn}
                                disabled={actionLoading}
                                className="w-full mt-3 bg-success hover:bg-success/90
                                           text-white gap-2">
                                <LogIn size={15} />
                                {actionLoading ? "Checking in..." : "Check In"}
                            </Button>
                        )}
                    </div>

                    {/* Check Out */}
                    <div className="rounded-lg border border-cream-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-error-light
                                            flex items-center justify-center">
                                <LogOut size={15} className="text-error" />
                            </div>
                            <p className="text-sm font-medium text-text-primary">
                                Check Out
                            </p>
                        </div>

                        {attendance?.checkOut ? (
                            <div className="flex items-center gap-2 mt-3">
                                <CheckCircle2 size={16} className="text-success" />
                                <p className="text-lg font-bold text-text-primary">
                                    {format(new Date(attendance.checkOut), "hh:mm a")}
                                </p>
                            </div>
                        ) : attendance?.checkIn ? (
                            <Button
                                onClick={handleCheckOut}
                                disabled={actionLoading}
                                className="w-full mt-3 bg-error hover:bg-error/90
                                           text-white gap-2">
                                <LogOut size={15} />
                                {actionLoading ? "Checking out..." : "Check Out"}
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 mt-3
                                            text-text-muted">
                                <Clock size={15} />
                                <p className="text-sm">
                                    Check in first
                                </p>
                            </div>
                        )}
                    </div>

                </div>

            </CardContent>
        </Card>
    );
}
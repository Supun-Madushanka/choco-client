"use client";

import { useState, useEffect } from "react";
import { attendanceService } from "@/services/attendance-service";
import {
    AttendanceResponse,
    AttendanceStatus,
} from "@/types/attendance";
import { EmployeeResponse } from "@/types/employee";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface AttendanceEditDialogProps {
    open: boolean;
    employee: EmployeeResponse | null;
    existingRecord: AttendanceResponse | null;
    workDate: string;
    onClose: () => void;
    onSuccess: () => void;
}

const STATUS_OPTIONS: AttendanceStatus[] = [
    "PRESENT", "ABSENT", "HALF_DAY", "LATE", "ON_LEAVE",
];

// Convert "2026-06-15T08:05:00" → "08:05" (for time input)
const toTimeInput = (datetime: string | null): string => {
    if (!datetime) return "";
    return format(new Date(datetime), "HH:mm");
};

// Combine workDate + "HH:mm" → ISO datetime string
const toDateTime = (workDate: string, time: string): string | undefined => {
    if (!time) return undefined;
    return `${workDate}T${time}:00`;
};

export default function AttendanceEditDialog({
    open,
    employee,
    existingRecord,
    workDate,
    onClose,
    onSuccess,
}: AttendanceEditDialogProps) {

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [status, setStatus] = useState<AttendanceStatus>("PRESENT");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            if (existingRecord) {
                setCheckIn(toTimeInput(existingRecord.checkIn));
                setCheckOut(toTimeInput(existingRecord.checkOut));
                setStatus(existingRecord.status);
                setNote(existingRecord.note || "");
            } else {
                setCheckIn("");
                setCheckOut("");
                setStatus("ABSENT");
                setNote("");
            }
            setError(null);
        }
    }, [open, existingRecord]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!employee) return;

        setLoading(true);
        setError(null);

        try {
            if (existingRecord) {
                // Edit existing
                await attendanceService.updateAttendance(existingRecord.id, {
                    checkIn: toDateTime(workDate, checkIn),
                    checkOut: toDateTime(workDate, checkOut),
                    status,
                    note: note || undefined,
                    workDate: ""
                });
            } else {
                // Create new
                await attendanceService.createForEmployee(employee.id, {
                    workDate,
                    checkIn: toDateTime(workDate, checkIn),
                    checkOut: toDateTime(workDate, checkOut),
                    status,
                    note: note || undefined,
                });
            }
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to save attendance record"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        {existingRecord ? "Edit Attendance" : "Mark Attendance"}
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {employee?.fullName} - {format(new Date(workDate), "dd MMM yyyy")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Status
                        </Label>
                        <Select
                            value={status}
                            onValueChange={(value) => setStatus(value as AttendanceStatus)}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s.replace("_", " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Check In + Check Out */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Check In
                            </Label>
                            <Input
                                type="time"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Check Out
                            </Label>
                            <Input
                                type="time"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Note{" "}
                            <span className="text-text-muted font-normal">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Reason, remarks etc."
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={onClose}
                            disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
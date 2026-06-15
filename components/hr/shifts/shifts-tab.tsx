"use client";

import { useState, useEffect } from "react";
import { shiftService } from "@/services/shift-service";
import { ShiftResponse } from "@/types/shift";
import ShiftsTable from "./shifts-table";
import CreateShiftDialog from "./create-shift-dialog";

export default function ShiftsTab() {

    const [shifts, setShifts] = useState<ShiftResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchShifts = async () => {
        setLoading(true);
        try {
            const response = await shiftService.getAllShifts();
            setShifts(response.data);
        } catch {
            console.error("Failed to fetch shifts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Shifts
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage work shifts for employees
                    </p>
                </div>
                <CreateShiftDialog onSuccess={fetchShifts} />
            </div>

            <ShiftsTable
                shifts={shifts}
                loading={loading}
                onRefresh={fetchShifts}
            />
        </div>
    );
}
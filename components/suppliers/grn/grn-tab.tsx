"use client";

import { useState, useEffect } from "react";
import { grnService } from "@/services/grn-service";
import { GoodsReceivedNoteResponse } from "@/types/grn";
import GrnTable from "./grn-table";
import CreateGrnDialog from "./create-grn-dialog";

export default function GrnTab() {

    const [grns, setGrns] = useState<GoodsReceivedNoteResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGrns = async () => {
        setLoading(true);
        try {
            const response = await grnService.getAllGrns();
            setGrns(response.data);
        } catch {
            console.error("Failed to fetch GRNs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrns();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Goods Received Notes
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({grns.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage incoming goods and quality control
                    </p>
                </div>
                <CreateGrnDialog onSuccess={fetchGrns} />
            </div>

            <GrnTable grns={grns} loading={loading} />
        </div>
    );
}
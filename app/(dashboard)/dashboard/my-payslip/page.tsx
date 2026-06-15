"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/page-header";
import { payrollService } from "@/services/payroll-service";
import { PayrollResponse } from "@/types/payroll";
import LatestPayslipCard from "@/components/my-payslip/latest-payslip-card";
import PaymentHistoryTable from "@/components/my-payslip/payment-history-table";

export default function Page() {
    const [latest, setLatest] = useState<PayrollResponse | null>(null);
    const [history, setHistory] = useState<PayrollResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [latestRes, historyRes] =
                await Promise.all([
                    payrollService.getMyLatest(),
                    payrollService.getMyHistory(),
                ]);
            setLatest(latestRes.data);
            setHistory(historyRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Payslip"
                description="
                View and download your payslips
                for current and previous months.
                "
            />

            <LatestPayslipCard
                payroll={latest}
                loading={loading}
            />

            <PaymentHistoryTable
                payrolls={history}
                loading={loading}
            />

        </div>
    );
}
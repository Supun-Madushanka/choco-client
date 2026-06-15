"use client";

import { useState, useEffect } from "react";
import { payrollService } from "@/services/payroll-service";
import { PayrollRequest, PayrollResponse } from "@/types/payroll";
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
import { Separator } from "@/components/ui/separator";

interface PayrollProcessDialogProps {
    open: boolean;
    employee: EmployeeResponse | null;
    existingRecord: PayrollResponse | null;
    month: number;
    year: number;
    onClose: () => void;
    onSuccess: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export default function PayrollProcessDialog({
    open,
    employee,
    existingRecord,
    month,
    year,
    onClose,
    onSuccess,
}: PayrollProcessDialogProps) {

    const [basicSalary, setBasicSalary] = useState("");
    const [allowances, setAllowances] = useState("0");
    const [additionalDeductions, setAdditionalDeductions] = useState("0");
    const [taxPercentage, setTaxPercentage] = useState("0");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            if (existingRecord) {
                setBasicSalary(String(existingRecord.basicSalary));
                setAllowances(String(existingRecord.allowances));
                setAdditionalDeductions(String(existingRecord.additionalDeductions));
                // Reverse-calculate tax % from stored tax amount
                const gross = existingRecord.basicSalary + existingRecord.allowances;
                const taxPct = gross > 0
                    ? (existingRecord.tax / gross) * 100
                    : 0;
                setTaxPercentage(taxPct.toFixed(2));
                setNote(existingRecord.note || "");
            } else {
                setBasicSalary("");
                setAllowances("0");
                setAdditionalDeductions("0");
                setTaxPercentage("0");
                setNote("");
            }
            setError(null);
        }
    }, [open, existingRecord]);

    // Live preview calculation
    const basic = parseFloat(basicSalary) || 0;
    const allow = parseFloat(allowances) || 0;
    const addDed = parseFloat(additionalDeductions) || 0;
    const taxPct = parseFloat(taxPercentage) || 0;

    const gross = basic + allow;
    const epf = basic * 0.08;
    const etf = basic * 0.03;
    const tax = gross * (taxPct / 100);
    const totalDeductions = epf + tax + addDed;
    const netSalary = gross - totalDeductions;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!employee) return;

        if (!basicSalary || basic <= 0) {
            setError("Basic salary must be greater than 0");
            return;
        }

        setLoading(true);
        setError(null);

        const request: PayrollRequest = {
            employeeId: employee.id,
            month,
            year,
            basicSalary: basic,
            allowances: allow,
            additionalDeductions: addDed,
            taxPercentage: taxPct,
            note: note || undefined,
        };

        try {
            if (existingRecord) {
                await payrollService.updatePayroll(existingRecord.id, request);
            } else {
                await payrollService.createPayroll(request);
            }
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to process payroll"
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
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        {existingRecord ? "Edit Payroll" : "Process Payroll"}
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {employee?.fullName} - {month}/{year}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Basic Salary */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Basic Salary (LKR)
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={basicSalary}
                            onChange={(e) => {
                                setBasicSalary(e.target.value);
                                setError(null);
                            }}
                            placeholder="100000"
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    {/* Allowances + Tax % */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Allowances (LKR)
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={allowances}
                                onChange={(e) => setAllowances(e.target.value)}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Tax (%)
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={taxPercentage}
                                onChange={(e) => setTaxPercentage(e.target.value)}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Additional Deductions */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Additional Deductions (LKR)
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={additionalDeductions}
                            onChange={(e) => setAdditionalDeductions(e.target.value)}
                            placeholder="Loan repayment, fines etc."
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
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
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={2}
                        />
                    </div>

                    <Separator />

                    {/* Live Preview */}
                    <div className="bg-cream-50 border border-cream-200
                                    rounded-lg p-4 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider
                                      text-text-muted mb-1">
                            Salary Breakdown
                        </p>

                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Gross Earnings</span>
                            <span className="font-medium text-text-primary">
                                {formatCurrency(gross)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">EPF (8% Employee)</span>
                            <span className="text-error">
                                - {formatCurrency(epf)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">ETF (3% Employer)</span>
                            <span className="text-text-muted">
                                {formatCurrency(etf)} (info)
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Tax</span>
                            <span className="text-error">
                                - {formatCurrency(tax)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Additional Deductions</span>
                            <span className="text-error">
                                - {formatCurrency(addDed)}
                            </span>
                        </div>

                        <Separator />

                        <div className="flex justify-between text-sm font-semibold">
                            <span className="text-text-primary">Net Salary</span>
                            <span className="text-success text-base">
                                LKR {formatCurrency(netSalary)}
                            </span>
                        </div>
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
                            {loading
                                ? "Saving..."
                                : existingRecord ? "Save Changes" : "Process Payroll"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
"use client";

import { useState, useEffect } from "react";
import { grnService } from "@/services/grn-service";
import { GrnItemResponse } from "@/types/grn";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FlaskConical } from "lucide-react";

interface InspectItemDialogProps {
    grnId: number;
    item: GrnItemResponse;
    onSuccess: () => void;
}

export default function InspectItemDialog({
    grnId,
    item,
    onSuccess,
}: InspectItemDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [acceptedQuantity, setAcceptedQuantity] = useState(
        item.receivedQuantity
    );
    const [qualityStatus, setQualityStatus] = useState("PASSED");
    const [qualityNotes, setQualityNotes] = useState("");

    useEffect(() => {
        if (open) {
            setAcceptedQuantity(item.receivedQuantity);
            setQualityStatus("PASSED");
            setQualityNotes("");
            setError(null);
        }
    }, [open, item]);

    const rejectedQuantity = item.receivedQuantity - acceptedQuantity;

    const handleSubmit = async () => {
        if (acceptedQuantity < 0) {
            setError("Accepted quantity cannot be negative");
            return;
        }
        if (acceptedQuantity > item.receivedQuantity) {
            setError(
                `Accepted quantity cannot exceed received quantity of ${item.receivedQuantity}`
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await grnService.inspectItem(grnId, item.id, {
                acceptedQuantity,
                qualityStatus,
                qualityNotes: qualityNotes || undefined,
            });
            setOpen(false);
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message || "Inspection failed"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const alreadyInspected = item.qualityStatus !== "PENDING";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(true)}
                disabled={alreadyInspected}
                className="border-cream-200 gap-1.5 text-xs">
                <FlaskConical size={12} />
                {alreadyInspected ? "Inspected" : "Inspect"}
            </Button>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Inspect Item
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {item.rawMaterialName} — Received:{" "}
                        {item.receivedQuantity.toLocaleString()} {item.unit}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Accepted Quantity
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            max={item.receivedQuantity}
                            value={acceptedQuantity || ""}
                            onChange={(e) =>
                                setAcceptedQuantity(parseFloat(e.target.value) || 0)
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                        <p className="text-xs text-text-muted">
                            Rejected: {rejectedQuantity.toLocaleString()} {item.unit}
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Quality Status
                        </Label>
                        <Select
                            value={qualityStatus}
                            onValueChange={setQualityStatus}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PASSED">Passed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Quality Notes
                        </Label>
                        <Textarea
                            value={qualityNotes}
                            onChange={(e) => setQualityNotes(e.target.value)}
                            placeholder="Optional inspection notes..."
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={3}
                        />
                    </div>

                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-cream-200"
                        onClick={() => setOpen(false)}
                        disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                        {loading ? "Saving..." : "Save Inspection"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
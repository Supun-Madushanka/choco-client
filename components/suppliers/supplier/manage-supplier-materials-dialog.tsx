"use client";

import { useState, useEffect, useCallback } from "react";
import { supplierMaterialService } from "@/services/supplier-material-service";
import { SupplierMaterialResponse } from "@/types/supplier-material";
import { SupplierResponse } from "@/types/supplier";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Star } from "lucide-react";
import AddSupplierMaterialDialog from "./add-supplier-material-dialog";
import UpdateSupplierMaterialDialog from "./update-supplier-material-dialog";

interface ManageSupplierMaterialsDialogProps {
    supplier: SupplierResponse | null;
    open: boolean;
    onClose: () => void;
}

export default function ManageSupplierMaterialsDialog({
    supplier,
    open,
    onClose,
}: ManageSupplierMaterialsDialogProps) {

    const [materials, setMaterials] = useState<SupplierMaterialResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchMaterials = useCallback(async () => {
        if (!supplier) return;
        setLoading(true);
        try {
            const response = await supplierMaterialService
                .getBySupplier(supplier.id);
            setMaterials(response.data);
        } catch {
            console.error("Failed to fetch supplier materials");
        } finally {
            setLoading(false);
        }
    }, [supplier]);

    useEffect(() => {
        if (open) fetchMaterials();
    }, [open, fetchMaterials]);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await supplierMaterialService.deleteSupplierMaterial(id);
            fetchMaterials();
        } catch {
            console.error("Failed to remove material");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Supplier Materials
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {supplier?.name} ({supplier?.code})
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end">
                    {supplier && (
                        <AddSupplierMaterialDialog
                            supplierId={supplier.id}
                            onSuccess={fetchMaterials}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-14 w-full" />
                        ))
                    ) : materials.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-8">
                            No materials linked to this supplier yet
                        </p>
                    ) : (
                        materials.map((material) => (
                            <div
                                key={material.id}
                                className="flex items-center justify-between
                                           gap-3 px-3 py-2.5 rounded-lg
                                           border border-cream-200">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-medium text-text-primary">
                                            {material.rawMaterialName}
                                        </p>
                                        {material.isPreferred && (
                                            <Star size={12}
                                                className="text-gold-500 fill-gold-500" />
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted mt-0.5">
                                        {material.currency} {material.unitPrice.toLocaleString()}
                                        {" / "}{material.unit}
                                        {material.leadTimeDays != null &&
                                            ` · ${material.leadTimeDays} day lead time`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <UpdateSupplierMaterialDialog
                                        material={material}
                                        onSuccess={fetchMaterials}
                                    />

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        disabled={deletingId === material.id}
                                        onClick={() => handleDelete(material.id)}
                                        className="h-8 w-8 text-error hover:bg-error-light"
                                    >
                                        <Trash2 size={14} />
                                    </Button>

                                </div>
                            </div>
                        ))
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
}
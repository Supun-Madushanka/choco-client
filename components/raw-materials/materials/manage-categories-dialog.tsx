"use client";

import { useState } from "react";
import { rawMaterialCategoryService } from "@/services/raw-material-category-service";
import { RawMaterialCategoryResponse } from "@/types/raw-material-category";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tags, Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface ManageCategoriesDialogProps {
    onChange: () => void;
}

export default function ManageCategoriesDialog({
    onChange,
}: ManageCategoriesDialogProps) {

    const [open, setOpen] = useState(false);
    const [categories, setCategories] =
        useState<RawMaterialCategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // New category form
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [adding, setAdding] = useState(false);

    // Editing state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            fetchCategories();
            setNewName("");
            setNewDescription("");
            setEditingId(null);
            setError(null);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await rawMaterialCategoryService.getAllCategories();
            setCategories(response.data);
        } catch {
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setAdding(true);
        setError(null);
        try {
            await rawMaterialCategoryService.createCategory({
                name: newName,
                description: newDescription || undefined,
            });
            setNewName("");
            setNewDescription("");
            await fetchCategories();
            onChange();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to add category");
            }
        } finally {
            setAdding(false);
        }
    };

    const startEdit = (category: RawMaterialCategoryResponse) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditDescription(category.description || "");
    };

    const handleSaveEdit = async (id: number) => {
        if (!editName.trim()) return;
        setSaving(true);
        setError(null);
        try {
            await rawMaterialCategoryService.updateCategory(id, {
                name: editName,
                description: editDescription || undefined,
            });
            setEditingId(null);
            await fetchCategories();
            onChange();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to update category");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setError(null);
        try {
            await rawMaterialCategoryService.deleteCategory(id);
            await fetchCategories();
            onChange();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to delete category — it may have materials linked to it"
                );
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button
                variant="outline"
                onClick={() => handleOpenChange(true)}
                className="border-cream-200 gap-2 text-text-secondary">
                <Tags size={15} />
                Manage Categories
            </Button>

            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Manage Categories
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Add, edit, or remove raw material categories.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-error-light border border-error/20
                                    text-error rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {/* Add new */}
                <div className="space-y-2 bg-cream-50 border border-cream-200
                                rounded-lg p-3">
                    <Label className="text-text-primary text-xs font-semibold
                                       uppercase tracking-wider">
                        New Category
                    </Label>
                    <Input
                        placeholder="Category name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border-cream-200 focus-visible:ring-gold-500 bg-white"
                    />
                    <Textarea
                        placeholder="Description (optional)"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        rows={2}
                        className="border-cream-200 focus-visible:ring-gold-500
                                   bg-white resize-none"
                    />
                    <Button
                        onClick={handleAdd}
                        disabled={adding || !newName.trim()}
                        className="w-full bg-gold-500 hover:bg-gold-400
                                   text-white gap-1">
                        <Plus size={15} />
                        {adding ? "Adding..." : "Add Category"}
                    </Button>
                </div>

                <Separator />

                {/* List */}
                <div className="max-h-72 overflow-y-auto space-y-2">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))
                    ) : categories.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-6">
                            No categories yet
                        </p>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="px-3 py-2.5 rounded-lg border border-cream-200">
                                {editingId === category.id ? (
                                    <div className="space-y-2">
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Category name"
                                            className="h-8 text-sm border-cream-200
                                                       focus-visible:ring-gold-500"
                                        />
                                        <Textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            placeholder="Description (optional)"
                                            rows={2}
                                            className="text-sm border-cream-200
                                                       focus-visible:ring-gold-500 resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                disabled={saving}
                                                onClick={() => handleSaveEdit(category.id)}
                                                className="flex-1 h-8 bg-gold-500 hover:bg-gold-400 text-white gap-1">
                                                <Check size={13} />
                                                {saving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 h-8 border-cream-200 gap-1">
                                                <X size={13} />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary">
                                                {category.name}
                                            </p>
                                            <p className="text-xs text-text-muted mt-0.5">
                                                {category.description || (
                                                    <span className="italic">No description</span>
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => startEdit(category)}
                                            className="h-7 w-7 text-text-muted shrink-0">
                                            <Pencil size={13} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDelete(category.id)}
                                            className="h-7 w-7 text-error
                                                       hover:bg-error-light shrink-0">
                                            <Trash2 size={13} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
}
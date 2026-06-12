"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user-service";
import { RoleResponse, SendInvitationRequest } from "@/types/user";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";

interface InviteUserDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function InviteUserDialog({
    open,
    onClose,
    onSuccess,
}: InviteUserDialogProps) {

    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [formData, setFormData] = useState<SendInvitationRequest>({
        email: "",
        roleId: 0,
    });
    const [loading, setLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Fetch roles when dialog opens
    useEffect(() => {
        if (open) {
            fetchRoles();
            // Reset form
            setFormData({ email: "", roleId: 0 });
            setError(null);
            setSuccess(false);
        }
    }, [open]);

    const fetchRoles = async () => {
        setRolesLoading(true);
        try {
            const response = await userService.getAllRoles();
            // Exclude SUPER_ADMIN from invitation
            const filtered = response.data.filter(
                (r) => r.name !== "SUPER_ADMIN"
            );
            setRoles(filtered);
        } catch {
            setError("Failed to load roles");
        } finally {
            setRolesLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email) {
            setError("Email is required");
            return;
        }

        if (!formData.roleId) {
            setError("Please select a role");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await userService.sendInvitation(formData);
            setSuccess(true);
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to send invitation"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getLevelBadgeClass = (level: string) => {
        switch (level) {
            case "TOP":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "MANAGER":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "STAFF":
                return "bg-cream-100 text-text-secondary border-cream-200";
            default:
                return "bg-cream-100 text-text-secondary";
        }
    };

    // Group roles by level
    const managerRoles = roles.filter((r) => r.level === "MANAGER");
    const staffRoles = roles.filter((r) => r.level === "STAFF");

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Invite New User
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Send an invitation email to add a new user
                        to the system.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="text-center py-6 space-y-3">
                        <div className="w-14 h-14 bg-success-light
                                        rounded-full flex items-center
                                        justify-center mx-auto">
                            <Send size={24} className="text-success" />
                        </div>
                        <p className="font-semibold text-text-primary">
                            Invitation Sent!
                        </p>
                        <p className="text-sm text-text-muted">
                            An invitation email has been sent to{" "}
                            <span className="font-medium text-text-primary">
                                {formData.email}
                            </span>
                        </p>
                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 border-cream-200"
                                onClick={() => {
                                    setSuccess(false);
                                    setFormData({ email: "", roleId: 0 });
                                }}>
                                Invite Another
                            </Button>
                            <Button
                                className="flex-1 bg-gold-500 hover:bg-gold-400 text-white"
                                onClick={onSuccess}>
                                Done
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Error */}
                        {error && (
                            <div className="bg-error-light border border-error/20
                                            text-error rounded-lg px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Email Address
                            </Label>
                            <Input
                                type="email"
                                placeholder="user@ceylonchocolate.lk"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    });
                                    setError(null);
                                }}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Role
                            </Label>
                            <Select
                                disabled={rolesLoading}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        roleId: parseInt(value),
                                    })
                                }>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue
                                        placeholder={
                                            rolesLoading
                                                ? "Loading roles..."
                                                : "Select a role"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>

                                    {/* Manager roles */}
                                    {managerRoles.length > 0 && (
                                        <>
                                            <div className="px-2 py-1.5">
                                                <p className="text-xs font-semibold
                                                              uppercase tracking-wider
                                                              text-text-muted">
                                                    Managers
                                                </p>
                                            </div>
                                            {managerRoles.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={String(role.id)}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{role.displayName}</span>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getLevelBadgeClass(role.level)}`}>
                                                            {role.level}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}

                                    {/* Staff roles */}
                                    {staffRoles.length > 0 && (
                                        <>
                                            <div className="px-2 py-1.5 mt-1">
                                                <p className="text-xs font-semibold
                                                              uppercase tracking-wider
                                                              text-text-muted">
                                                    Staff
                                                </p>
                                            </div>
                                            {staffRoles.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={String(role.id)}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{role.displayName}</span>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getLevelBadgeClass(role.level)}`}>
                                                            {role.level}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}

                                </SelectContent>
                            </Select>
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
                                className="flex-1 bg-gold-500 hover:bg-gold-400
                                           text-white gap-2">
                                <Send size={15} />
                                {loading ? "Sending..." : "Send Invitation"}
                            </Button>
                        </div>

                    </form>
                )}

            </DialogContent>
        </Dialog>
    );
}
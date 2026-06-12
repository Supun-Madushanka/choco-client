export interface UserResponse {
    userId: number;
    fullName: string;
    email: string;
    phone: string | null;
    profileImage: string | null;
    role: string;
    roleDisplayName: string;
    roleLevel: string;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface RoleResponse {
    id: number;
    name: string;
    displayName: string;
    level: string;
    description: string | null;
}

export interface SendInvitationRequest {
    email: string;
    roleId: number;
}

export interface InvitationResponse {
    id: number;
    email: string;
    roleName: string;
    roleDisplayName: string;
    invitedByName: string;
    status: string;
    expiresAt: string;
    createdAt: string;
}


export interface AcceptInvitationRequest {
    token: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    phone?: string;
}
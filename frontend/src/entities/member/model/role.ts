export const MEMBER_ROLES = {
    OWNER: "OWNER",
    EDITOR: "EDITOR",
    VIEWER: "VIEWER",
} as const;

export type MemberRole = keyof typeof MEMBER_ROLES;

export const ROLE_LABELS = {
    [MEMBER_ROLES.OWNER]: "Owner",
    [MEMBER_ROLES.EDITOR]: "Editor",
    [MEMBER_ROLES.VIEWER]: "Viewer",
} as const; 
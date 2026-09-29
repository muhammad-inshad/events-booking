export type UserRole = 'user' | 'event_owner' | 'admin';

export interface UpdateUserRoleDTO {
  role: UserRole;
}

export interface ToggleUserBlockDTO {
  isBlocked: boolean;
}

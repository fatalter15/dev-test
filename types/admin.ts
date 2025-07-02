export interface Admin {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Moderator"
  status: "aktif" | "tidak_aktif" | "menunggu"
  lastLogin: string
  registrationMethod: "google" | "manual"
  createdAt: string
  updatedAt?: string
  avatar?: string
  phone?: string
  permissions?: Permission[]
  twoFactorEnabled?: boolean
  lastPasswordChange?: string
}

export interface CreateAdminRequest {
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Moderator"
  registrationMethod: "google" | "manual"
  password?: string
  phone?: string
  permissions?: string[]
}

export interface UpdateAdminRequest extends Partial<CreateAdminRequest> {
  id: string
  status?: "aktif" | "tidak_aktif" | "menunggu"
}

export interface AdminStats {
  totalAdmins: number
  activeAdmins: number
  pendingAdmins: number
  inactiveAdmins: number
  superAdmins: number
  regularAdmins: number
  moderators: number
}

export interface AdminFilters {
  search?: string
  role?: "all" | "Super Admin" | "Admin" | "Moderator"
  status?: "all" | "aktif" | "tidak_aktif" | "menunggu"
  registrationMethod?: "all" | "google" | "manual"
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
  action: "create" | "read" | "update" | "delete" | "manage"
}

export interface AdminSession {
  id: string
  adminId: string
  token: string
  expiresAt: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
  isActive: boolean
}

export interface LoginRequest {
  email: string
  password?: string
  method: "standard" | "google"
  googleToken?: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  admin?: Admin
  token?: string
  expiresAt?: string
  message?: string
  requiresTwoFactor?: boolean
}

export interface AdminActivity {
  id: string
  adminId: string
  action: string
  module: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

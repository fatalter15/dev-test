export interface SystemSettings {
  id: string
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  timezone: string
  dateFormat: string
  timeFormat: string
  currency: string
  language: string
  theme: "light" | "dark" | "auto"
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailVerificationRequired: boolean
  twoFactorRequired: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  updatedAt: string
  updatedBy: string
}

export interface EmailSettings {
  id: string
  provider: "smtp" | "sendgrid" | "mailgun" | "ses"
  host?: string
  port?: number
  username?: string
  password?: string
  encryption?: "tls" | "ssl" | "none"
  fromEmail: string
  fromName: string
  replyToEmail?: string
  apiKey?: string
  domain?: string
  region?: string
  enabled: boolean
  testMode: boolean
  updatedAt: string
  updatedBy: string
}

export interface StorageSettings {
  id: string
  provider: "local" | "s3" | "gcs" | "azure"
  bucket?: string
  region?: string
  accessKey?: string
  secretKey?: string
  endpoint?: string
  publicUrl?: string
  maxFileSize: number
  allowedFileTypes: string[]
  enabled: boolean
  updatedAt: string
  updatedBy: string
}

export interface NotificationSettings {
  id: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  newCustomerNotification: boolean
  newPropertyNotification: boolean
  transactionNotification: boolean
  campaignNotification: boolean
  systemAlerts: boolean
  weeklyReports: boolean
  monthlyReports: boolean
  updatedAt: string
  updatedBy: string
}

export interface SecuritySettings {
  id: string
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    preventReuse: number
    expiryDays: number
  }
  sessionPolicy: {
    timeout: number
    maxConcurrentSessions: number
    requireReauth: boolean
  }
  loginPolicy: {
    maxAttempts: number
    lockoutDuration: number
    requireCaptcha: boolean
  }
  twoFactorAuth: {
    required: boolean
    methods: ("sms" | "email" | "app")[]
  }
  ipWhitelist: string[]
  auditLogging: boolean
  updatedAt: string
  updatedBy: string
}

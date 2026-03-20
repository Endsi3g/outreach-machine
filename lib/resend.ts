import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY || ""

/**
 * Resend client for sending transactional emails.
 */
export const resend = new Resend(resendApiKey)

/**
 * Default sender email address.
 */
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

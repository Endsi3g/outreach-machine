import { Resend } from "resend"

/**
 * Lazy initialization of the Resend client to avoid build-time errors
 * when the API key is missing.
 */
let resendClient: Resend | null = null

export const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey && process.env.NODE_ENV === "production") {
    console.warn("⚠️ RESEND_API_KEY is missing in production environment.")
  }
  
  if (!resendClient) {
    resendClient = new Resend(apiKey || "re_dummy_for_build")
  }
  return resendClient
}

/**
 * Resend client proxy or export the getter.
 * For simpler migration, we export a proxy-like object or just the getter.
 */
export const resend = {
  get emails() {
    return getResendClient().emails
  },
  get batch() {
    return getResendClient().batch
  },
  get contacts() {
    return getResendClient().contacts
  },
  get domains() {
    return getResendClient().domains
  },
  get apiKeys() {
    return getResendClient().apiKeys
  },
  get audiences() {
    return getResendClient().audiences
  }
}

/**
 * Default sender email address.
 */
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

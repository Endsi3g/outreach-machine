import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto"

const ALGORITHM = "aes-256-gcm"

function getKey(): Buffer {
  const secret = process.env.NEXTAUTH_SECRET || "outreach-machine-default-key"
  return scryptSync(secret, "outreach-salt", 32)
}

/**
 * Encrypt a plaintext string (e.g. an API key).
 * Returns a combined string: iv:authTag:ciphertext (all hex-encoded).
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return ""
  const key = getKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(plaintext, "utf8", "hex")
  encrypted += cipher.final("hex")
  const authTag = cipher.getAuthTag().toString("hex")

  return `${iv.toString("hex")}:${authTag}:${encrypted}`
}

/**
 * Decrypt a string previously encrypted with encrypt().
 */
export function decrypt(encryptedStr: string): string {
  if (!encryptedStr) return ""
  try {
    const [ivHex, authTagHex, ciphertext] = encryptedStr.split(":")
    const key = getKey()
    const iv = Buffer.from(ivHex, "hex")
    const authTag = Buffer.from(authTagHex, "hex")
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(ciphertext, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch {
    return ""
  }
}

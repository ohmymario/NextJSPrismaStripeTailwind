export async function IsValidPassword(password: string, hashedPassword: string) {
  return await hashPassword(password) === hashedPassword
}

async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Buffer.from(arrayBuffer).toString('base64')
}
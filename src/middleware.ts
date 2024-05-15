import { NextRequest } from "next/server";
import { IsValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
  const authStatus = await isAuthenticated(req)

  if (authStatus === false) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" }
    })
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization')

  // No Authorization 
  if (authHeader === null) return Promise.resolve(false)

  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8')
  const [username, password] = credentials.split(':')

  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.HASHED_ADMIN_PASSWORD;

  const checkUserName = username === envUsername
  const checkPassword = await IsValidPassword(password, envPassword as string)

  return checkUserName && checkPassword

}

export const config = {
  matcher: "/admin/:path*",
};

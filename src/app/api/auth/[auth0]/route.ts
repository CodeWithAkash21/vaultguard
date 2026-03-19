import { handleAuth, handleLogin } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

const authHandler = handleAuth({
  login: handleLogin({
    authorizationParams: {
      scope: 'openid profile email',
      connection: 'google-oauth2',
      access_type: 'offline',
      prompt: 'consent',
    },
  }),
})

export async function GET(request: NextRequest, props: { params: Promise<{ auth0: string }> }) {
  const params = await props.params
  return authHandler(request, { params })
}

export async function POST(request: NextRequest, props: { params: Promise<{ auth0: string }> }) {
  const params = await props.params
  return authHandler(request, { params })
}

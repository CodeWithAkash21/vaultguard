import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { appId, appName, confirmed } = await req.json()

    if (!appId || !appName) {
      return NextResponse.json({ error: 'Missing appId or appName' }, { status: 400 })
    }

    // Step-up auth check — in production this would verify a CIBA approval
    // For the demo, we require the `confirmed` flag which is set after the
    // user completes the step-up confirmation dialog in the UI
    if (!confirmed) {
      return NextResponse.json({
        requiresStepUp: true,
        message: 'Step-up authentication required before revoking access',
        appId,
        appName,
      }, { status: 202 })
    }

    // In production: call Google's token revocation endpoint using the Token Vault token
    // const { accessToken } = await getAccessToken()
    // await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, { method: 'POST' })

    // Simulate revocation delay
    await new Promise(resolve => setTimeout(resolve, 800))

    return NextResponse.json({
      success: true,
      message: `Access revoked for ${appName}`,
      appId,
      revokedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revoke error:', error)
    return NextResponse.json({ error: 'Failed to revoke access' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

// Scope risk database - explains what each Google scope actually does
const SCOPE_EXPLANATIONS: Record<string, { label: string; risk: 'low' | 'medium' | 'high' }> = {
  'https://www.googleapis.com/auth/gmail.readonly': { label: 'Read all your emails', risk: 'medium' },
  'https://www.googleapis.com/auth/gmail.modify': { label: 'Read, modify, and delete emails', risk: 'high' },
  'https://www.googleapis.com/auth/gmail.compose': { label: 'Compose and send emails as you', risk: 'high' },
  'https://mail.google.com/': { label: 'Full Gmail access — read, send, delete everything', risk: 'high' },
  'https://www.googleapis.com/auth/calendar': { label: 'Full access to your calendar', risk: 'medium' },
  'https://www.googleapis.com/auth/calendar.readonly': { label: 'Read your calendar events', risk: 'low' },
  'https://www.googleapis.com/auth/drive': { label: 'Full access to all your Google Drive files', risk: 'high' },
  'https://www.googleapis.com/auth/drive.readonly': { label: 'Read all files in your Google Drive', risk: 'medium' },
  'https://www.googleapis.com/auth/drive.file': { label: 'Access files this app created in Drive', risk: 'low' },
  'https://www.googleapis.com/auth/contacts': { label: 'View and manage your contacts', risk: 'medium' },
  'https://www.googleapis.com/auth/contacts.readonly': { label: 'View your contacts', risk: 'low' },
  'https://www.googleapis.com/auth/userinfo.email': { label: 'View your email address', risk: 'low' },
  'https://www.googleapis.com/auth/userinfo.profile': { label: 'View your basic profile info', risk: 'low' },
  'openid': { label: 'Verify your identity', risk: 'low' },
  'profile': { label: 'View your basic profile', risk: 'low' },
  'email': { label: 'View your email address', risk: 'low' },
}

// Mock data for demo purposes (Google's actual token API requires special setup)
const MOCK_APPS = [
  {
    id: 'app_slack',
    name: 'Slack',
    scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    lastUsed: '2 hours ago',
    icon: 'S',
  },
  {
    id: 'app_notion',
    name: 'Notion',
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.email'],
    lastUsed: '1 day ago',
    icon: 'N',
  },
  {
    id: 'app_zapier',
    name: 'Zapier',
    scopes: ['https://mail.google.com/', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/contacts'],
    lastUsed: '3 days ago',
    icon: 'Z',
  },
  {
    id: 'app_grammarly',
    name: 'Grammarly',
    scopes: ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/userinfo.email'],
    lastUsed: '1 week ago',
    icon: 'G',
  },
  {
    id: 'app_calendly',
    name: 'Calendly',
    scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    lastUsed: '2 weeks ago',
    icon: 'C',
  },
  {
    id: 'app_olddating',
    name: 'DatingApp2019',
    scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/contacts', 'https://www.googleapis.com/auth/gmail.modify'],
    lastUsed: '4 years ago',
    icon: '?',
  },
]

async function analyzeAppWithAI(appName: string, scopes: string[]): Promise<{ summary: string; recommendation: string }> {
  const responses: Record<string, { summary: string; recommendation: string }> = {
    'Zapier': {
      summary: 'Can read, send and delete emails and trigger automations on your behalf',
      recommendation: 'High exposure — revoke if you no longer use Zapier workflows'
    },
    'Grammarly': {
      summary: 'Can read and modify every email you write in Gmail',
      recommendation: 'Consider revoking — a writing tool rarely needs full Gmail modify access'
    },
    'DatingApp2019': {
      summary: 'Has full Drive, Contacts and Gmail access from 4 years ago',
      recommendation: 'Revoke immediately — abandoned apps are a major security risk'
    },
    'Calendly': {
      summary: 'Can view and create calendar events on your behalf',
      recommendation: 'Reasonable scope for a scheduling tool — safe to keep if still in use'
    },
    'Slack': {
      summary: 'Can view your email address and basic profile only',
      recommendation: 'Minimal permissions — low risk, safe to keep'
    },
    'Notion': {
      summary: 'Can access files it created in your Drive and your email address',
      recommendation: 'Scoped appropriately for a notes app — safe to keep'
    },
  }
  return responses[appName] ?? {
    summary: 'Can access your Google account data based on granted scopes',
    recommendation: 'Review this app if you no longer use it actively'
  }
}

function getRiskLevel(scopes: string[]): 'low' | 'medium' | 'high' {
  const risks = scopes.map(s => SCOPE_EXPLANATIONS[s]?.risk || 'low')
  if (risks.includes('high')) return 'high'
  if (risks.includes('medium')) return 'medium'
  return 'low'
}

export const GET = async (req: NextRequest) => {
  console.log('SCAN HIT — Starting mock analysis (API credits not required)')
  
  try {

    // Analyze each app with AI
    const analyzedApps = await Promise.all(
      MOCK_APPS.map(async (app) => {
        const aiAnalysis = await analyzeAppWithAI(app.name, app.scopes)
        const riskLevel = getRiskLevel(app.scopes)
        const scopeDetails = app.scopes.map(s => ({
          scope: s,
          label: SCOPE_EXPLANATIONS[s]?.label || s,
          risk: SCOPE_EXPLANATIONS[s]?.risk || 'low',
        }))

        return {
          ...app,
          riskLevel,
          scopeDetails,
          aiSummary: aiAnalysis.summary,
          aiRecommendation: aiAnalysis.recommendation,
        }
      })
    )

    // Sort by risk: high first
    const sorted = analyzedApps.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.riskLevel] - order[b.riskLevel]
    })

    return NextResponse.json({ apps: sorted })
  } catch (error) {
    console.error('Scan error:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error) console.error('Stack:', error.stack)
    return NextResponse.json({ error: 'Failed to scan permissions' }, { status: 500 })
  }
}

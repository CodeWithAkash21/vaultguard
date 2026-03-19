'use client'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import AppCard from '@/components/AppCard'
import StepUpModal from '@/components/StepUpModal'

interface ScopeDetail {
  scope: string
  label: string
  risk: 'low' | 'medium' | 'high'
}

interface App {
  id: string
  name: string
  icon: string
  riskLevel: 'low' | 'medium' | 'high'
  scopeDetails: ScopeDetail[]
  aiSummary: string
  aiRecommendation: string
  lastUsed: string
}

export default function Dashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [apps, setApps] = useState<App[]>([])
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [revokedIds, setRevokedIds] = useState<Set<string>>(new Set())
  const [stepUp, setStepUp] = useState<{ appId: string; appName: string } | null>(null)
  const [scanError, setScanError] = useState('')

  useEffect(() => {
    if (!isLoading && !user) router.push('/')
  }, [user, isLoading, router])

  const runScan = useCallback(async () => {
    setScanning(true)
    setScanError('')
    try {
      const res = await fetch('/api/scan')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setApps(data.apps)
      setScanned(true)
    } catch (e) {
      setScanError('Scan failed. Check your API keys and try again.')
    } finally {
      setScanning(false)
    }
  }, [])

  const handleRevoke = useCallback((appId: string, appName: string) => {
    setStepUp({ appId, appName })
  }, [])

  const handleStepUpConfirm = useCallback(async () => {
    if (!stepUp) return
    setStepUp(null)

    try {
      const res = await fetch('/api/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: stepUp.appId, appName: stepUp.appName, confirmed: true }),
      })
      const data = await res.json()
      if (data.success) {
        setRevokedIds(prev => new Set([...prev, stepUp.appId]))
      }
    } catch (e) {
      console.error('Revoke failed:', e)
    }
  }, [stepUp])

  if (isLoading || !user) return null

  const highRiskCount = apps.filter(a => a.riskLevel === 'high' && !revokedIds.has(a.id)).length
  const medRiskCount = apps.filter(a => a.riskLevel === 'medium' && !revokedIds.has(a.id)).length
  const activeApps = apps.filter(a => !revokedIds.has(a.id)).length

  return (
    <main className="scanlines min-h-screen bg-bg">
      {/* Step-up modal */}
      {stepUp && (
        <StepUpModal
          appName={stepUp.appName}
          onConfirm={handleStepUpConfirm}
          onCancel={() => setStepUp(null)}
        />
      )}

      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="border border-accent/30 p-1.5 rounded-sm">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 8V16C4 22.627 9.373 28 16 30C22.627 28 28 22.627 28 16V8L16 2Z" stroke="#00ff87" strokeWidth="2" fill="none"/>
              <path d="M12 16L15 19L21 13" stroke="#00ff87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-mono text-sm font-medium">VAULT<span className="text-accent">GUARD</span></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-xs text-muted">Token Vault Active</span>
          </div>
          <div className="font-mono text-xs text-muted border border-border px-3 py-1.5 rounded-sm">
            {user.email}
          </div>
          <a href="/api/auth/logout" className="font-mono text-xs text-muted hover:text-white transition-colors">
            logout
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="font-mono text-xs text-muted tracking-widest uppercase mb-2">
            OAuth Permission Audit
          </div>
          <h1 className="font-mono text-2xl font-light mb-1">
            Hello, <span className="text-accent">{user.name?.split(' ')[0]}</span>
          </h1>
          <p className="font-mono text-sm text-muted">
            {scanned
              ? `Found ${apps.length} connected apps · ${highRiskCount > 0 ? `${highRiskCount} high-risk` : 'no high-risk apps'}`
              : 'Run a scan to audit your connected OAuth permissions'}
          </p>
        </div>

        {/* Stats row — shown after scan */}
        {scanned && (
          <div className="grid grid-cols-3 gap-3 mb-8 stagger-children">
            <div className="border border-border rounded-sm p-4 text-center">
              <div className="font-mono text-2xl font-light text-white mb-1">{activeApps}</div>
              <div className="font-mono text-xs text-muted">Connected apps</div>
            </div>
            <div className={`border rounded-sm p-4 text-center ${highRiskCount > 0 ? 'border-danger/40 glow-danger' : 'border-border'}`}>
              <div className={`font-mono text-2xl font-light mb-1 ${highRiskCount > 0 ? 'text-danger' : 'text-white'}`}>{highRiskCount}</div>
              <div className="font-mono text-xs text-muted">High risk</div>
            </div>
            <div className={`border rounded-sm p-4 text-center ${medRiskCount > 0 ? 'border-warn/30' : 'border-border'}`}>
              <div className={`font-mono text-2xl font-light mb-1 ${medRiskCount > 0 ? 'text-warn' : 'text-white'}`}>{medRiskCount}</div>
              <div className="font-mono text-xs text-muted">Medium risk</div>
            </div>
          </div>
        )}

        {/* Scan button / state */}
        {!scanned && (
          <div className="border border-border rounded-sm p-10 text-center mb-8 fade-in">
            {scanning ? (
              <div>
                <div className="relative w-48 h-1 bg-border mx-auto mb-6 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-accent origin-left animate-pulse" />
                </div>
                <div className="font-mono text-xs text-muted">
                  Fetching permissions via Auth0 Token Vault
                  <span className="cursor-blink">_</span>
                </div>
                <div className="font-mono text-xs text-muted/60 mt-1">
                  Running AI analysis on each app...
                </div>
              </div>
            ) : (
              <div>
                <div className="font-mono text-sm text-muted mb-6 leading-relaxed">
                  VaultGuard will fetch all apps connected to your Google account,
                  analyse their permissions with AI, and rate each one for risk.
                </div>
                {scanError && (
                  <div className="font-mono text-xs text-danger border border-danger/30 rounded-sm p-3 mb-4">
                    {scanError}
                  </div>
                )}
                <button
                  onClick={runScan}
                  className="inline-flex items-center gap-2 bg-accent text-bg font-mono font-medium text-sm px-8 py-3 rounded-sm hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-[0.98] glow-accent"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  Start Permission Scan
                </button>
              </div>
            )}
          </div>
        )}

        {/* App list */}
        {scanned && (
          <div className="space-y-3 stagger-children">
            {apps.map(app => (
              <AppCard
                key={app.id}
                {...app}
                onRevoke={handleRevoke}
                revoked={revokedIds.has(app.id)}
              />
            ))}
          </div>
        )}

        {/* Revoked count */}
        {revokedIds.size > 0 && (
          <div className="mt-6 text-center fade-in">
            <span className="font-mono text-xs text-safe border border-safe/30 px-3 py-1.5 rounded-sm">
              ✓ {revokedIds.size} app{revokedIds.size > 1 ? 's' : ''} revoked this session
            </span>
          </div>
        )}

        {/* Auth0 badge */}
        <div className="mt-12 pt-6 border-t border-border flex items-center justify-center gap-3 opacity-40">
          <div className="w-1 h-1 rounded-full bg-accent" />
          <span className="font-mono text-xs text-muted">Secured by Auth0 Token Vault + CIBA Step-Up Auth</span>
          <div className="w-1 h-1 rounded-full bg-accent" />
        </div>
      </div>
    </main>
  )
}

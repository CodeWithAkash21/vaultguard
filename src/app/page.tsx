'use client'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  if (isLoading) return null

  return (
    <main className="scanlines min-h-screen bg-bg flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#00ff87 1px, transparent 1px), linear-gradient(90deg, #00ff87 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-accent font-mono text-xs text-muted opacity-40">
        VAULTGUARD_v0.1 // SYSTEM ONLINE
      </div>
      <div className="absolute top-8 right-8 text-muted font-mono text-xs opacity-40">
        AUTH0 TOKEN VAULT ENABLED
      </div>
      <div className="absolute bottom-8 left-8 text-muted font-mono text-xs opacity-40">
        ENCRYPTION: AES-256-GCM
      </div>
      <div className="absolute bottom-8 right-8 text-muted font-mono text-xs opacity-40">
        REGION: US-EAST
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-xl fade-in">
        {/* Logo mark */}
        <div className="mb-8 inline-flex items-center justify-center w-16 h-16 border border-accent/30 rounded-sm glow-accent">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L4 8V16C4 22.627 9.373 28 16 30C22.627 28 28 22.627 28 16V8L16 2Z" stroke="#00ff87" strokeWidth="1.5" fill="none"/>
            <path d="M12 16L15 19L21 13" stroke="#00ff87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Headline */}
        <h1 className="font-mono text-4xl font-light tracking-tight mb-2">
          VAULT<span className="text-accent">GUARD</span>
        </h1>
        <p className="text-muted font-mono text-sm mb-2 tracking-widest uppercase">
          OAuth Permission Intelligence
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-border" />
          <div className="w-1 h-1 bg-accent rounded-full" />
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Description */}
        <p className="text-muted text-sm leading-relaxed mb-2 font-mono">
          You've granted access to dozens of apps.
        </p>
        <p className="text-white/70 text-sm leading-relaxed mb-8 font-mono">
          VaultGuard audits every permission, rates the risk with AI,
          and lets you revoke dangerous access — protected by Auth0 step-up authentication.
        </p>

        {/* Stat pills */}
        <div className="flex justify-center gap-4 mb-10 text-xs font-mono">
          <div className="border border-border px-3 py-1.5 rounded-sm text-muted">
            <span className="text-accent">15–30</span> avg connected apps
          </div>
          <div className="border border-border px-3 py-1.5 rounded-sm text-muted">
            <span className="text-danger">43%</span> have write access
          </div>
          <div className="border border-border px-3 py-1.5 rounded-sm text-muted">
            <span className="text-warn">78%</span> never audited
          </div>
        </div>

        {/* CTA */}
        <a
          href="/api/auth/login"
          className="inline-flex items-center gap-3 bg-accent text-bg font-mono font-medium text-sm px-8 py-4 rounded-sm hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-[0.98] glow-accent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Connect with Google
        </a>

        <p className="mt-4 text-xs text-muted font-mono opacity-60">
          Secured by Auth0 Token Vault · No credentials stored
        </p>
      </div>
    </main>
  )
}

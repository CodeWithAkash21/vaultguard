'use client'
import { useState, useEffect } from 'react'

interface StepUpModalProps {
  appName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function StepUpModal({ appName, onConfirm, onCancel }: StepUpModalProps) {
  const [phase, setPhase] = useState<'warning' | 'confirm' | 'authenticating'>('warning')
  const [countdown, setCountdown] = useState(5)
  const [typed, setTyped] = useState('')
  const CONFIRM_WORD = 'REVOKE'

  useEffect(() => {
    if (phase === 'authenticating') {
      const timer = setTimeout(() => {
        onConfirm()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [phase, onConfirm])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md border border-danger/50 bg-bg rounded-sm glow-danger">

        {/* Header */}
        <div className="border-b border-danger/30 px-6 py-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-danger pulse-danger" />
          <span className="font-mono text-xs text-danger tracking-widest uppercase">
            Step-Up Authentication Required
          </span>
        </div>

        <div className="p-6">
          {phase === 'warning' && (
            <div className="fade-in">
              <div className="mb-6">
                <div className="font-mono text-sm text-muted mb-2">TARGET APPLICATION</div>
                <div className="font-mono text-xl text-white">{appName}</div>
              </div>

              <div className="border border-warn/30 bg-warn/5 rounded-sm p-4 mb-6">
                <p className="font-mono text-xs text-warn leading-relaxed">
                  ⚠ This action is <strong className="text-white">irreversible</strong>. Revoking access will immediately
                  disconnect {appName} from your Google account. Any automations or workflows
                  using this connection will stop working.
                </p>
              </div>

              <div className="font-mono text-xs text-muted mb-6 leading-relaxed">
                Auth0 will verify your identity via an out-of-band challenge before
                proceeding. This ensures only you can authorize this action — even if
                your browser session is compromised.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 border border-border py-3 font-mono text-sm text-muted hover:text-white hover:border-muted transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setPhase('confirm')}
                  className="flex-1 border border-danger/50 bg-danger/10 py-3 font-mono text-sm text-danger hover:bg-danger/20 transition-colors rounded-sm"
                >
                  Continue to verify →
                </button>
              </div>
            </div>
          )}

          {phase === 'confirm' && (
            <div className="fade-in">
              <div className="mb-6">
                <div className="font-mono text-sm text-muted mb-4">
                  Type <span className="text-white font-medium">{CONFIRM_WORD}</span> to confirm you want to revoke access for{' '}
                  <span className="text-white">{appName}</span>
                </div>
                <input
                  autoFocus
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value.toUpperCase())}
                  placeholder="Type REVOKE to confirm"
                  className="w-full bg-surface border border-border focus:border-danger/50 outline-none font-mono text-sm px-4 py-3 rounded-sm text-white placeholder:text-muted transition-colors"
                />
                {typed.length > 0 && typed !== CONFIRM_WORD.slice(0, typed.length) && (
                  <p className="mt-2 text-xs font-mono text-danger">Incorrect — type exactly: REVOKE</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 border border-border py-3 font-mono text-sm text-muted hover:text-white transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={typed !== CONFIRM_WORD}
                  onClick={() => setPhase('authenticating')}
                  className="flex-1 border border-danger bg-danger/10 py-3 font-mono text-sm text-danger hover:bg-danger/20 transition-colors rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Confirm revocation
                </button>
              </div>
            </div>
          )}

          {phase === 'authenticating' && (
            <div className="fade-in text-center py-4">
              <div className="font-mono text-xs text-muted mb-6 tracking-widest uppercase">
                Verifying via Auth0
              </div>

              {/* Scanning animation */}
              <div className="relative w-full h-20 border border-accent/20 rounded-sm overflow-hidden mb-6 bg-surface">
                <div className="scan-line absolute w-full h-1 bg-accent/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="font-mono text-xs text-accent">
                    IDENTITY VERIFICATION IN PROGRESS
                    <span className="cursor-blink">_</span>
                  </div>
                </div>
              </div>

              <p className="font-mono text-xs text-muted">
                Revoking access for <span className="text-white">{appName}</span>...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

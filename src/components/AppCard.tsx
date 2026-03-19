'use client'
import { useState } from 'react'

interface ScopeDetail {
  scope: string
  label: string
  risk: 'low' | 'medium' | 'high'
}

interface AppCardProps {
  id: string
  name: string
  icon: string
  riskLevel: 'low' | 'medium' | 'high'
  scopeDetails: ScopeDetail[]
  aiSummary: string
  aiRecommendation: string
  lastUsed: string
  onRevoke: (id: string, name: string) => void
  revoked: boolean
}

const RISK_CONFIG = {
  high: {
    label: 'HIGH RISK',
    color: 'text-danger',
    border: 'border-danger/30',
    bg: 'bg-danger/5',
    dot: 'bg-danger',
    glow: 'glow-danger',
    badge: 'border-danger/50 text-danger',
  },
  medium: {
    label: 'MEDIUM RISK',
    color: 'text-warn',
    border: 'border-warn/30',
    bg: 'bg-warn/5',
    dot: 'bg-warn',
    glow: 'glow-warn',
    badge: 'border-warn/50 text-warn',
  },
  low: {
    label: 'LOW RISK',
    color: 'text-safe',
    border: 'border-safe/20',
    bg: 'bg-safe/5',
    dot: 'bg-safe',
    glow: '',
    badge: 'border-safe/40 text-safe',
  },
}

export default function AppCard({
  id, name, icon, riskLevel, scopeDetails, aiSummary, aiRecommendation, lastUsed, onRevoke, revoked
}: AppCardProps) {
  const [expanded, setExpanded] = useState(riskLevel === 'high')
  const cfg = RISK_CONFIG[riskLevel]

  if (revoked) {
    return (
      <div className="border border-border rounded-sm p-4 opacity-40 fade-in">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-surface border border-border flex items-center justify-center font-mono text-xs text-muted">
            {icon}
          </div>
          <div>
            <div className="font-mono text-sm text-muted line-through">{name}</div>
            <div className="font-mono text-xs text-muted">Access revoked</div>
          </div>
          <div className="ml-auto font-mono text-xs text-safe">✓ REVOKED</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`border ${cfg.border} ${cfg.bg} rounded-sm ${riskLevel === 'high' ? cfg.glow : ''} transition-all duration-200`}>
      {/* Card header */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* App icon */}
        <div className="w-9 h-9 rounded-sm bg-surface border border-border flex items-center justify-center font-mono text-sm font-medium text-white flex-shrink-0">
          {icon}
        </div>

        {/* App info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-sm text-white">{name}</span>
            <span className={`font-mono text-[10px] border px-1.5 py-0.5 rounded-sm ${cfg.badge} ${riskLevel === 'high' ? 'pulse-danger' : ''}`}>
              {cfg.label}
            </span>
          </div>
          <div className="font-mono text-xs text-muted truncate">{aiSummary}</div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="font-mono text-xs text-muted">Last used</div>
            <div className="font-mono text-xs text-white/60">{lastUsed}</div>
          </div>
          <svg
            className={`w-3 h-3 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border/50 p-4 fade-in">
          {/* AI recommendation */}
          <div className="font-mono text-xs text-muted mb-1">AI ANALYSIS</div>
          <div className="font-mono text-xs text-white/70 mb-4 leading-relaxed border-l-2 border-accent/30 pl-3">
            {aiRecommendation}
          </div>

          {/* Scopes list */}
          <div className="font-mono text-xs text-muted mb-2">GRANTED PERMISSIONS ({scopeDetails.length})</div>
          <div className="space-y-1.5 mb-4">
            {scopeDetails.map((scope) => (
              <div key={scope.scope} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                  scope.risk === 'high' ? 'bg-danger' :
                  scope.risk === 'medium' ? 'bg-warn' : 'bg-safe'
                }`} />
                <span className="font-mono text-xs text-white/60">{scope.label}</span>
              </div>
            ))}
          </div>

          {/* Revoke button */}
          <button
            onClick={() => onRevoke(id, name)}
            className="w-full border border-danger/40 bg-danger/5 hover:bg-danger/15 text-danger font-mono text-xs py-2.5 rounded-sm transition-all hover:border-danger/70 active:scale-[0.99]"
          >
            Revoke access to {name} →
          </button>
        </div>
      )}
    </div>
  )
}

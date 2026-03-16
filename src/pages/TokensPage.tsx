import { useAppSelector, useAppDispatch } from '../store/hooks'
import { adjustTokens } from '../store/spantestSlice'
import styles from './TokensPage.module.scss'

// ─── Icon helpers ────────────────────────────────────────────────────────────
function BoltIcon({ color = 'currentColor', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8 1L3 8h4l-1 5 6-7H8l1-5z" fill={color} />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({
  pct,
  color,
  bg = 'rgba(0,0,0,0.07)',
  height = 6,
}: {
  pct: number
  color: string
  bg?: string
  height?: number
}) {
  return (
    <div style={{ width: '100%', height, borderRadius: 999, background: bg, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.min(100, pct)}%`,
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  )
}

const USAGE_ROWS = [
  { label: 'Batch generation',   value: 340, pct: 45, color: '#7c3aed' },
  { label: 'Script generation',  value: 210, pct: 28, color: '#3b82f6' },
  { label: 'Clarifying questions', value: 130, pct: 17, color: '#10b981' },
  { label: 'Manual test cases',  value: 80,  pct: 11, color: '#f59e0b' },
]

const COST_ROWS = [
  { label: 'Generate batch (scenarios + test cases)', cost: 50,   free: false },
  { label: 'Generate script from selection',          cost: 10,   free: false },
  { label: 'AI clarifying question',                  cost: 2,    free: false },
  { label: 'Manual test case (no AI)',                cost: 0,    free: true  },
]

const ACTIVITY = [
  { label: 'Batch generation',    date: 'Mar 14', delta: -50,   bal: 9450,  type: 'batch' },
  { label: 'Script generation',   date: 'Mar 13', delta: -10,   bal: 9500,  type: 'script' },
  { label: 'Clarifying questions',date: 'Mar 12', delta: -6,    bal: 9510,  type: 'clarify' },
  { label: 'Batch generation',    date: 'Mar 11', delta: -50,   bal: 9516,  type: 'batch' },
  { label: 'Top-up — Pro Pack',   date: 'Mar 10', delta: +2000, bal: 9566,  type: 'topup' },
  { label: 'Batch generation',    date: 'Mar 9',  delta: -50,   bal: 7566,  type: 'batch' },
]

const ACTIVITY_COLORS: Record<string, string> = {
  batch:   '#7c3aed',
  script:  '#3b82f6',
  clarify: '#10b981',
  topup:   '#16a34a',
}

function ActivityIcon({ type }: { type: string }) {
  const bg = type === 'topup' ? 'rgba(22,163,74,0.1)' : 'rgba(124,58,237,0.08)'
  const color = ACTIVITY_COLORS[type] ?? '#7c3aed'
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {type === 'topup'
        ? <ArrowUpIcon />
        : <BoltIcon color={color} size={14} />
      }
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function TokensPage() {
  const dispatch = useAppDispatch()
  const tokens = useAppSelector((s) => s.spantest.tokens)

  const usedPct = Math.round((760 / 1000) * 100)
  const balancePct = Math.round((tokens / 10000) * 100)

  return (
    <div className={styles.page}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.breadcrumb}>Account / Token Balance</div>
          <h1 className={styles.title}>Token Balance</h1>
          <p className={styles.subtitle}>Tokens power every AI feature — scenarios, test cases &amp; scripts</p>
        </div>
        <button
          className={styles.topUpBtn}
          onClick={() => document.getElementById('topup-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          + Top up tokens
        </button>
      </div>

      {/* ── Top Stats Row ────────────────────────────────────── */}
      <div className={styles.statsRow}>

        {/* Current Balance — purple card */}
        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>CURRENT BALANCE</div>
          <div className={styles.balanceNumber}>{tokens.toLocaleString()}</div>
          <div className={styles.balanceSub}>tokens remaining</div>
          <div style={{ margin: '14px 0 8px' }}>
            <ProgressBar pct={balancePct} color="rgba(255,255,255,0.7)" bg="rgba(255,255,255,0.2)" height={5} />
          </div>
          <div className={styles.balanceMeta}>{balancePct}% of 10,000 token plan</div>
        </div>

        {/* Used This Month */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>USED THIS MONTH</div>
          <div className={styles.statNumber}>760</div>
          <div className={styles.statMeta}>of 1,000 monthly estimate</div>
          <div style={{ margin: '12px 0 8px' }}>
            <ProgressBar pct={usedPct} color="linear-gradient(90deg,#f59e0b,#ef4444)" bg="rgba(0,0,0,0.07)" height={6} />
          </div>
          <div className={styles.statFooter}>{usedPct}% used · 240 remaining</div>
        </div>

        {/* Current Plan */}
        <div className={styles.statCard}>
          <div className={styles.statLabel}>CURRENT PLAN</div>
          <div className={styles.planName}>Free</div>
          <div className={styles.planTagline}>Pay-as-you-go top-ups</div>
          <div className={styles.planDetails}>
            <div className={styles.planRow}><span>Token reset</span><span>Never</span></div>
            <div className={styles.planRow}><span>Rollover</span><span>Yes</span></div>
            <div className={styles.planRow}><span>Team seats</span><span>1</span></div>
          </div>
        </div>

      </div>

      {/* ── Middle Row: Usage + Cost ──────────────────────────── */}
      <div className={styles.midRow}>

        {/* Usage by action */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Usage by action</div>
          <div className={styles.usageList}>
            {USAGE_ROWS.map((row) => (
              <div key={row.label} className={styles.usageRow}>
                <div className={styles.usageTop}>
                  <span className={styles.usageLabel}>{row.label}</span>
                  <span className={styles.usageValue}>
                    {row.value}{' '}
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({row.pct}%)</span>
                  </span>
                </div>
                <ProgressBar pct={row.pct} color={row.color} bg="rgba(0,0,0,0.06)" height={5} />
              </div>
            ))}
          </div>
        </div>

        {/* Token cost per action */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Token cost per action</div>
          <div className={styles.costList}>
            {COST_ROWS.map((row) => (
              <div key={row.label} className={styles.costRow}>
                <span className={styles.costLabel}>{row.label}</span>
                {row.free ? (
                  <span className={styles.freeBadge}>Free</span>
                ) : (
                  <span className={styles.tokenBadge}>
                    {row.cost} <span style={{ opacity: 0.7 }}>tokens</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Up Tokens ─────────────────────────────────────── */}
      <div id="topup-section" className={styles.topUpSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Top up tokens</div>
          <div className={styles.sectionSub}>One-time packs — tokens never expire and roll over</div>
        </div>

        <div className={styles.pricingRow}>

          {/* Starter */}
          <div className={styles.pricingCard}>
            <div className={styles.pricingName}>Starter</div>
            <div className={styles.pricingTokens}>500</div>
            <div className={styles.pricingTokenLabel}>tokens</div>
            <div className={styles.pricingPrice}>$4.99</div>
            <div className={styles.pricingFreq}>one-time</div>
            <div className={styles.pricingPer}>$0.010 / token</div>
            <button className={styles.buyBtn} onClick={() => dispatch(adjustTokens(500))}>Buy Starter</button>
            <div className={styles.pricingNote}>Great for trying out the platform</div>
          </div>

          {/* Pro Pack — highlighted */}
          <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
            <div className={styles.popularBadge}>Most popular</div>
            <div className={styles.pricingName}>Pro Pack</div>
            <div className={styles.pricingTokens}>2,000</div>
            <div className={styles.pricingTokenLabel}>tokens</div>
            <div className={`${styles.pricingPrice} ${styles.pricingPriceAccent}`}>$14.99</div>
            <div className={styles.pricingFreq}>one-time</div>
            <div className={`${styles.pricingPer} ${styles.pricingPerAccent}`}>$0.0075 / token</div>
            <button className={`${styles.buyBtn} ${styles.buyBtnPrimary}`} onClick={() => dispatch(adjustTokens(2000))}>Buy Pro Pack</button>
            <div className={styles.pricingNote}>Most popular for individual devs</div>
          </div>

          {/* Team */}
          <div className={styles.pricingCard}>
            <div className={styles.pricingName}>Team</div>
            <div className={styles.pricingTokens}>10,000</div>
            <div className={styles.pricingTokenLabel}>tokens</div>
            <div className={styles.pricingPrice}>$49.99</div>
            <div className={styles.pricingFreq}>one-time</div>
            <div className={styles.pricingPer}>$0.0050 / token</div>
            <button className={styles.buyBtn} onClick={() => dispatch(adjustTokens(10000))}>Buy Team</button>
            <div className={styles.pricingNote}>Best value for teams &amp; power users</div>
          </div>
        </div>
      </div>

      {/* ── Recent Activity + Info side by side ──────────────── */}
      <div className={styles.bottomRow}>

        {/* Recent Activity */}
        <div className={styles.activitySection}>
          <div className={styles.sectionTitle} style={{ marginBottom: 4 }}>Recent activity</div>
          <div className={styles.activityList}>
            {ACTIVITY.map((item, i) => (
              <div key={i} className={styles.activityRow}>
                <ActivityIcon type={item.type} />
                <div className={styles.activityInfo}>
                  <div className={styles.activityLabel}>{item.label}</div>
                  <div className={styles.activityDate}>{item.date}</div>
                </div>
                <div className={styles.activityRight}>
                  <div
                    className={styles.activityDelta}
                    style={{ color: item.delta > 0 ? '#16a34a' : 'var(--text-primary)' }}
                  >
                    {item.delta > 0 ? '+' : ''}{item.delta.toLocaleString()}
                  </div>
                  <div className={styles.activityBal}>bal: {item.bal.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: info banner + token tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className={styles.infoBanner}>
            <span className={styles.infoHighlight}>How tokens work:</span>{' '}
            Each AI action costs tokens — 50 for a full generation batch, 10 for a script, 2 per clarifying question.
            Manual test cases are always free. Purchased tokens never expire and roll over forever.
          </div>

          <div className={styles.tipsCard}>
            <div className={styles.tipsTitle}>Tips to save tokens</div>
            <div className={styles.tipsList}>
              <div className={styles.tipRow}>
                <span className={styles.tipDot} style={{ background: '#7c3aed' }} />
                <span>Write detailed user stories to reduce clarifying questions</span>
              </div>
              <div className={styles.tipRow}>
                <span className={styles.tipDot} style={{ background: '#3b82f6' }} />
                <span>Reuse generated test cases across similar scenarios</span>
              </div>
              <div className={styles.tipRow}>
                <span className={styles.tipDot} style={{ background: '#10b981' }} />
                <span>Add manual test cases for simple flows — they're always free</span>
              </div>
              <div className={styles.tipRow}>
                <span className={styles.tipDot} style={{ background: '#f59e0b' }} />
                <span>Generate scripts only for test cases you're confident about</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default TokensPage

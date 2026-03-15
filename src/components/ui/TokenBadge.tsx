interface TokenBadgeProps {
  tokens: number
  onClick?: () => void
}

function TokenBadge({ tokens, onClick }: TokenBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 28,
        padding: '0 11px',
        border: '1px solid var(--accent-border)',
        borderRadius: 999,
        fontFamily: 'var(--font-display)',
        fontSize: 11.5,
        fontWeight: 600,
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        background: 'var(--accent-subtle)',
        transition: 'background 0.15s ease, box-shadow 0.15s ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'rgba(124,58,237,0.12)'
        el.style.boxShadow = '0 2px 10px rgba(124, 58, 237, 0.18)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'var(--accent-subtle)'
        el.style.boxShadow = 'none'
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="5" cy="5" r="2" fill="currentColor" />
      </svg>
      {tokens.toLocaleString()} tokens
    </button>
  )
}

export default TokenBadge


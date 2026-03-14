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
        padding: '0 12px',
        border: '1px solid var(--border-mid)',
        borderRadius: 999,
        fontSize: 12,
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        cursor: 'pointer',
        background: 'var(--surface)',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          background: 'var(--text-muted)',
          borderRadius: 999,
        }}
      />
      {tokens} tokens
    </button>
  )
}

export default TokenBadge


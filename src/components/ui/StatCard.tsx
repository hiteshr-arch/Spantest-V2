interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  description?: string
  accent?: string
  onClick?: () => void
}

function StatCard({ title, value, suffix, description, accent, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: 16,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '20px 20px 16px',
        minHeight: 116,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.18s ease, box-shadow 0.2s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        if (onClick) {
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = 'var(--shadow-lg)'
        } else {
          el.style.boxShadow = 'var(--shadow-md)'
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      {/* Left accent bar (DentalPro-inspired) */}
      {accent && (
        <div
          style={{
            position: 'absolute',
            top: 0, bottom: 0, left: 0,
            width: 3,
            background: accent,
            borderRadius: '16px 0 0 16px',
          }}
        />
      )}

      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {title}
      </span>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 34,
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {value}
          {suffix && (
            <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 5, color: 'var(--text-secondary)' }}>
              {suffix}
            </span>
          )}
        </div>

        {description && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: onClick ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: onClick ? 500 : 400,
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard


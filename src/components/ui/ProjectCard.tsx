interface ProjectCardProps {
  name: string
  meta: string
  tags: string[]
  onClick: () => void
  dashed?: boolean
  status?: 'active' | 'idle' | 'stale'
}

function ProjectCard({ name, meta, tags, onClick, dashed, status = 'active' }: ProjectCardProps) {
  if (dashed) {
    return (
      <div
        onClick={onClick}
        style={{
          minHeight: 148,
          border: '1px dashed var(--border-mid)',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          background: 'var(--accent-subtle)',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(124, 58, 237, 0.35)'
          el.style.background = 'rgba(124, 58, 237, 0.07)'
          el.style.boxShadow = 'var(--shadow-md)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border-mid)'
          el.style.background = 'var(--accent-subtle)'
          el.style.boxShadow = 'none'
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: '#fff',
            fontWeight: 300,
          }}
        >
          +
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--accent-hover)',
          }}
        >
          New Project
        </span>
      </div>
    )
  }

  const statusColor =
    status === 'active' ? 'var(--green)' : status === 'idle' ? 'var(--orange)' : 'var(--text-faint)'
  const statusBg =
    status === 'active' ? 'var(--green-bg)' : status === 'idle' ? 'var(--orange-bg)' : 'rgba(0,0,0,0.05)'
  const statusLabel = status === 'active' ? 'Active' : status === 'idle' ? 'Idle' : 'Stale'

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: 16,
        minHeight: 148,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.2s ease, border-color 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(124, 58, 237, 0.25)'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          {name}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: statusColor,
            fontWeight: 600,
            background: statusBg,
            padding: '3px 8px',
            borderRadius: 999,
          }}
          title={status}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              backgroundColor: statusColor,
              flexShrink: 0,
            }}
          />
          {statusLabel}
        </span>
      </div>

      <span style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>{meta}</span>

      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                borderRadius: 999,
                border: '1px solid rgba(124, 58, 237, 0.15)',
                padding: '3px 9px',
                fontSize: 11,
                color: 'var(--accent)',
                fontWeight: 600,
                background: 'rgba(124, 58, 237, 0.05)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectCard


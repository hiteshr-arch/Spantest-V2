import { Card } from 'antd'

interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  description?: string
  accent?: string
  onClick?: () => void
}

function StatCard({ title, value, suffix, description, accent, onClick }: StatCardProps) {
  const clickableProps = onClick
    ? {
        hoverable: true,
        onClick,
        style: { cursor: 'pointer' as const },
      }
    : {}

  return (
    <Card
      size="small"
      {...clickableProps}
      style={{
        borderRadius: 14,
        borderColor: '#ECEEF3',
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
        minHeight: 118,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        {accent && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: accent,
            }}
          />
        )}
      </div>

      <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {value}
        {suffix && <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 6 }}>{suffix}</span>}
      </div>

      {description && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>{description}</div>
      )}
    </Card>
  )
}

export default StatCard


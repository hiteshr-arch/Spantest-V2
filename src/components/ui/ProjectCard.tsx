import { Card, Typography } from 'antd'

const { Title, Text } = Typography

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
      <Card
        hoverable
        onClick={onClick}
        style={{
          minHeight: 156,
          borderStyle: 'dashed',
          borderColor: '#D7D9E2',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(55, 123, 255, 0.08)',
          color: '#3466D6',
          fontWeight: 600,
        }}
      >
        + New Project
      </Card>
    )
  }

  const statusColor = status === 'active' ? '#4CAF50' : status === 'idle' ? '#FFA726' : '#B0B0B0'

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        borderRadius: 14,
        minHeight: 156,
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
        borderColor: '#ECEEF3',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>
          {name}
        </Title>
        <span
          style={{
            borderRadius: 999,
            backgroundColor: statusColor,
            width: 10,
            height: 10,
            display: 'inline-block',
          }}
          title={status}
        />
      </div>

      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
        {meta}
      </Text>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              borderRadius: 999,
              border: '1px solid #E4E6EA',
              padding: '4px 10px',
              fontSize: 12,
              color: '#4E5B72',
              fontWeight: 500,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Card>
  )
}

export default ProjectCard


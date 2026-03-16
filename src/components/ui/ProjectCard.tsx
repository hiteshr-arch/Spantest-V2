import { Card, Tag } from 'antd'
import styles from './ProjectCard.module.scss'

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
        onClick={onClick}
        className={styles.dashedCard}
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.dashedBody}>
          <div className={styles.addIcon}>+</div>
          <span className={styles.addLabel}>New Project</span>
        </div>
      </Card>
    )
  }

  const statusColor = status === 'active' ? 'success' : status === 'idle' ? 'warning' : 'default'
  const statusLabel = status === 'active' ? 'Active' : status === 'idle' ? 'Idle' : 'Stale'

  return (
    <Card
      onClick={onClick}
      className={styles.projectCard}
      styles={{
        body: {
          padding: '18px 20px',
          minHeight: 148,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        },
      }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.projectName}>{name}</span>
        <Tag color={statusColor}>{statusLabel}</Tag>
      </div>

      <span className={styles.projectMeta}>{meta}</span>

      {tags.length > 0 && (
        <div className={styles.tagsList}>
          {tags.map((tag) => (
            <Tag key={tag} color="purple">{tag}</Tag>
          ))}
        </div>
      )}
    </Card>
  )
}

export default ProjectCard

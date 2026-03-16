import { Card } from 'antd'
import styles from './StatCard.module.scss'

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
    <Card
      onClick={onClick}
      className={`${styles.statCard} ${onClick ? styles.clickable : ''}`}
      styles={{
        body: {
          padding: '20px 20px 16px',
          minHeight: 116,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      {accent && <div className={styles.accentBar} style={{ background: accent }} />}

      <span className={styles.title}>{title}</span>

      <div>
        <div className={styles.value}>
          {value}
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>

        {description && (
          <div className={`${styles.description} ${onClick ? styles.descriptionClickable : ''}`}>
            {description}
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatCard

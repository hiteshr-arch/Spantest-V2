import { Button } from 'antd'
import styles from './TokenBadge.module.scss'

interface TokenBadgeProps {
  tokens: number
  onClick?: () => void
}

function TokenBadge({ tokens, onClick }: TokenBadgeProps) {
  return (
    <Button
      onClick={onClick}
      className={styles.badge}
      icon={
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="5" cy="5" r="2" fill="currentColor" />
        </svg>
      }
    >
      {tokens.toLocaleString()} tokens
    </Button>
  )
}

export default TokenBadge

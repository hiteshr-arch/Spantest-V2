import type { QuickReply } from '../../types/generator'
import styles from './QuickReplyBar.module.scss'

interface QuickReplyBarProps {
  replies: QuickReply[]
  onSelect: (value: string) => void
  disabled?: boolean
}

export default function QuickReplyBar({ replies, onSelect, disabled }: QuickReplyBarProps) {
  if (!replies.length) return null
  return (
    <div className={styles.bar}>
      {replies.map((r) => (
        <button
          key={r.value}
          className={styles.pill}
          onClick={() => onSelect(r.value)}
          disabled={disabled}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}

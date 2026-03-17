import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types/generator'
import ChatBubble from './ChatBubble'
import styles from './ChatMessageList.module.scss'

interface ChatMessageListProps {
  messages: ChatMessage[]
  isGenerating: boolean
  onAction?: (actionType: string) => void
}

export default function ChatMessageList({ messages, isGenerating, onAction }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isGenerating])

  return (
    <div className={styles.list}>
      {messages.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✦</div>
          <div className={styles.emptyTitle}>Start by describing what to test</div>
          <div className={styles.emptySub}>Paste a user story, feature description, or API spec</div>
        </div>
      )}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} onAction={onAction} />
      ))}
      {isGenerating && (
        <div className={styles.typing}>
          <div className={styles.typingAvatar}>✦</div>
          <div className={styles.typingDots}>
            <span /><span /><span />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

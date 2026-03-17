import type { ChatMessage } from '../../types/generator'
import styles from './ChatBubble.module.scss'

interface ChatBubbleProps {
  message: ChatMessage
  onAction?: (actionType: string) => void
}

function isImage(mimeType: string) {
  return mimeType.startsWith('image/')
}

export default function ChatBubble({ message, onAction }: ChatBubbleProps) {
  const isUser = message.role === 'user'
  const hasAttachments = (message.attachments?.length ?? 0) > 0
  const hasActions = (message.actions?.length ?? 0) > 0

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.system}`}>
      {!isUser && (
        <div className={styles.avatar}>
          <span>✦</span>
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleSystem}`}>
        {message.text && <div>{message.text}</div>}

        {hasAttachments && (
          <div className={`${styles.attachments} ${message.text ? styles.attachmentsWithText : ''}`}>
            {message.attachments!.map((att, i) =>
              isImage(att.mimeType) ? (
                <img
                  key={i}
                  src={att.dataUrl}
                  alt={att.name}
                  className={styles.attachImage}
                  title={att.name}
                />
              ) : (
                <div key={i} className={styles.attachFile}>
                  <span className={styles.attachFileIcon}>📄</span>
                  <div className={styles.attachFileMeta}>
                    <span className={styles.attachFileName}>{att.name}</span>
                    <span className={styles.attachFileSize}>
                      {att.size < 1024
                        ? `${att.size} B`
                        : att.size < 1024 * 1024
                        ? `${(att.size / 1024).toFixed(1)} KB`
                        : `${(att.size / (1024 * 1024)).toFixed(1)} MB`}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {hasActions && (
          <div className={styles.actions}>
            {message.actions!.map((action) => (
              <button
                key={action.actionType}
                className={styles.actionLink}
                onClick={() => onAction?.(action.actionType)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

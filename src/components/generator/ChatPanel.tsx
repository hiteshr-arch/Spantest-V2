import type { ChatAttachment, ChatMessage, ConversationStage, QuickReply } from '../../types/generator'
import ChatMessageList from './ChatMessageList'
import QuickReplyBar from './QuickReplyBar'
import ChatInput from './ChatInput'
import styles from './ChatPanel.module.scss'

interface ChatPanelProps {
  conversationStage: ConversationStage
  chatMessages: ChatMessage[]
  isGenerating: boolean
  tokens: number
  onSubmitPrompt: (text: string, attachments: ChatAttachment[]) => void
  onQuickReply: (value: string) => void
  onMessageAction?: (actionType: string) => void
}

export default function ChatPanel({
  conversationStage,
  chatMessages,
  isGenerating,
  tokens,
  onSubmitPrompt,
  onQuickReply,
  onMessageAction,
}: ChatPanelProps) {
  // Find quick replies from the last system message
  const lastSystemMsg = [...chatMessages].reverse().find((m) => m.role === 'system')
  const activeQuickReplies: QuickReply[] =
    conversationStage === 'awaiting_test_type' || conversationStage === 'awaiting_generate_type'
      ? (lastSystemMsg?.quickReplies ?? [])
      : []

  const inputDisabled =
    isGenerating ||
    conversationStage === 'awaiting_test_type' ||
    conversationStage === 'awaiting_generate_type' ||
    conversationStage === 'generating'

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>✦</span>
        <span className={styles.headerTitle}>Test Generator</span>
        <span className={styles.tokenBadge}>{tokens} tokens</span>
      </div>

      <ChatMessageList messages={chatMessages} isGenerating={isGenerating} onAction={onMessageAction} />

      {activeQuickReplies.length > 0 && (
        <QuickReplyBar
          replies={activeQuickReplies}
          onSelect={onQuickReply}
          disabled={isGenerating}
        />
      )}

      <ChatInput
        onSubmit={onSubmitPrompt}
        disabled={inputDisabled}
        placeholder={
          conversationStage === 'results'
            ? 'Describe a new scenario to regenerate…'
            : 'Describe what you want to test…'
        }
      />
    </div>
  )
}

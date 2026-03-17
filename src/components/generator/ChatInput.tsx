import { useRef, useState, type KeyboardEvent } from 'react'
import type { ChatAttachment } from '../../types/generator'
import styles from './ChatInput.module.scss'

interface ChatInputProps {
  onSubmit: (text: string, attachments: ChatAttachment[]) => void
  disabled?: boolean
  placeholder?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

export default function ChatInput({ onSubmit, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const text = value.trim()
    if (!text && attachments.length === 0) return
    if (disabled) return
    onSubmit(text, attachments)
    setValue('')
    setAttachments([])
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            dataUrl: reader.result as string,
          },
        ])
      }
      reader.readAsDataURL(file)
    })

    // reset so same file can be re-attached
    e.target.value = ''
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const canSubmit = (value.trim().length > 0 || attachments.length > 0) && !disabled

  return (
    <div className={styles.wrap}>
      {attachments.length > 0 && (
        <div className={styles.attachmentBar}>
          {attachments.map((att, i) => (
            <div key={i} className={styles.chip}>
              {isImage(att.mimeType) ? (
                <img src={att.dataUrl} alt={att.name} className={styles.chipThumb} />
              ) : (
                <span className={styles.chipIcon}>📄</span>
              )}
              <span className={styles.chipName} title={att.name}>
                {att.name.length > 20 ? att.name.slice(0, 18) + '…' : att.name}
              </span>
              <span className={styles.chipSize}>{formatSize(att.size)}</span>
              <button
                className={styles.chipRemove}
                onClick={() => removeAttachment(i)}
                aria-label={`Remove ${att.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.inputRow}>
        <button
          type="button"
          className={styles.attach}
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          aria-label="Attach file"
          title="Attach file"
        >
          📎
        </button>
        <textarea
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Describe what you want to test…'}
          disabled={disabled}
          rows={3}
        />
        <button
          className={styles.send}
          onClick={submit}
          disabled={!canSubmit}
          aria-label="Send"
        >
          ↑
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,.pdf,.txt,.md,.csv,.json,.ts,.js"
      />
    </div>
  )
}

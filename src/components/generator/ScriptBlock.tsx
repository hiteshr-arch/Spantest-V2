import { useState } from 'react'
import { Button, message } from 'antd'
import styles from './ScriptBlock.module.scss'

interface ScriptBlockProps {
  script: string
}

function ScriptBlock({ script }: ScriptBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      message.error('Unable to copy script')
    }
  }

  const handleExport = () => {
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'test-script.ts'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.fileInfo}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 4l4 3-4 3M8 10h4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.fileName}>test-script.ts</span>
        </div>
        <div className={styles.actions}>
          <Button
            size="small"
            onClick={handleCopy}
            className={copied ? styles.copyBtnCopied : styles.copyBtn}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
          <Button size="small" onClick={handleExport} className={styles.copyBtn}>
            Export
          </Button>
        </div>
      </div>

      {/* Code */}
      <pre className={styles.codeBlock}>
        <code>{script}</code>
      </pre>
    </div>
  )
}

export default ScriptBlock

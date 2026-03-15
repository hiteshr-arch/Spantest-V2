import { useState } from 'react'
import { message } from 'antd'

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
    <div
      style={{
        marginTop: 20,
        borderRadius: 12,
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-raised)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 4l4 3-4 3M8 10h4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11.5,
              color: 'var(--text-muted)',
            }}
          >
            test-script.ts
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              height: 26,
              padding: '0 12px',
              borderRadius: 7,
              border: copied ? '1px solid #16a34a' : '1px solid var(--border-mid)',
              background: copied ? 'rgba(22,163,74,0.08)' : 'transparent',
              color: copied ? '#16a34a' : 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.15s ease',
              letterSpacing: '0.02em',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleExport}
            style={{
              height: 26,
              padding: '0 12px',
              borderRadius: 7,
              border: '1px solid var(--border-mid)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.02em',
            }}
          >
            Export
          </button>
        </div>
      </div>

      {/* Code */}
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.7,
          color: '#cbd5e1',
          overflowX: 'auto',
          whiteSpace: 'pre',
          background: '#1e1b2e',
        }}
      >
        <code>{script}</code>
      </pre>
    </div>
  )
}

export default ScriptBlock


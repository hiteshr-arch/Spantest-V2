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
        borderRadius: 14,
        border: '1px solid rgba(124, 58, 237, 0.12)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Header bar — light to match app chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
          background: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#fca5a5' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#fde68a' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#86efac' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11.5,
              color: 'var(--text-muted)',
              marginLeft: 6,
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
              border: copied ? '1px solid var(--green)' : '1px solid var(--border-mid)',
              background: copied ? 'var(--green-bg)' : 'var(--surface-raised)',
              color: copied ? 'var(--green)' : 'var(--text-secondary)',
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
              background: 'var(--surface-raised)',
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

      {/* Code block — intentionally dark for contrast */}
      <pre
        style={{
          margin: 0,
          padding: '16px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          lineHeight: 1.75,
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


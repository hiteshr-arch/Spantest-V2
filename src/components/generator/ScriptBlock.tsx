import { Button, Typography, message } from 'antd'

const { Title, Paragraph } = Typography

interface ScriptBlockProps {
  script: string
}

function ScriptBlock({ script }: ScriptBlockProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script)
      message.success('Script copied')
    } catch {
      message.error('Unable to copy script')
    }
  }

  const handleExport = () => {
    message.success('Exported (mock).')
  }

  return (
    <div style={{ marginTop: 24 }}>
      <Title level={5} style={{ marginBottom: 8 }}>
        Script
      </Title>
      <Paragraph
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          background: '#f9f9f9',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 12,
          whiteSpace: 'pre',
          overflowX: 'auto',
        }}
      >
        {script}
      </Paragraph>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="small" onClick={handleCopy}>
          Copy
        </Button>
        <Button size="small" onClick={handleExport}>
          Export
        </Button>
      </div>
    </div>
  )
}

export default ScriptBlock


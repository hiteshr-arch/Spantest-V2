import { Button, Card, Typography } from 'antd'
import styles from './ToolsPage.module.scss'

const { Title, Paragraph } = Typography

function ToolsPage() {
  return (
    <div className={styles.page}>
      <Title level={3}>Tools</Title>
      <Paragraph>Choose a tool below:</Paragraph>
      <div className={styles.cardsRow}>
        <Card title="Screen Recorder" className={styles.card}>
          <Paragraph>
            Record your screen and automatically generate scripts for testing.
          </Paragraph>
          <Button style={{ marginTop: 8 }}>Start Recording</Button>
        </Card>
        <Card title="Keyword Locator" className={styles.card}>
          <Paragraph>
            Find keywords and locate elements for test automation.
          </Paragraph>
          <Button style={{ marginTop: 8 }}>Find Keywords</Button>
        </Card>
      </div>
    </div>
  )
}

export default ToolsPage

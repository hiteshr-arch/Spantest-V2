import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

function ToolsPage() {
  return (
    <div style={{ padding: 32 }}>
      <Title level={3}>Tools</Title>
      <Paragraph>Choose a tool below:</Paragraph>
      <div style={{ display: 'flex', gap: 24 }}>
        <Card title="Screen Recorder" style={{ width: 300 }}>
          <Paragraph>
            Record your screen and automatically generate scripts for testing.
          </Paragraph>
          <button style={{ marginTop: 8 }}>Start Recording</button>
        </Card>
        <Card title="Keyword Locator" style={{ width: 300 }}>
          <Paragraph>
            Find keywords and locate elements for test automation.
          </Paragraph>
          <button style={{ marginTop: 8 }}>Find Keywords</button>
        </Card>
      </div>
    </div>
  );
}

export default ToolsPage;

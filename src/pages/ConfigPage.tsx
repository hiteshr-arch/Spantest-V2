import { Button, Card, Form, Input, Select, Tag, Typography } from 'antd'

const { Title } = Typography

function ConfigPage() {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
        Projects / E-Commerce App / Config
      </div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Project Config
      </Title>

      <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card
          title="Project details"
          styles={{ header: { paddingInline: 18, paddingBlock: 14, fontSize: 13 }, body: { padding: 20 } }}
        >
          <Form layout="vertical" initialValues={{ name: 'E-Commerce App' }}>
            <Form.Item label="Project name" name="name">
              <Input defaultValue="E-Commerce App" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input defaultValue="Frontend checkout and cart flow testing" />
            </Form.Item>
            <Form.Item label="Default framework" name="framework">
              <Select
                style={{ width: 200 }}
                defaultValue="Playwright"
                options={[
                  { value: 'Playwright', label: 'Playwright' },
                  { value: 'Cypress', label: 'Cypress' },
                  { value: 'Jest', label: 'Jest' },
                  { value: 'Selenium', label: 'Selenium' },
                ]}
              />
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Project files</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                Used as context for AI generation
              </span>
            </div>
          }
          styles={{ header: { paddingInline: 18, paddingBlock: 14, fontSize: 13 }, body: { padding: 20 } }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {['checkout-flow.pdf', 'api-spec-v2.yaml', 'product-requirements.docx'].map(
              (name, idx) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    background: '#fafafa',
                    fontSize: 12,
                  }}
                >
                  <span style={{ flex: 1 }}>{name}</span>
                  <span style={{ color: 'var(--text-faint)' }}>
                    {idx === 0 ? '2.4 MB' : idx === 1 ? '18 KB' : '340 KB'}
                  </span>
                  <Button size="small">Remove</Button>
                </div>
              ),
            )}
          </div>
          <Button>+ Upload file</Button>
        </Card>

        <Card
          title="Jira integration"
          styles={{ header: { paddingInline: 18, paddingBlock: 14, fontSize: 13 }, body: { padding: 20 } }}
          extra={
            <Tag color="success" style={{ borderRadius: 999 }}>
              ● Connected
            </Tag>
          }
        >
          <Form layout="vertical">
            <Form.Item label="Workspace URL" name="workspaceUrl">
              <Input defaultValue="company.atlassian.net" />
            </Form.Item>
            <Form.Item label="API Token" name="apiToken">
              <Input.Password defaultValue="xxxxxxxxxxx" />
            </Form.Item>
            <Form.Item label="Default board" name="board">
              <Input defaultValue="E-Commerce Sprint 14" />
            </Form.Item>
          </Form>
        </Card>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button type="primary">Save changes</Button>
          <Button>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

export default ConfigPage

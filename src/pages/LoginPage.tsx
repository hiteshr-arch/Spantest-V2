import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Typography } from 'antd'

const { Title, Text } = Typography

function LoginPage() {
  const navigate = useNavigate()

  const onFinish = () => {
    navigate('/')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 40,
          width: 400,
        }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 6 }}>
          Spantest
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          QA Automation Workspace
        </Text>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" initialValue="john@company.com">
            <Input placeholder="john@company.com" />
          </Form.Item>
          <Form.Item label="Password" name="password" initialValue="password">
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" block size="large">
              Sign in
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '20px 0',
            fontSize: 12,
            color: '#bbbbbb',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <Button block size="large" onClick={onFinish}>
          Continue with SSO
        </Button>
        <div style={{ textAlign: 'center', fontSize: 12, marginTop: 20, color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            style={{
              border: 'none',
              padding: 0,
              background: 'transparent',
              color: 'var(--text-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={onFinish}
          >
            Sign up →
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


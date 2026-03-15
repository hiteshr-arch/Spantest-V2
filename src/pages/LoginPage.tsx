import { useNavigate } from 'react-router-dom'
import { Button, Form, Input } from 'antd'

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
      {/* Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '44px 40px 36px',
          width: 400,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Logo mark + wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
              marginBottom: 14,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 11l5 5L18 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 5,
            }}
          >
            Spantest
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Sign in to your QA workspace
          </div>
        </div>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label={
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Email
              </span>
            }
            name="email"
            initialValue="james.doe@company.com"
          >
            <Input
              size="large"
              placeholder="you@company.com"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Password
              </span>
            }
            name="password"
            initialValue="password"
            style={{ marginBottom: 6 }}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: 18 }}>
            <button
              type="button"
              style={{ border: 'none', background: 'transparent', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            >
              Forgot password?
            </button>
          </div>

          <Form.Item style={{ marginBottom: 10 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                borderRadius: 10,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.01em',
                height: 44,
              }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '12px 0 16px',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <Button
          block
          size="large"
          onClick={onFinish}
          style={{ borderRadius: 10, fontFamily: 'var(--font-display)', fontWeight: 600, height: 44 }}
        >
          Continue with SSO
        </Button>

        <div style={{ textAlign: 'center', fontSize: 12, marginTop: 22, color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            style={{
              border: 'none',
              padding: 0,
              background: 'transparent',
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'inherit',
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

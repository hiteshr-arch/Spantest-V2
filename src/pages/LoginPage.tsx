import { useNavigate } from 'react-router-dom'
import { Button, Card, Divider, Form, Input } from 'antd'
import styles from './LoginPage.module.scss'

function LoginPage() {
  const navigate = useNavigate()

  const onFinish = () => {
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card} styles={{ body: { padding: '44px 40px 36px' } }}>

        {/* Logo mark + wordmark */}
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 11l5 5L18 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.logoTitle}>Spantest</div>
          <div className={styles.logoSub}>Sign in to your QA workspace</div>
        </div>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinish} requiredMark={false} className={styles.form}>
          <Form.Item label="Email" name="email" initialValue="james.doe@company.com">
            <Input size="large" placeholder="you@company.com" />
          </Form.Item>

          <Form.Item label="Password" name="password" initialValue="password">
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          {/* Forgot password */}
          <div className={styles.forgotWrapper}>
            <Button type="link" className={styles.forgotBtn}>
              Forgot password?
            </Button>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className={styles.signInBtn}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider plain className={styles.divider}>or continue with</Divider>

        <Button block size="large" onClick={onFinish} className={styles.ssoBtn}>
          Continue with SSO
        </Button>

        <div className={styles.signUpWrapper}>
          Don&apos;t have an account?{' '}
          <Button type="link" onClick={onFinish} className={styles.signUpBtn}>
            Sign up →
          </Button>
        </div>

      </Card>
    </div>
  )
}

export default LoginPage

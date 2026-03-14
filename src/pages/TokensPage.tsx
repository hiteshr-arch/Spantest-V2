import { Button, Card, Col, Row, Statistic, Typography } from 'antd'
import { useSpantestStore } from '../store/useSpantestStore'

const { Title, Text, Paragraph } = Typography

function TokensPage() {
  const { tokens, adjustTokens } = useSpantestStore()

  const handleBuy = (amount: number) => {
    adjustTokens(amount)
  }

  return (
    <div style={{ maxWidth: 940 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
        Account / Token Balance
      </div>
      <Title level={3} style={{ marginBottom: 4 }}>
        Token Balance
      </Title>
      <Text type="secondary">Tokens are consumed by all AI generation features</Text>

      <Row gutter={16} style={{ marginTop: 24, marginBottom: 28 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Current balance" value={tokens} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Used this month" value={760} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Plan" value="Free" />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
          Usage this month
        </div>
        <div
          style={{
            height: 10,
            background: '#eeeeee',
            borderRadius: 999,
            overflow: 'hidden',
            marginBottom: 6,
          }}
        >
          <div
            style={{
              height: '100%',
              width: '76%',
              background: 'var(--accent)',
              borderRadius: 999,
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>760 / 1,000 tokens used</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: -0.2,
            marginBottom: 4,
          }}
        >
          Top up tokens
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          One-time token packs — never expire
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Starter</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>500</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                tokens
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>$4.99</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 16 }}>
                one-time
              </div>
              <Button
                block
                onClick={() => {
                  handleBuy(500)
                }}
              >
                Buy
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              borderRadius: 12,
              borderColor: 'var(--accent)',
              borderWidth: 2,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent)',
                color: 'var(--accent-fg)',
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 12px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
              }}
            >
              Most popular
            </div>
            <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Pro Pack</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>2,000</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                tokens
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>$14.99</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 16 }}>
                one-time
              </div>
              <Button
                type="primary"
                block
                onClick={() => {
                  handleBuy(2000)
                }}
              >
                Buy
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Team</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>10,000</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                tokens
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>$49.99</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 16 }}>
                one-time
              </div>
              <Button
                block
                onClick={() => {
                  handleBuy(10000)
                }}
              >
                Buy
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Paragraph style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 0 }}>
          Each AI generation step (scenario, test case, script, clarifying question) uses 1 token.
          When tokens run out, all AI features are blocked until you top up.
        </Paragraph>
      </Card>
    </div>
  )
}

export default TokensPage


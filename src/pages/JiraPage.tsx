import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, Tag, Typography } from 'antd'
import { listJiraTickets, getTicketStory } from '../services/jiraApi'
import { useAppDispatch } from '../store/hooks'
import { resetConversation } from '../store/spantestSlice'
import styles from './JiraPage.module.scss'

const { Title, Text } = Typography

interface TicketView {
  key: string
  type: 'Story' | 'Bug' | 'Task'
  title: string
  priority: 'Low' | 'Medium' | 'High'
}

function JiraPage() {
  const [tickets, setTickets] = useState<TicketView[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await listJiraTickets()
      setTickets(data)
      setLoading(false)
    }
    void load()
  }, [])

  const handleImport = async (key: string) => {
    const story = await getTicketStory(key)
    window.sessionStorage.setItem('spantest:jira-story', story)
    dispatch(resetConversation())
    navigate('/project/ecommerce-app/generator')
  }

  return (
    <div>
      <div className={styles.breadcrumb}>
        Projects / E-Commerce App / Jira Import
      </div>
      <div className={styles.pageHeader}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Import from Jira
          </Title>
          <Text type="secondary">Select tickets to generate test cases from</Text>
        </div>
        <Tag color="success" style={{ alignSelf: 'center', borderRadius: 999 }}>
          ● Connected
        </Tag>
      </div>
      <div className={styles.boardInfo}>
        <span className={styles.boardMeta}>
          Board: E-Commerce Sprint 14 · {tickets.length} open tickets · Last synced 5 min ago
        </span>
        <div className={styles.boardActions}>
          <Input placeholder="Search Jira tickets..." style={{ width: 240, height: 36 }} />
          <Button>Refresh</Button>
        </div>
      </div>

      {tickets.map((t) => (
        <Card
          key={t.key}
          hoverable
          loading={loading}
          style={{ marginBottom: 10 }}
          onClick={() => handleImport(t.key)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Tag bordered style={{ borderRadius: 4, fontSize: 10, fontWeight: 500 }}>
              {t.key}
            </Tag>
            <Tag
              color={t.type === 'Bug' ? 'red' : t.type === 'Task' ? 'default' : 'processing'}
              style={{ borderRadius: 999, fontSize: 10 }}
            >
              {t.type}
            </Tag>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                Priority: {t.priority}
              </div>
            </div>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                void handleImport(t.key)
              }}
            >
              Import →
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default JiraPage

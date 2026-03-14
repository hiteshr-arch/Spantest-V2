import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Select, Steps, Typography, Form, message } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { useSpantestStore } from '../store/useSpantestStore'
import StatCard from '../components/ui/StatCard'
import ProjectCard from '../components/ui/ProjectCard'
import styles from './DashboardPage.module.scss'

const { Title, Text } = Typography
const steps = [{ title: 'Name' }, { title: 'Framework' }, { title: 'Review' }]

const FRAMEWORK_OPTIONS = ['Playwright', 'Cypress', 'Jest', 'Selenium']

function DashboardPage() {
  const navigate = useNavigate()
  const projects = useSpantestStore((s) => s.projects)
  const addProject = useSpantestStore((s) => s.addProject)
  const setActiveProject = useSpantestStore((s) => s.setActiveProject)
  const [query, setQuery] = useState('')
  const [newProjectModalVisible, setNewProjectModalVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [form] = Form.useForm()

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, projects],
  )

  const openNewProjectFlow = () => {
    setNewProjectModalVisible(true)
    setActiveStep(0)
    form.resetFields()
  }

  const closeNewProjectFlow = () => {
    setNewProjectModalVisible(false)
  }

  const handleCreateProject = async () => {
    console.log('handleCreateProject:', { activeStep, values: form.getFieldsValue() })
    try {
      const values = await form.validateFields(['name', 'framework'])

      if (!values.name || !values.framework) {
        message.error('Please fill out name and framework before creating.')
        return
      }

      const id = values.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      const payload = {
        id: id || `project-${Date.now()}`,
        name: values.name,
        meta: `Last active now · 0 test cases`,
        tags: values.tags || [],
        status: 'active' as const,
      }

      addProject(payload)
      setActiveProject(payload.id)
      closeNewProjectFlow()
      setActiveStep(0)
      form.resetFields()
      message.success(`Project ${values.name} created. Redirecting to generator...`)
      navigate(`/project/${payload.id}/generator`)
    } catch (err) {
      console.error('Create project error:', err)
      message.error(
        err instanceof Error
          ? `Failed to create project: ${err.message}`
          : 'Failed to create project. Please verify all required fields.',
      )
    }
  }

  const renderChatStep = () => {
    if (activeStep === 0) {
      return (
        <>
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 12, background: '#F4F6FC' }}>
            <Text strong>Hey there!</Text> Let’s create your project. What’s the project name?
          </div>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Project name is required' }]}
          >
            <Input placeholder="E.g. Customer Onboarding" />
          </Form.Item>
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 12, background: '#F4F6FC' }}>
            Optional: Add a short description.
          </div>
          <Form.Item name="description">
            <Input.TextArea rows={3} placeholder="Project description" />
          </Form.Item>
        </>
      )
    }

    if (activeStep === 1) {
      return (
        <>
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 12, background: '#F4F6FC' }}>
            Great! Now choose a default test framework and quick tags.
          </div>
          <Form.Item
            name="framework"
            rules={[{ required: true, message: 'Choose a framework' }]}
          >
            <Select placeholder="Select framework">
              {FRAMEWORK_OPTIONS.map((f) => (
                <Select.Option key={f} value={f}>
                  {f}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="tags">
            <Select mode="tags" placeholder="Add tags (Playwright, API, etc.)" />
          </Form.Item>
        </>
      )
    }

    if (activeStep === 2) {
      const values = form.getFieldsValue()
      return (
        <>
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 12, background: '#F4F6FC' }}>
            Awesome! Review your project details.
          </div>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            <b>Name:</b> {values.name || '—'}
          </div>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            <b>Description:</b> {values.description || '—'}
          </div>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            <b>Framework:</b> {values.framework || '—'}
          </div>
          <div style={{ fontSize: 14 }}>
            <b>Tags:</b> {Array.isArray(values.tags) && values.tags.length ? values.tags.join(', ') : '—'}
          </div>
        </>
      )
    }

    return null
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>Projects / Dashboard</div>
          <Title level={3} className={styles.pageTitle}>
            Project dashboard
          </Title>
          <Text className={styles.pageSubtitle}>A snapshot of your recent projects, test counts, and activity.</Text>
        </div>

        <div className={styles.actions}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            prefix={<SearchOutlined />}
            style={{ width: 240, minWidth: 220 }}
            allowClear
          />
          <Button shape="round" type="primary" icon={<PlusOutlined />} onClick={openNewProjectFlow}>
            New Project
          </Button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <StatCard title="Total Projects" value={projects.length} description="Across all teams" accent="#0052CC" />
        <StatCard title="Test Cases" value={142} description="All active suites" accent="#00A884" />
        <StatCard title="Scripts Generated" value={89} description="This month" accent="#FF8A00" />
        <StatCard
          title="Tokens Remaining"
          value={240}
          description="Buy more tokens"
          accent="#8A50FF"
          onClick={() => navigate('/tokens')}
        />
      </div>

      <div>
        <div className={styles.projectsHeader}>
          <div className={styles.projectsTitle}>Your projects</div>
          <Text type="secondary">{filteredProjects.length} active projects</Text>
        </div>

        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              meta={project.meta}
              tags={project.tags}
              status={project.status as 'active' | 'idle' | 'stale'}
              onClick={() => navigate(`/project/${project.id}/generator`)}
            />
          ))}

          <ProjectCard
            name="+ New Project"
            meta=""
            tags={[]}
            dashed
            onClick={openNewProjectFlow}
          />
        </div>
      </div>

      <Modal
        title="Create new project"
        open={newProjectModalVisible}
        onCancel={closeNewProjectFlow}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => Math.max(0, s - 1))}>
              Back
            </Button>
            {activeStep < 2 ? (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await form.validateFields(activeStep === 0 ? ['name'] : activeStep === 1 ? ['framework'] : [])
                    setActiveStep((s) => Math.min(2, s + 1))
                  } catch {
                    // keep in same step on validation fail
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="primary" onClick={handleCreateProject}>
                Create
              </Button>
            )}
          </div>
        }
      >
        <Steps current={activeStep} size="small" style={{ marginBottom: 20 }} items={steps.map((item, index) => ({
          key: index,
          title: item.title,
        }))} />

        <Form form={form} layout="vertical">
          {renderChatStep()}
        </Form>
      </Modal>
    </div>
  )
}

export default DashboardPage
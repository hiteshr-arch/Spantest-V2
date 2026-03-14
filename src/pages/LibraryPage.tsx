import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, Modal, Select, Table, Tag, Typography, Form, message } from 'antd'

const { Title, Text } = Typography

interface LibraryItem {
  key: string
  name: string
  type: 'Scenario' | 'Test Case' | 'Script'
  framework: string
  created: string
  status: 'Ready' | 'Draft'
  epicId?: string
}

interface Epic {
  id: string
  name: string
  itemKeys: string[]
}

const MOCK_ITEMS: LibraryItem[] = [
  {
    key: '1',
    name: 'User checkout — happy path',
    type: 'Script',
    framework: 'Playwright',
    created: '2d ago',
    status: 'Ready',
  },
  {
    key: '2',
    name: 'Login — invalid credentials',
    type: 'Test Case',
    framework: 'Cypress',
    created: '3d ago',
    status: 'Ready',
  },
  {
    key: '3',
    name: 'Product search edge cases',
    type: 'Scenario',
    framework: '—',
    created: '5d ago',
    status: 'Draft',
  },
]

function LibraryPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<LibraryItem[]>(MOCK_ITEMS)
  const [epics, setEpics] = useState<Epic[]>([])
  const [search, setSearch] = useState('')
  const [createEpicVisible, setCreateEpicVisible] = useState(false)
  const [assignEpicVisible, setAssignEpicVisible] = useState(false)
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null)
  const [form] = Form.useForm()
  const [assignForm] = Form.useForm()

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [items, search],
  )

  const createEpic = async () => {
    try {
      const values = await form.validateFields()
      const id = values.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const epicId = id || `epic-${Date.now()}`

      const newEpic: Epic = {
        id: epicId,
        name: values.name,
        itemKeys: values.items || [],
      }

      setEpics((prev) => [...prev, newEpic])
      setItems((prev) =>
        prev.map((item) =>
          newEpic.itemKeys.includes(item.key) ? { ...item, epicId: epicId } : item,
        ),
      )

      setCreateEpicVisible(false)
      form.resetFields()
      message.success(`Epic '${values.name}' created with ${newEpic.itemKeys.length} item(s).`)
    } catch {
      // validation errors handled by form
    }
  }

  const openAssignEpic = (itemKey: string) => {
    setSelectedItemKey(itemKey)
    assignForm.setFieldsValue({ epicId: items.find((i) => i.key === itemKey)?.epicId })
    setAssignEpicVisible(true)
  }

  const assignItemToEpic = async () => {
    try {
      const values = await assignForm.validateFields()
      if (!selectedItemKey) return

      setItems((prev) =>
        prev.map((item) =>
          item.key === selectedItemKey ? { ...item, epicId: values.epicId } : item,
        ),
      )

      setEpics((prev) =>
        prev.map((epic) => {
          const inEpic = epic.itemKeys.includes(selectedItemKey)
          if (values.epicId === epic.id) {
            return {
              ...epic,
              itemKeys: Array.from(new Set([...epic.itemKeys, selectedItemKey])),
            }
          }
          if (inEpic) {
            return {
              ...epic,
              itemKeys: epic.itemKeys.filter((k) => k !== selectedItemKey),
            }
          }
          return epic
        }),
      )

      setAssignEpicVisible(false)
      setSelectedItemKey(null)
      assignForm.resetFields()
      message.success('Item mapped to epic successfully.')
    } catch {
      // validation errors handled by form
    }
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
        Projects / E-Commerce App / Test Library
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Test Library
          </Title>
          <Text type="secondary">Saved scenarios, test cases & scripts</Text>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="Search tests..."
            style={{ width: 200, height: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="default" onClick={() => setCreateEpicVisible(true)}>
            + Create Epic
          </Button>
          <Button type="primary" onClick={() => navigate('/project/ecommerce-app/generator')}>
            + New
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <Button size="small" type="primary">
          All
        </Button>
        <Button size="small">Scenarios</Button>
        <Button size="small">Test Cases</Button>
        <Button size="small">Scripts</Button>
        <div style={{ marginLeft: 'auto' }}>
          <Select
            defaultValue="All frameworks"
            style={{ width: 160, height: 32 }}
            options={[
              { value: 'all', label: 'All frameworks' },
              { value: 'Playwright', label: 'Playwright' },
              { value: 'Cypress', label: 'Cypress' },
              { value: 'Jest', label: 'Jest' },
              { value: 'Selenium', label: 'Selenium' },
            ]}
          />
        </div>
      </div>

      <Card>
        <Table<LibraryItem>
          rowKey="key"
          size="small"
          dataSource={filteredItems}
          pagination={false}
          onRow={() => ({
            onClick: () => navigate('/project/ecommerce-app/generator'),
          })}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Epic',
              dataIndex: 'epicId',
              render: (epicId: string | undefined) => {
                const epic = epics.find((e) => e.id === epicId)
                return epic ? (
                  <Tag color="blue" style={{ borderRadius: 999 }}>
                    {epic.name}
                  </Tag>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                )
              },
            },
            {
              title: 'Type',
              dataIndex: 'type',
              render: (value: LibraryItem['type']) => (
                <Tag bordered={false} style={{ borderRadius: 999 }}>
                  {value}
                </Tag>
              ),
            },
            {
              title: 'Framework',
              dataIndex: 'framework',
              render: (value: string) => (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value}</span>
              ),
            },
            {
              title: 'Created',
              dataIndex: 'created',
              render: (value: string) => (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value}</span>
              ),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              render: (value: LibraryItem['status']) => (
                <Tag
                  color={value === 'Ready' ? 'success' : 'default'}
                  style={{ borderRadius: 999 }}
                >
                  {value}
                </Tag>
              ),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_: any, record: LibraryItem) => (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText('// mock copy').catch(() => {})
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      openAssignEpic(record.key)
                    }}
                  >
                    Map to Epic
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Create Epic"
        open={createEpicVisible}
        onCancel={() => {
          setCreateEpicVisible(false)
          form.resetFields()
        }}
        onOk={createEpic}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="name"
            label="Epic name"
            rules={[{ required: true, message: 'Epic name is required' }]}
          >
            <Input placeholder="E.g. Payment flow tests" />
          </Form.Item>
          <Form.Item name="items" label="Select items to include">
            <Select
              mode="multiple"
              placeholder="Choose tests"
              options={items.map((item) => ({ value: item.key, label: item.name }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Map item to Epic"
        open={assignEpicVisible}
        onCancel={() => {
          setAssignEpicVisible(false)
          setSelectedItemKey(null)
          assignForm.resetFields()
        }}
        onOk={assignItemToEpic}
      >
        <Form form={assignForm} layout="vertical" preserve={false}>
          <Form.Item
            name="epicId"
            label="Select epic"
            rules={[{ required: true, message: 'Please select an epic' }]}
          >
            <Select placeholder="Select an epic">
              {epics.map((e) => (
                <Select.Option value={e.id} key={e.id}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LibraryPage


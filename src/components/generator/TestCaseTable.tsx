import { Table, Button, Input, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TestCase, TestStep } from '../../types/generator'
import { useState } from 'react'

interface TestCaseRow extends TestCase {
  description?: string
  tags?: string
}

interface TestCaseTableProps {
  testCases: TestCaseRow[]
  selectedIds: string[]
  onToggleSelected: (id: string) => void
  setManualTestCases: React.Dispatch<React.SetStateAction<TestCaseRow[]>>
}

function TestCaseTable({ testCases, selectedIds, onToggleSelected, setManualTestCases }: TestCaseTableProps) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newTestCase, setNewTestCase] = useState<TestCaseRow>({ id: '', name: '', priority: 'Low', expectedResult: '', steps: [], description: '', tags: '' })
  const [newSteps, setNewSteps] = useState<TestStep[]>([{ n: 1, action: '', expected: '' }])
  const dataSource: TestCaseRow[] = testCases

  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([])
  const columns: ColumnsType<TestCaseRow> = [
    {
      title: '',
      dataIndex: 'id',
      width: 48,
      render: (value: string) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(value)}
          onChange={(e) => {
            e.stopPropagation()
            onToggleSelected(value)
          }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 120,
      render: (value: string) => <span style={{ fontSize: 12 }}>{value}</span>,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: 80,
      render: (value: string) => <span style={{ fontSize: 12, color: '#888' }}>{value}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 96,
      render: (value: string) => (
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value}</span>
      ),
    },
    {
      title: 'Expected Result',
      dataIndex: 'expectedResult',
    },
    // chevron column removed
  ]

  const updateManualTestCase = (id: string, updates: Partial<TestCaseRow>) => {
    setManualTestCases((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const updateManualTestCaseStep = (id: string, stepN: number, updates: Partial<TestStep>) => {
    setManualTestCases((prev) =>
      prev.map((item) => {
        if (item.id !== id || !item.steps) return item
        return {
          ...item,
          steps: item.steps.map((step) => (step.n === stepN ? { ...step, ...updates } : step)),
        }
      }),
    )
  }

  return (
    <>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <Button type="primary" size="small" onClick={() => {
          const newId = Date.now().toString()
          setManualTestCases((prev) => [
            ...prev,
            {
              id: newId,
              name: '',
              priority: 'Low',
              expectedResult: '',
              description: '',
              tags: '',
              steps: [{ n: 1, action: '', expected: '' }],
            },
          ])
          setExpandedRowIds([...expandedRowIds, newId])
        }}>
          Add Test Case
        </Button>
      </div>
      <Table<TestCaseRow>
        size="small"
        rowKey="id"
        columns={columns.map((col) => {
          if (!('dataIndex' in col) || typeof col.dataIndex !== 'string') {
            return col
          }

          const editableFields = ['name', 'description', 'priority', 'expectedResult', 'tags'] as const
          const dataIndex = col.dataIndex as keyof TestCaseRow
          if (!editableFields.includes(dataIndex as typeof editableFields[number])) {
            return col
          }

          return {
            ...col,
            render: (value: string, row: TestCaseRow) => (
              <Input
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value
                  updateManualTestCase(row.id, { [dataIndex]: newValue } as Partial<TestCaseRow>)
                }}
                size="small"
              />
            ),
          }
        })}
        dataSource={dataSource}
        pagination={false}
        expandedRowKeys={expandedRowIds}
        onExpand={(expanded, record) => {
          setExpandedRowIds((ids) =>
            expanded
              ? [...ids, record.id]
              : ids.filter((id) => id !== record.id)
          )
        }}
        expandable={{
          expandedRowRender: (record) => {
            const tc = testCases.find((t) => t.id === record.id)
            if (!tc) return null
            return (
              <div>
                <Table<TestStep>
                  size="small"
                  rowKey="n"
                  pagination={false}
                  columns={[
                    {
                      title: '#',
                      dataIndex: 'n',
                      width: 48,
                    },
                    {
                      title: 'Action',
                      dataIndex: 'action',
                      render: (value: string, step: TestStep) => (
                        <Input
                          value={value}
                          onChange={(e) => {
                            const newValue = e.target.value
                            updateManualTestCaseStep(tc.id, step.n, { action: newValue })
                          }}
                          size="small"
                        />
                      ),
                    },
                    {
                      title: 'Expected Result',
                      dataIndex: 'expected',
                      render: (value: string, step: TestStep) => (
                        <Input
                          value={value}
                          onChange={(e) => {
                            const newValue = e.target.value
                            updateManualTestCaseStep(tc.id, step.n, { expected: newValue })
                          }}
                          size="small"
                        />
                      ),
                    },
                  ]}
                  dataSource={tc.steps || newSteps}
                />
                <Button
                  size="small"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    if (tc.steps) {
                      const nextN = tc.steps.length + 1
                      setManualTestCases((prev) =>
                        prev.map((item) =>
                          item.id === tc.id
                            ? { ...item, steps: [...item.steps, { n: nextN, action: '', expected: '' }] }
                            : item,
                        ),
                      )
                    }
                  }}
                >
                  Add Step
                </Button>
              </div>
            )
          },
        }}
      />
      <Modal
        title="Add Test Case"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          const caseToAdd: TestCaseRow = {
            id: Date.now().toString(),
            name: newTestCase.name,
            priority: newTestCase.priority,
            expectedResult: newTestCase.expectedResult,
            description: newTestCase.description,
            tags: newTestCase.tags,
            steps: newSteps.map((s, idx) => ({ n: idx + 1, action: s.action, expected: s.expected })),
          }
          setManualTestCases((prev) => [...prev, caseToAdd])
          setIsModalVisible(false)
          setNewTestCase({ id: '', name: '', priority: 'Low', expectedResult: '', steps: [], description: '', tags: '' })
          setNewSteps([{ n: 1, action: '', expected: '' }])
        }}
      >
        <Input
          placeholder="Name"
          value={newTestCase.name}
          onChange={e => setNewTestCase({ ...newTestCase, name: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Priority"
          value={newTestCase.priority}
          onChange={e => setNewTestCase({ ...newTestCase, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Expected Result"
          value={newTestCase.expectedResult}
          onChange={e => setNewTestCase({ ...newTestCase, expectedResult: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Description"
          value={newTestCase.description}
          onChange={e => setNewTestCase({ ...newTestCase, description: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Tags"
          value={newTestCase.tags}
          onChange={e => setNewTestCase({ ...newTestCase, tags: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 500 }}>Steps:</span>
          {newSteps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <Input
                placeholder="Action"
                value={step.action}
                onChange={e => {
                  const steps = [...newSteps]
                  steps[idx].action = e.target.value
                  setNewSteps(steps)
                }}
                style={{ width: 120 }}
              />
              <Input
                placeholder="Expected"
                value={step.expected}
                onChange={e => {
                  const steps = [...newSteps]
                  steps[idx].expected = e.target.value
                  setNewSteps(steps)
                }}
                style={{ width: 120 }}
              />
              <Button size="small" onClick={() => setNewSteps(newSteps.filter((_, i) => i !== idx))}>
                Remove
              </Button>
            </div>
          ))}
          <Button size="small" onClick={() => setNewSteps([...newSteps, { n: newSteps.length + 1, action: '', expected: '' }])}>
            Add Step
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default TestCaseTable


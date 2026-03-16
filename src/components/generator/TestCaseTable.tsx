import { Button, Checkbox, Table, Input, Select, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TestCase, TestStep } from '../../types/generator'
import { useState } from 'react'
import styles from './TestCaseTable.module.scss'

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
]

const PRIORITY_TAG_COLOR: Record<string, string> = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
}

function PriorityBadge({ value }: { value: string }) {
  return <Tag color={PRIORITY_TAG_COLOR[value] ?? 'default'}>{value}</Tag>
}

interface TestCaseTableProps {
  testCases: TestCase[]
  selectedIds: string[]
  onToggleSelected: (id: string) => void
  onDeleteTestCase: (id: string) => void
  onDeleteSelected: () => void
  onUpdateTestCase: (id: string, updates: Partial<TestCase>) => void
  onAddTestCase: () => void
  locked?: boolean
  onUnlock?: () => void
}

function TestCaseTable({
  testCases,
  selectedIds,
  onToggleSelected,
  onDeleteTestCase,
  onDeleteSelected,
  onUpdateTestCase,
  onAddTestCase,
  locked = false,
  onUnlock,
}: TestCaseTableProps) {
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<TestCase>>({})

  const startEdit = (row: TestCase) => {
    setEditingId(row.id)
    setDraft({
      name: row.name,
      description: row.description ?? '',
      priority: row.priority,
      expectedResult: row.expectedResult,
      tags: row.tags ?? '',
    })
  }

  const saveEdit = () => {
    if (editingId) onUpdateTestCase(editingId, draft)
    setEditingId(null)
    setDraft({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft({})
  }

  const allSelected = testCases.length > 0 && testCases.every((tc) => selectedIds.includes(tc.id))
  const someSelected = testCases.some((tc) => selectedIds.includes(tc.id)) && !allSelected
  const hasSelection = selectedIds.length > 0

  const handleSelectAll = () => {
    if (allSelected) {
      testCases.forEach((tc) => { if (selectedIds.includes(tc.id)) onToggleSelected(tc.id) })
    } else {
      testCases.forEach((tc) => { if (!selectedIds.includes(tc.id)) onToggleSelected(tc.id) })
    }
  }

  const columns: ColumnsType<TestCase> = [
    {
      title: (
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={handleSelectAll}
          disabled={locked}
        />
      ),
      dataIndex: 'id',
      width: 52,
      render: (value: string) => (
        <Checkbox
          checked={selectedIds.includes(value)}
          onChange={(e) => { e.nativeEvent.stopPropagation(); onToggleSelected(value) }}
          disabled={locked}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value: string, row: TestCase) =>
        !locked && row.id === editingId ? (
          <Input
            value={draft.name ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            autoFocus
            style={{ fontSize: 14, fontWeight: 500, height: 36 }}
            placeholder="Test case name"
          />
        ) : (
          <span className={value ? styles.cellName : styles.cellNameEmpty}>
            {value || 'Untitled'}
          </span>
        ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 200,
      render: (value: string | undefined, row: TestCase) =>
        !locked && row.id === editingId ? (
          <Input
            value={draft.description ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            style={{ fontSize: 13, height: 36 }}
            placeholder="Optional description"
          />
        ) : (
          <span className={value ? styles.cellText : styles.cellEmpty}>
            {value || '—'}
          </span>
        ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 140,
      render: (value: string, row: TestCase) =>
        !locked && row.id === editingId ? (
          <Select
            value={draft.priority ?? value}
            onChange={(val) => setDraft((d) => ({ ...d, priority: val as 'High' | 'Medium' | 'Low' }))}
            options={PRIORITY_OPTIONS}
            style={{ width: '100%', height: 36 }}
            labelRender={({ value: v }) => <PriorityBadge value={v as string} />}
            optionRender={(opt) => <PriorityBadge value={opt.value as string} />}
          />
        ) : (
          <PriorityBadge value={value} />
        ),
    },
    {
      title: 'Expected Result',
      dataIndex: 'expectedResult',
      render: (value: string, row: TestCase) =>
        !locked && row.id === editingId ? (
          <Input
            value={draft.expectedResult ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, expectedResult: e.target.value }))}
            style={{ fontSize: 13, height: 36 }}
            placeholder="Expected outcome"
          />
        ) : (
          <span className={value ? styles.cellText : styles.cellEmpty}>
            {value || '—'}
          </span>
        ),
    },
    {
      title: '',
      key: 'actions',
      width: 88,
      render: (_: unknown, row: TestCase) => {
        if (locked) {
          return (
            <div className={styles.lockedCell}>
              <LockOutlined />
            </div>
          )
        }
        return row.id === editingId ? (
          <div className={styles.actionGroup}>
            <Button
              type="text"
              className={styles.actionBtnSuccess}
              title="Save changes"
              onClick={(e) => { e.stopPropagation(); saveEdit() }}
              icon={<CheckOutlined />}
            />
            <Button
              type="text"
              className={styles.actionBtnNeutral}
              title="Cancel editing"
              onClick={(e) => { e.stopPropagation(); cancelEdit() }}
              icon={<CloseOutlined />}
            />
          </div>
        ) : (
          <div className={styles.actionGroup}>
            <Button
              type="text"
              className={styles.actionBtnAccent}
              title="Edit test case"
              onClick={(e) => { e.stopPropagation(); startEdit(row) }}
              icon={<EditOutlined />}
            />
            <Button
              type="text"
              className={styles.actionBtnDanger}
              title="Delete test case"
              onClick={(e) => { e.stopPropagation(); onDeleteTestCase(row.id) }}
              icon={<DeleteOutlined />}
            />
          </div>
        )
      },
    },
  ]

  return (
    <>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.count}>
          {testCases.length} test case{testCases.length !== 1 ? 's' : ''}
        </span>

        {locked ? (
          <Button
            icon={<LockOutlined />}
            onClick={onUnlock}
          >
            Edit &amp; Regenerate Script
          </Button>
        ) : hasSelection ? (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onDeleteSelected}
          >
            Delete ({selectedIds.length})
          </Button>
        ) : (
          <Button
            icon={<PlusOutlined />}
            onClick={onAddTestCase}
          >
            Add Test Case
          </Button>
        )}
      </div>

      <Table<TestCase>
        size="middle"
        rowKey="id"
        columns={columns}
        dataSource={testCases}
        pagination={false}
        expandedRowKeys={expandedRowIds}
        onExpand={(expanded, record) => {
          setExpandedRowIds((ids) =>
            expanded ? [...ids, record.id] : ids.filter((id) => id !== record.id),
          )
        }}
        expandable={{
          expandedRowRender: (record) => {
            const steps = record.steps || []
            if (!steps.length) {
              return (
                <div className={styles.stepsWrapper} style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  No steps defined.
                </div>
              )
            }
            return (
              <div className={styles.stepsWrapper}>
                <Table<TestStep>
                  size="middle"
                  rowKey="n"
                  pagination={false}
                  columns={[
                    { title: '#', dataIndex: 'n', width: 52 },
                    {
                      title: 'Action',
                      dataIndex: 'action',
                      render: (val: string, step: TestStep) => (
                        <Input
                          value={val}
                          onChange={(e) => {
                            if (locked) return
                            const newSteps = steps.map((s) =>
                              s.n === step.n ? { ...s, action: e.target.value } : s,
                            )
                            onUpdateTestCase(record.id, { steps: newSteps })
                          }}
                          readOnly={locked}
                          variant="borderless"
                          style={{ fontSize: 13, height: 36, cursor: locked ? 'default' : 'text' }}
                          placeholder="Describe the action"
                        />
                      ),
                    },
                    {
                      title: 'Expected',
                      dataIndex: 'expected',
                      render: (val: string, step: TestStep) => (
                        <Input
                          value={val}
                          onChange={(e) => {
                            if (locked) return
                            const newSteps = steps.map((s) =>
                              s.n === step.n ? { ...s, expected: e.target.value } : s,
                            )
                            onUpdateTestCase(record.id, { steps: newSteps })
                          }}
                          readOnly={locked}
                          variant="borderless"
                          style={{ fontSize: 13, height: 36, cursor: locked ? 'default' : 'text' }}
                          placeholder="Expected outcome"
                        />
                      ),
                    },
                    {
                      title: '',
                      key: 'del',
                      width: 52,
                      render: (_: unknown, step: TestStep) =>
                        locked ? null : (
                          <Button
                            type="text"
                            className={styles.actionBtnDanger}
                            title="Delete step"
                            onClick={() => {
                              const newSteps = steps
                                .filter((s) => s.n !== step.n)
                                .map((s, i) => ({ ...s, n: i + 1 }))
                              onUpdateTestCase(record.id, { steps: newSteps })
                            }}
                            icon={<DeleteOutlined />}
                          />
                        ),
                    },
                  ]}
                  dataSource={steps}
                />
                {!locked && (
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      const newStep: TestStep = { n: steps.length + 1, action: '', expected: '' }
                      onUpdateTestCase(record.id, { steps: [...steps, newStep] })
                    }}
                  >
                    Add Step
                  </Button>
                )}
              </div>
            )
          },
        }}
      />
    </>
  )
}

export default TestCaseTable

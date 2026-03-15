import { Table, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TestCase, TestStep } from '../../types/generator'
import { useState } from 'react'

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
]

const PRIORITY_COLORS: Record<string, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
}

function PriorityBadge({ value }: { value: string }) {
  const color = PRIORITY_COLORS[value] || '#8b87a0'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        color,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        borderRadius: 8,
        padding: '4px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: color, flexShrink: 0 }} />
      {value}
    </span>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true">
      <path d="M1 4.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 4.5V3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2.5" y="4.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 7.5v3M8.5 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconBtn({
  title,
  onClick,
  color,
  hoverColor,
  hoverBg,
  hoverBorder,
  children,
}: {
  title: string
  onClick: (e: React.MouseEvent) => void
  color?: string
  hoverColor: string
  hoverBg: string
  hoverBorder: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={(e) => { e.stopPropagation(); onClick(e) }}
      style={{
        minWidth: 36,
        minHeight: 36,
        width: 36,
        height: 36,
        borderRadius: 8,
        border: '1px solid transparent',
        background: 'transparent',
        color: color ?? 'var(--text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        lineHeight: 1,
        transition: 'all 0.12s ease',
        flexShrink: 0,
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor
        e.currentTarget.style.background = hoverBg
        e.currentTarget.style.borderColor = hoverBorder
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = color ?? 'var(--text-muted)'
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

interface TestCaseTableProps {
  testCases: TestCase[]
  selectedIds: string[]
  onToggleSelected: (id: string) => void
  onDeleteTestCase: (id: string) => void
  onDeleteSelected: () => void
  onUpdateTestCase: (id: string, updates: Partial<TestCase>) => void
  onAddTestCase: () => void
}

function TestCaseTable({
  testCases,
  selectedIds,
  onToggleSelected,
  onDeleteTestCase,
  onDeleteSelected,
  onUpdateTestCase,
  onAddTestCase,
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
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => { if (el) el.indeterminate = someSelected }}
          onChange={handleSelectAll}
          style={{ cursor: 'pointer', width: 16, height: 16 }}
        />
      ),
      dataIndex: 'id',
      width: 52,
      render: (value: string) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(value)}
          onChange={(e) => { e.stopPropagation(); onToggleSelected(value) }}
          style={{ cursor: 'pointer', width: 16, height: 16 }}
        />
      ),
    },
    {
      title: <span style={{ fontSize: 12, fontWeight: 600 }}>Name</span>,
      dataIndex: 'name',
      render: (value: string, row: TestCase) =>
        row.id === editingId ? (
          <Input
            value={draft.name ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            autoFocus
            style={{ fontSize: 14, fontWeight: 500, height: 36 }}
            placeholder="Test case name"
          />
        ) : (
          <span style={{ fontSize: 13, fontWeight: 500, color: value ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: value ? 'normal' : 'italic', lineHeight: '22px' }}>
            {value || 'Untitled'}
          </span>
        ),
    },
    {
      title: <span style={{ fontSize: 12, fontWeight: 600 }}>Description</span>,
      dataIndex: 'description',
      width: 200,
      render: (value: string | undefined, row: TestCase) =>
        row.id === editingId ? (
          <Input
            value={draft.description ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            style={{ fontSize: 13, height: 36 }}
            placeholder="Optional description"
          />
        ) : (
          <span style={{ fontSize: 13, color: value ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: '22px' }}>
            {value || '—'}
          </span>
        ),
    },
    {
      title: <span style={{ fontSize: 12, fontWeight: 600 }}>Priority</span>,
      dataIndex: 'priority',
      width: 140,
      render: (value: string, row: TestCase) =>
        row.id === editingId ? (
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
      title: <span style={{ fontSize: 12, fontWeight: 600 }}>Expected Result</span>,
      dataIndex: 'expectedResult',
      render: (value: string, row: TestCase) =>
        row.id === editingId ? (
          <Input
            value={draft.expectedResult ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, expectedResult: e.target.value }))}
            style={{ fontSize: 13, height: 36 }}
            placeholder="Expected outcome"
          />
        ) : (
          <span style={{ fontSize: 13, color: value ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: '22px' }}>
            {value || '—'}
          </span>
        ),
    },
    {
      title: '',
      key: 'actions',
      width: 88,
      render: (_: unknown, row: TestCase) =>
        row.id === editingId ? (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <IconBtn
              title="Save changes"
              onClick={saveEdit}
              color="#16a34a"
              hoverColor="#16a34a"
              hoverBg="rgba(22,163,74,0.1)"
              hoverBorder="rgba(22,163,74,0.3)"
            >
              {/* checkmark */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconBtn>
            <IconBtn
              title="Cancel editing"
              onClick={cancelEdit}
              hoverColor="var(--text-secondary)"
              hoverBg="rgba(100,100,120,0.08)"
              hoverBorder="rgba(100,100,120,0.2)"
            >
              {/* x-mark */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </IconBtn>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <IconBtn
              title="Edit test case"
              onClick={() => startEdit(row)}
              hoverColor="var(--accent)"
              hoverBg="var(--accent-subtle)"
              hoverBorder="var(--accent-border)"
            >
              {/* pencil icon */}
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M10.5 2a1.5 1.5 0 0 1 2.12 2.12L5.5 11.24 3 12l.76-2.5L10.5 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
              </svg>
            </IconBtn>
            <IconBtn
              title="Delete test case"
              onClick={() => onDeleteTestCase(row.id)}
              hoverColor="#ef4444"
              hoverBg="rgba(239,68,68,0.09)"
              hoverBorder="rgba(239,68,68,0.25)"
            >
              <TrashIcon />
            </IconBtn>
          </div>
        ),
    },
  ]

  return (
    <>
      {/* Toolbar */}
      <div
        style={{
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          {testCases.length} test case{testCases.length !== 1 ? 's' : ''}
        </span>

        {hasSelection ? (
          <button
            type="button"
            onClick={onDeleteSelected}
            style={{
              height: 36,
              padding: '0 16px',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.05)',
              color: '#ef4444',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.05)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
            }}
          >
            <TrashIcon />
            Delete ({selectedIds.length})
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddTestCase}
            style={{
              height: 36,
              padding: '0 16px',
              border: '1px dashed var(--border-mid)',
              borderRadius: 10,
              background: 'transparent',
              color: 'var(--accent)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-subtle)'
              e.currentTarget.style.borderStyle = 'solid'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderStyle = 'dashed'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Test Case
          </button>
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
                <div style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-muted)' }}>
                  No steps defined.
                </div>
              )
            }
            return (
              <div style={{ padding: '10px 16px 16px' }}>
                <Table<TestStep>
                  size="middle"
                  rowKey="n"
                  pagination={false}
                  columns={[
                    { title: <span style={{ fontSize: 12, fontWeight: 600 }}>#</span>, dataIndex: 'n', width: 52 },
                    {
                      title: <span style={{ fontSize: 12, fontWeight: 600 }}>Action</span>,
                      dataIndex: 'action',
                      render: (val: string, step: TestStep) => (
                        <Input
                          value={val}
                          onChange={(e) => {
                            const newSteps = steps.map((s) =>
                              s.n === step.n ? { ...s, action: e.target.value } : s,
                            )
                            onUpdateTestCase(record.id, { steps: newSteps })
                          }}
                          variant="borderless"
                          style={{ fontSize: 13, height: 36 }}
                          placeholder="Describe the action"
                        />
                      ),
                    },
                    {
                      title: <span style={{ fontSize: 12, fontWeight: 600 }}>Expected</span>,
                      dataIndex: 'expected',
                      render: (val: string, step: TestStep) => (
                        <Input
                          value={val}
                          onChange={(e) => {
                            const newSteps = steps.map((s) =>
                              s.n === step.n ? { ...s, expected: e.target.value } : s,
                            )
                            onUpdateTestCase(record.id, { steps: newSteps })
                          }}
                          variant="borderless"
                          style={{ fontSize: 13, height: 36 }}
                          placeholder="Expected outcome"
                        />
                      ),
                    },
                    {
                      title: '',
                      key: 'del',
                      width: 52,
                      render: (_: unknown, step: TestStep) => (
                        <IconBtn
                          title="Delete step"
                          onClick={() => {
                            const newSteps = steps
                              .filter((s) => s.n !== step.n)
                              .map((s, i) => ({ ...s, n: i + 1 }))
                            onUpdateTestCase(record.id, { steps: newSteps })
                          }}
                          hoverColor="#ef4444"
                          hoverBg="rgba(239,68,68,0.09)"
                          hoverBorder="rgba(239,68,68,0.25)"
                        >
                          <TrashIcon />
                        </IconBtn>
                      ),
                    },
                  ]}
                  dataSource={steps}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newStep: TestStep = { n: steps.length + 1, action: '', expected: '' }
                    onUpdateTestCase(record.id, { steps: [...steps, newStep] })
                  }}
                  style={{
                    marginTop: 10,
                    height: 34,
                    padding: '0 14px',
                    border: '1px dashed var(--border-mid)',
                    borderRadius: 8,
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.borderColor = 'var(--accent-border)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.borderColor = 'var(--border-mid)'
                  }}
                >
                  + Add Step
                </button>
              </div>
            )
          },
        }}
      />
    </>
  )
}

export default TestCaseTable

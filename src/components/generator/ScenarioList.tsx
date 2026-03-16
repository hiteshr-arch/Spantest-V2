import { useState } from 'react'
import { Button, Checkbox, Input, Select, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { ScenarioSummary } from '../../types/generator'
import styles from './ScenarioList.module.scss'

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

interface ScenarioListProps {
  scenarios: ScenarioSummary[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onAdd: (scenario: ScenarioSummary) => void
  onUpdate: (scenario: ScenarioSummary) => void
  onDelete: (id: string) => void
  onGenerateTestCases: () => void
  isGenerating: boolean
}

function ScenarioList({
  scenarios,
  selectedIds,
  onToggle,
  onSelectAll,
  onAdd,
  onUpdate,
  onDelete,
  onGenerateTestCases,
  isGenerating,
}: ScenarioListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<ScenarioSummary>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newDraft, setNewDraft] = useState<Partial<ScenarioSummary>>({ priority: 'Medium' })

  const allSelected = scenarios.length > 0 && scenarios.every((s) => selectedIds.includes(s.id))
  const someSelected = scenarios.some((s) => selectedIds.includes(s.id)) && !allSelected
  const hasSelection = selectedIds.length > 0

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectAll([])
    } else {
      onSelectAll(scenarios.map((s) => s.id))
    }
  }

  const startEdit = (s: ScenarioSummary) => {
    setEditingId(s.id)
    setDraft({ name: s.name, description: s.description, priority: s.priority })
  }

  const saveEdit = () => {
    const target = scenarios.find((s) => s.id === editingId)
    if (target && draft.name?.trim()) {
      onUpdate({ ...target, ...draft, name: draft.name.trim(), description: draft.description ?? '' })
    }
    setEditingId(null)
    setDraft({})
  }

  const cancelEdit = () => { setEditingId(null); setDraft({}) }

  const commitAdd = () => {
    if (!newDraft.name?.trim()) return
    onAdd({
      id: `scn-${Date.now()}`,
      name: newDraft.name.trim(),
      description: newDraft.description ?? '',
      priority: (newDraft.priority as ScenarioSummary['priority']) ?? 'Medium',
    })
    setIsAdding(false)
    setNewDraft({ priority: 'Medium' })
  }

  return (
    <div className={styles.wrapper}>
      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={handleSelectAll}
            title={allSelected ? 'Deselect all' : 'Select all'}
          />
          <div className={styles.headerLeft}>
            <span className={styles.countDot} />
            <span className={styles.countText}>
              {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}
              {hasSelection && (
                <span className={styles.countSelected}>
                  · {selectedIds.length} selected
                </span>
              )}
            </span>
          </div>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => { setIsAdding(true); setNewDraft({ priority: 'Medium' }) }}
          disabled={isAdding}
        >
          Add Scenario
        </Button>
      </div>

      {/* Scenario cards */}
      <div className={styles.cardList}>
        {scenarios.map((s) => {
          const isSelected = selectedIds.includes(s.id)
          const isEditing = s.id === editingId

          const cardClass = [
            styles.scenarioCard,
            isSelected ? styles.scenarioCardSelected : '',
            isEditing ? styles.scenarioCardEditing : '',
          ].filter(Boolean).join(' ')

          return (
            <div
              key={s.id}
              className={cardClass}
              onClick={() => { if (!isEditing) onToggle(s.id) }}
            >
              {isEditing ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <div className={styles.editRow}>
                    <Input
                      value={draft.name ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      placeholder="Scenario name"
                      style={{ flex: 1, height: 34 }}
                      autoFocus
                    />
                    <Select
                      value={draft.priority ?? 'Medium'}
                      onChange={(val) => setDraft((d) => ({ ...d, priority: val as ScenarioSummary['priority'] }))}
                      options={PRIORITY_OPTIONS}
                      style={{ width: 110, height: 34 }}
                    />
                  </div>
                  <Input
                    value={draft.description ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Description (optional)"
                    style={{ marginBottom: 10, height: 34 }}
                  />
                  <div className={styles.editActions}>
                    <Button type="primary" size="small" onClick={saveEdit}>Save</Button>
                    <Button size="small" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className={styles.cardRow}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onToggle(s.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginTop: 3, flexShrink: 0 }}
                  />
                  <div className={styles.cardBody}>
                    <div className={styles.cardTitleRow}>
                      <span className={styles.cardTitle}>{s.name}</span>
                      <PriorityBadge value={s.priority} />
                    </div>
                    {s.description && (
                      <div className={styles.cardDesc}>{s.description}</div>
                    )}
                  </div>
                  <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="text"
                      className={styles.actionBtnAccent}
                      title="Edit scenario"
                      onClick={() => startEdit(s)}
                      icon={<EditOutlined />}
                    />
                    <Button
                      type="text"
                      className={styles.actionBtnDanger}
                      title="Delete scenario"
                      onClick={() => onDelete(s.id)}
                      icon={<DeleteOutlined />}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add new scenario inline form */}
        {isAdding && (
          <div className={styles.addCard}>
            <div style={{ padding: '12px 14px' }}>
              <div className={styles.editRow}>
                <Input
                  value={newDraft.name ?? ''}
                  onChange={(e) => setNewDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="Scenario name"
                  style={{ flex: 1, height: 34 }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitAdd()
                    if (e.key === 'Escape') { setIsAdding(false); setNewDraft({ priority: 'Medium' }) }
                  }}
                />
                <Select
                  value={newDraft.priority ?? 'Medium'}
                  onChange={(val) => setNewDraft((d) => ({ ...d, priority: val as ScenarioSummary['priority'] }))}
                  options={PRIORITY_OPTIONS}
                  style={{ width: 110, height: 34 }}
                />
              </div>
              <Input
                value={newDraft.description ?? ''}
                onChange={(e) => setNewDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Description (optional)"
                style={{ marginBottom: 10, height: 34 }}
              />
              <div className={styles.editActions}>
                <Button
                  type="primary"
                  size="small"
                  onClick={commitAdd}
                  disabled={!newDraft.name?.trim()}
                >
                  Add
                </Button>
                <Button
                  size="small"
                  onClick={() => { setIsAdding(false); setNewDraft({ priority: 'Medium' }) }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA — Generate Test Cases */}
      <div className={styles.ctaWrapper}>
        <Button
          type="primary"
          block
          className={styles.ctaBtn}
          onClick={onGenerateTestCases}
          disabled={!hasSelection || isGenerating}
          loading={isGenerating}
          icon={
            !isGenerating ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L2 7.5h4L5 12.5l7-7H8l1-4z" fill="currentColor" />
              </svg>
            ) : undefined
          }
        >
          {isGenerating ? 'Generating test cases…' : (
            hasSelection
              ? <>Generate Test Cases <Tag color="default" style={{ marginLeft: 4 }}>{selectedIds.length}</Tag></>
              : 'Generate Test Cases — select scenarios first'
          )}
        </Button>
      </div>
    </div>
  )
}

export default ScenarioList

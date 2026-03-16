import { useState } from 'react'
import { Input, Select } from 'antd'
import type { ScenarioSummary } from '../../types/generator'

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
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        color,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        borderRadius: 6,
        padding: '3px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 999, background: color, flexShrink: 0 }} />
      {value}
    </span>
  )
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

  const hasSelection = selectedIds.length > 0

  return (
    <div style={{ padding: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Select-all checkbox */}
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected }}
            onChange={handleSelectAll}
            style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--accent, #7c3aed)', flexShrink: 0 }}
            title={allSelected ? 'Deselect all' : 'Select all'}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--green, #10b981)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}
              {hasSelection && (
                <span style={{ color: 'var(--accent, #7c3aed)', marginLeft: 4 }}>
                  · {selectedIds.length} selected
                </span>
              )}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setIsAdding(true); setNewDraft({ priority: 'Medium' }) }}
          disabled={isAdding}
          style={{
            height: 34,
            padding: '0 14px',
            border: '1px dashed var(--border-mid, rgba(124,58,237,0.2))',
            borderRadius: 9,
            background: 'transparent',
            color: 'var(--accent, #7c3aed)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: isAdding ? 0.5 : 1,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Scenario
        </button>
      </div>

      {/* Scenario cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {scenarios.map((s) => {
          const isSelected = selectedIds.includes(s.id)
          const isEditing = s.id === editingId

          return (
            <div
              key={s.id}
              onClick={() => { if (!isEditing) onToggle(s.id) }}
              style={{
                border: `1.5px solid ${isSelected ? 'var(--accent, #7c3aed)' : 'var(--border, rgba(124,58,237,0.12))'}`,
                borderRadius: 12,
                padding: '12px 14px',
                background: isSelected ? 'var(--accent-subtle, rgba(124,58,237,0.05))' : 'var(--surface-raised, #fafafa)',
                cursor: isEditing ? 'default' : 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {isEditing ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
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
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={saveEdit}
                      style={{ height: 30, padding: '0 14px', borderRadius: 8, border: 'none', background: 'var(--accent, #7c3aed)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      style={{ height: 30, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-mid)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(s.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginTop: 3, width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--accent, #7c3aed)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: '20px' }}>
                        {s.name}
                      </span>
                      <PriorityBadge value={s.priority} />
                    </div>
                    {s.description && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: '18px' }}>
                        {s.description}
                      </div>
                    )}
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      title="Edit scenario"
                      onClick={() => startEdit(s)}
                      style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid transparent', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-subtle)'; e.currentTarget.style.borderColor = 'var(--accent-border)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                        <path d="M10.5 2a1.5 1.5 0 0 1 2.12 2.12L5.5 11.24 3 12l.76-2.5L10.5 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Delete scenario"
                      onClick={() => onDelete(s.id)}
                      style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid transparent', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.09)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                    >
                      <svg width="13" height="14" viewBox="0 0 14 15" fill="none" aria-hidden="true">
                        <path d="M1 4.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M5 4.5V3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="2.5" y="4.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5.5 7.5v3M8.5 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add new scenario inline form */}
        {isAdding && (
          <div
            style={{
              border: '1.5px dashed var(--accent-border, rgba(124,58,237,0.3))',
              borderRadius: 12,
              padding: '12px 14px',
              background: 'var(--accent-subtle, rgba(124,58,237,0.03))',
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Input
                value={newDraft.name ?? ''}
                onChange={(e) => setNewDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Scenario name"
                style={{ flex: 1, height: 34 }}
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setIsAdding(false); setNewDraft({ priority: 'Medium' }) } }}
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
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={commitAdd}
                disabled={!newDraft.name?.trim()}
                style={{ height: 30, padding: '0 14px', borderRadius: 8, border: 'none', background: 'var(--accent, #7c3aed)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: newDraft.name?.trim() ? 'pointer' : 'not-allowed', opacity: newDraft.name?.trim() ? 1 : 0.5 }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setNewDraft({ priority: 'Medium' }) }}
                style={{ height: 30, padding: '0 14px', borderRadius: 8, border: '1px solid var(--border-mid)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CTA — Generate Test Cases */}
      <div style={{ paddingTop: 4 }}>
        <button
          type="button"
          onClick={onGenerateTestCases}
          disabled={!hasSelection || isGenerating}
          style={{
            width: '100%',
            height: 44,
            borderRadius: 12,
            border: 'none',
            background: hasSelection && !isGenerating ? 'var(--accent, #7c3aed)' : 'var(--border-mid, rgba(124,58,237,0.12))',
            color: hasSelection && !isGenerating ? '#fff' : 'var(--text-muted)',
            fontSize: 14,
            fontWeight: 700,
            cursor: hasSelection && !isGenerating ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-display)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background 0.15s',
          }}
        >
          {isGenerating ? (
            <>Generating test cases…</>
          ) : hasSelection ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L2 7.5h4L5 12.5l7-7H8l1-4z" fill="currentColor" />
              </svg>
              Generate Test Cases
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '1px 8px' }}>
                {selectedIds.length}
              </span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L2 7.5h4L5 12.5l7-7H8l1-4z" fill="currentColor" />
              </svg>
              Generate Test Cases
              <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}> — select scenarios first</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ScenarioList

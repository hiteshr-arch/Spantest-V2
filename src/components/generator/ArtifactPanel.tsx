import { Button } from 'antd'
import type { ArtifactKind, GenerateType, ScenarioSummary, TestCase, RepositoryFolder, RepositoryItem } from '../../types/generator'
import ScenarioList from './ScenarioList'
import TestCaseTable from './TestCaseTable'
import ScriptBlock from './ScriptBlock'
import styles from './ArtifactPanel.module.scss'

interface ArtifactPanelProps {
  artifactKind: ArtifactKind
  isGenerating: boolean
  generateType: GenerateType | null
  // ScenarioList props
  scenarioSummaries: ScenarioSummary[]
  selectedScenarioIds: string[]
  onToggleScenario: (id: string) => void
  onSelectAllScenarios: (ids: string[]) => void
  onAddScenario: (s: ScenarioSummary) => void
  onUpdateScenario: (s: ScenarioSummary) => void
  onDeleteScenario: (id: string) => void
  onGenerateTestCases: () => void
  // TestCaseTable props
  testCases: TestCase[]
  selectedTCIds: string[]
  onToggleTC: (id: string) => void
  onDeleteTC: (id: string) => void
  onDeleteSelected: () => void
  onUpdateTC: (id: string, updates: Partial<TestCase>) => void
  onAddTC: () => void
  generatedScript: string | null
  onUnlock: () => void
  onGenerateScript: () => void
  // Repository
  onSaveToRepository: () => void
  repositoryFolders: RepositoryFolder[]
  repositoryItems: RepositoryItem[]
}

export default function ArtifactPanel({
  artifactKind,
  isGenerating,
  generateType,
  scenarioSummaries,
  selectedScenarioIds,
  onToggleScenario,
  onSelectAllScenarios,
  onAddScenario,
  onUpdateScenario,
  onDeleteScenario,
  onGenerateTestCases,
  testCases,
  selectedTCIds,
  onToggleTC,
  onDeleteTC,
  onDeleteSelected,
  onUpdateTC,
  onAddTC,
  generatedScript,
  onUnlock,
  onGenerateScript,
  onSaveToRepository,
}: ArtifactPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          {artifactKind === 'scenarios' && 'Scenarios'}
          {artifactKind === 'testcases' && 'Test Cases'}
          {artifactKind === null && 'Output'}
        </span>
        {artifactKind !== null && (
          <Button
            size="small"
            type="primary"
            onClick={onSaveToRepository}
            className={styles.saveBtn}
          >
            Save to Repository
          </Button>
        )}
      </div>

      <div className={styles.body}>
        {isGenerating && artifactKind === null && (
          <div className={styles.generating}>
            <div className={styles.generatingDot} />
            <div className={styles.generatingText}>Generating…</div>
            <div className={styles.generatingCost}>–3 tokens</div>
          </div>
        )}

        {!isGenerating && artifactKind === null && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◻</div>
            <div className={styles.emptyTitle}>Nothing generated yet</div>
            <div className={styles.emptySub}>
              Start a conversation on the left to generate test cases or scenarios
            </div>
          </div>
        )}

        {artifactKind === 'scenarios' && (
          <ScenarioList
            scenarios={scenarioSummaries}
            selectedIds={selectedScenarioIds}
            onToggle={onToggleScenario}
            onSelectAll={onSelectAllScenarios}
            onAdd={onAddScenario}
            onUpdate={onUpdateScenario}
            onDelete={onDeleteScenario}
            onGenerateTestCases={onGenerateTestCases}
            isGenerating={isGenerating}
          />
        )}

        {artifactKind === 'testcases' && (
          <>
            <TestCaseTable
              testCases={testCases}
              selectedIds={selectedTCIds}
              onToggleSelected={onToggleTC}
              onDeleteTestCase={onDeleteTC}
              onDeleteSelected={onDeleteSelected}
              onUpdateTestCase={onUpdateTC}
              onAddTestCase={onAddTC}
              locked={!!generatedScript}
              onUnlock={onUnlock}
            />
            {generatedScript && (
              <div className={styles.scriptSection}>
                <ScriptBlock script={generatedScript} />
              </div>
            )}
            {!generatedScript && selectedTCIds.length > 0 && (
              <div className={styles.bottomBar}>
                <span className={styles.bottomBarInfo}>
                  {selectedTCIds.length} test case{selectedTCIds.length > 1 ? 's' : ''} selected
                </span>
                <Button type="primary" size="small" onClick={onGenerateScript}>
                  Generate Script
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

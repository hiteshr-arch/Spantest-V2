import { useMemo, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { message } from 'antd'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
  addChatMessage,
  setConversationStage,
  setTestType,
  setGenerateType,
  setArtifactKind,
  resetConversation,
  setScenarioSummaries,
  addScenarioSummary,
  updateScenarioSummary,
  deleteScenarioSummary,
  toggleSelectedScenarioId,
  setSelectedScenarioIds,
  setScenarios,
  adjustTokens,
  toggleTestCaseSelected,
  clearSelectedTestCases,
  setGeneratedScript,
  addRepositoryFolder,
  addRepositoryItems,
} from '../store/spantestSlice'
import type { TestCase, TestStep, ChatMessage, ChatAttachment, RepositoryItem } from '../types/generator'
import { TOKEN_COSTS } from '../config/pricing'
import {
  generateScenarioSummaries,
  generateTestCasesForScenario,
  generateFromStory,
} from '../services/generatorApi'
import styles from './GeneratorPage.module.scss'
import ChatPanel from '../components/generator/ChatPanel'
import ArtifactPanel from '../components/generator/ArtifactPanel'
import SaveToRepositoryModal from '../components/generator/SaveToRepositoryModal'

function makeMsg(
  role: ChatMessage['role'],
  text: string,
  quickReplies?: ChatMessage['quickReplies'],
  attachments?: ChatAttachment[],
  actions?: ChatMessage['actions'],
): ChatMessage {
  return { id: `${Date.now()}-${Math.random()}`, role, text, quickReplies, attachments, actions, timestamp: Date.now() }
}

function GeneratorPage() {
  const dispatch = useAppDispatch()
  const params = useParams()
  const projectId = params.projectId ?? 'ecommerce-app'

  const tokens = useAppSelector((s) => s.spantest.tokens)
  const conversationStage = useAppSelector((s) => s.spantest.conversationStage)
  const chatMessages = useAppSelector((s) => s.spantest.chatMessages)
  const testType = useAppSelector((s) => s.spantest.testType)
  const generateType = useAppSelector((s) => s.spantest.generateType)
  const artifactKind = useAppSelector((s) => s.spantest.artifactKind)
  const scenarioSummaries = useAppSelector((s) => s.spantest.scenarioSummaries)
  const selectedScenarioIds = useAppSelector((s) => s.spantest.selectedScenarioIds)
  const scenarios = useAppSelector((s) => s.spantest.scenarios)
  const selectedTCIds = useAppSelector((s) => s.spantest.selectedTCIds)
  const generatedScript = useAppSelector((s) => s.spantest.generatedScript)
  const repositoryFolders = useAppSelector((s) => s.spantest.repositoryFolders)
  const repositoryItems = useAppSelector((s) => s.spantest.repositoryItems)

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [manualTestCases, setManualTestCases] = useState<TestCase[]>([])
  const lastPromptRef = useRef<string>('')

  const testCases: TestCase[] = useMemo(
    () => [...scenarios.map((s) => s.testCase), ...manualTestCases],
    [scenarios, manualTestCases],
  )

  // ─── Conversation orchestration ──────────────────────────────────────────

  function handleSubmitPrompt(text: string, attachments: ChatAttachment[] = []) {
    dispatch(resetConversation())
    setManualTestCases([])
    lastPromptRef.current = text

    dispatch(addChatMessage(makeMsg('user', text, undefined, attachments.length > 0 ? attachments : undefined)))
    dispatch(addChatMessage(makeMsg('system', 'Do you want to test at UI level or API level?', [
      { label: 'UI', value: 'ui' },
      { label: 'API', value: 'api' },
    ])))
    dispatch(setConversationStage('awaiting_test_type'))
  }

  async function handleQuickReply(value: string) {
    if (conversationStage === 'awaiting_test_type') {
      if (tokens < TOKEN_COSTS.generateBatch) {
        dispatch(addChatMessage(makeMsg('system', `Not enough tokens to generate. You need at least ${TOKEN_COSTS.generateBatch} tokens.`)))
        return
      }
      dispatch(addChatMessage(makeMsg('user', value === 'ui' ? 'UI' : 'API')))
      dispatch(setTestType(value as 'ui' | 'api'))

      if (value === 'api') {
        dispatch(addChatMessage(makeMsg('system', 'Generating test cases for your story…')))
        dispatch(setConversationStage('generating'))
        await runApiGeneration()
      } else {
        dispatch(addChatMessage(makeMsg('system', 'What would you like to generate?', [
          { label: 'Scenarios', value: 'scenarios' },
          { label: 'Test Cases', value: 'testcases' },
        ])))
        dispatch(setConversationStage('awaiting_generate_type'))
      }
      return
    }

    if (conversationStage === 'awaiting_generate_type') {
      dispatch(addChatMessage(makeMsg('user', value === 'scenarios' ? 'Scenarios' : 'Test Cases')))
      dispatch(setGenerateType(value as 'scenarios' | 'testcases'))
      dispatch(addChatMessage(makeMsg('system', value === 'scenarios' ? 'Generating scenarios…' : 'Generating test cases…')))
      dispatch(setConversationStage('generating'))
      await runUiGeneration(value as 'scenarios' | 'testcases')
    }
  }

  async function runApiGeneration() {
    setIsGenerating(true)
    try {
      const { scenarios: nextScenarios } = await generateFromStory(lastPromptRef.current)
      dispatch(setScenarios(nextScenarios))
      dispatch(setGeneratedScript(null))
      dispatch(setArtifactKind('testcases'))
      dispatch(adjustTokens(-TOKEN_COSTS.generateBatch))
      dispatch(addChatMessage(makeMsg('system', `Generated ${nextScenarios.length} test cases. Review and edit them, then generate a script.`)))
      dispatch(setConversationStage('results'))
    } catch {
      dispatch(addChatMessage(makeMsg('system', 'Something went wrong. Please try again.')))
      dispatch(setConversationStage('idle'))
    } finally {
      setIsGenerating(false)
    }
  }

  async function runUiGeneration(type: 'scenarios' | 'testcases') {
    setIsGenerating(true)
    try {
      if (type === 'scenarios') {
        const { scenarioSummaries: summaries } = await generateScenarioSummaries(lastPromptRef.current)
        dispatch(setScenarioSummaries(summaries))
        dispatch(setArtifactKind('scenarios'))
        dispatch(adjustTokens(-TOKEN_COSTS.generateBatch))
        dispatch(addChatMessage(makeMsg('system', `Generated ${summaries.length} scenarios. Select the ones you want and click "Generate Test Cases".`)))
      } else {
        const { scenarios: nextScenarios } = await generateFromStory(lastPromptRef.current)
        dispatch(setScenarios(nextScenarios))
        dispatch(setGeneratedScript(null))
        dispatch(setArtifactKind('testcases'))
        dispatch(adjustTokens(-TOKEN_COSTS.generateBatch))
        dispatch(addChatMessage(makeMsg('system', `Generated ${nextScenarios.length} test cases. Review and edit them, then generate a script.`)))
      }
      dispatch(setConversationStage('results'))
    } catch {
      dispatch(addChatMessage(makeMsg('system', 'Something went wrong. Please try again.')))
      dispatch(setConversationStage('idle'))
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleGenerateTestCasesFromScenario() {
    if (!selectedScenarioIds.length) return
    const selected = scenarioSummaries.filter((s) => selectedScenarioIds.includes(s.id))
    if (!selected.length) return

    setIsGenerating(true)
    try {
      const { scenarios: newScenarios } = await generateTestCasesForScenario(selected)
      dispatch(setScenarios(newScenarios))
      dispatch(setGeneratedScript(null))
      dispatch(setArtifactKind('testcases'))
      dispatch(addChatMessage(makeMsg(
        'system',
        `Generated ${newScenarios.length} test cases from selected scenarios.`,
        undefined,
        undefined,
        [{ label: '← View scenarios', actionType: 'show_scenarios' }],
      )))
    } catch {
      dispatch(addChatMessage(makeMsg('system', 'Failed to generate test cases. Please try again.')))
    } finally {
      setIsGenerating(false)
    }
  }

  // ─── Test case CRUD ───────────────────────────────────────────────────────

  function handleAddTestCase() {
    const newTC: TestCase = {
      id: `manual-${Date.now()}`,
      name: '',
      priority: 'Low',
      expectedResult: '',
      steps: [{ n: 1, action: '', expected: '' }],
    }
    setManualTestCases((prev) => [...prev, newTC])
  }

  function handleDeleteTestCase(id: string) {
    if (scenarios.some((s) => s.testCase.id === id)) {
      dispatch(setScenarios(scenarios.filter((s) => s.testCase.id !== id)))
    } else {
      setManualTestCases((prev) => prev.filter((tc) => tc.id !== id))
      if (selectedTCIds.includes(id)) dispatch(toggleTestCaseSelected(id))
    }
  }

  function handleUpdateTestCase(id: string, updates: Partial<TestCase>) {
    if (scenarios.some((s) => s.testCase.id === id)) {
      dispatch(setScenarios(
        scenarios.map((s) =>
          s.testCase.id === id ? { ...s, testCase: { ...s.testCase, ...updates } } : s,
        ),
      ))
    } else {
      setManualTestCases((prev) =>
        prev.map((tc) => (tc.id === id ? { ...tc, ...updates } : tc)),
      )
    }
  }

  function handleBulkDelete() {
    const aiIds = new Set(selectedTCIds.filter((id) => scenarios.some((s) => s.testCase.id === id)))
    const manualIds = new Set(selectedTCIds.filter((id) => !aiIds.has(id)))
    if (aiIds.size > 0) {
      dispatch(setScenarios(scenarios.filter((s) => !aiIds.has(s.testCase.id))))
    }
    if (manualIds.size > 0) {
      setManualTestCases((prev) => prev.filter((tc) => !manualIds.has(tc.id)))
    }
    dispatch(clearSelectedTestCases())
  }

  function handleGenerateScriptFromSelection() {
    if (!selectedTCIds.length) {
      message.info('Select at least one test case to generate a script.')
      return
    }
    const selectedSteps: TestStep[] = []
    testCases.forEach((tc) => {
      if (selectedTCIds.includes(tc.id)) {
        selectedSteps.push(...tc.steps)
      }
    })
    const body = selectedSteps
      .map((step) => `  // Step ${step.n}: ${step.action}\n  // Expected: ${step.expected}`)
      .join('\n\n')
    const script = `import { test, expect } from '@playwright/test';

test('generated flow', async ({ page }) => {
${body}
});`
    dispatch(setGeneratedScript(script))
    message.success('Script generated from selected test cases.')
  }

  // ─── Chat action handler ──────────────────────────────────────────────────

  function handleMessageAction(actionType: string) {
    if (actionType === 'show_scenarios') dispatch(setArtifactKind('scenarios'))
    if (actionType === 'show_testcases') dispatch(setArtifactKind('testcases'))
  }

  // ─── Repository save ──────────────────────────────────────────────────────

  function handleSaveToRepository(
    folderId: string | null,
    items: Omit<RepositoryItem, 'id' | 'createdAt' | 'folderId'>[],
  ) {
    let resolvedFolderId: string | null = folderId

    if (typeof folderId === 'string' && folderId.startsWith('__new__:')) {
      const folderName = folderId.slice('__new__:'.length)
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: folderName,
        projectId,
        createdAt: Date.now(),
      }
      dispatch(addRepositoryFolder(newFolder))
      resolvedFolderId = newFolder.id
    }

    const fullItems: RepositoryItem[] = items.map((item) => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
      createdAt: Date.now(),
      folderId: resolvedFolderId,
    }))

    dispatch(addRepositoryItems(fullItems))
    message.success(`Saved ${fullItems.length} item${fullItems.length > 1 ? 's' : ''} to Repository`)
    dispatch(addChatMessage(makeMsg('system', `Saved ${fullItems.length} item${fullItems.length > 1 ? 's' : ''} to Repository.`)))
  }

  return (
    <div className={styles.root}>
      <ChatPanel
        conversationStage={conversationStage}
        chatMessages={chatMessages}
        isGenerating={isGenerating}
        tokens={tokens}
        onSubmitPrompt={handleSubmitPrompt}
        onQuickReply={handleQuickReply}
        onMessageAction={handleMessageAction}
      />
      <ArtifactPanel
        artifactKind={artifactKind}
        isGenerating={isGenerating}
        generateType={generateType}
        scenarioSummaries={scenarioSummaries}
        selectedScenarioIds={selectedScenarioIds}
        onToggleScenario={(id) => dispatch(toggleSelectedScenarioId(id))}
        onSelectAllScenarios={(ids) => dispatch(setSelectedScenarioIds(ids))}
        onAddScenario={(s) => dispatch(addScenarioSummary(s))}
        onUpdateScenario={(s) => dispatch(updateScenarioSummary(s))}
        onDeleteScenario={(id) => dispatch(deleteScenarioSummary(id))}
        onGenerateTestCases={handleGenerateTestCasesFromScenario}
        testCases={testCases}
        selectedTCIds={selectedTCIds}
        onToggleTC={(id) => dispatch(toggleTestCaseSelected(id))}
        onDeleteTC={handleDeleteTestCase}
        onDeleteSelected={handleBulkDelete}
        onUpdateTC={handleUpdateTestCase}
        onAddTC={handleAddTestCase}
        generatedScript={generatedScript}
        onUnlock={() => dispatch(setGeneratedScript(null))}
        onGenerateScript={handleGenerateScriptFromSelection}
        onSaveToRepository={() => setIsSaveModalOpen(true)}
        repositoryFolders={repositoryFolders}
        repositoryItems={repositoryItems}
      />
      <SaveToRepositoryModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveToRepository}
        folders={repositoryFolders}
        testCases={testCases}
        generatedScript={generatedScript}
        projectId={projectId}
      />
    </div>
  )
}

export default GeneratorPage

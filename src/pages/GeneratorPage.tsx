import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Form, Input, Select, Typography, message } from 'antd'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
  setGenerateMode,
  setGeneratorStep,
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
} from '../store/spantestSlice'
import type { GeneratorStep, TestCase, TestStep } from '../types/generator'
import { TOKEN_COSTS } from '../config/pricing'
import {
  generateScenarioSummaries,
  generateTestCasesForScenario,
  generateFromStory,
} from '../services/generatorApi'
import styles from './GeneratorPage.module.scss'
import TestCaseTable from '../components/generator/TestCaseTable'
import ScenarioList from '../components/generator/ScenarioList'
import ScriptBlock from '../components/generator/ScriptBlock'

const { TextArea } = Input
const { Title, Text, Paragraph } = Typography

const FRAMEWORK_OPTIONS = ['Playwright', 'Cypress', 'Jest', 'Selenium']
const STYLE_OPTIONS = ['BDD / Gherkin', 'Standard']

function stepClass(step: GeneratorStep, current: GeneratorStep) {
  if (step < current) return `${styles.step} ${styles.stepDone}`
  if (step === current) return `${styles.step} ${styles.stepActive}`
  return styles.step
}

function GeneratorPage() {
  const [form] = Form.useForm()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClarifyVisible, setIsClarifyVisible] = useState(false)
  const [isInputCollapsed, setIsInputCollapsed] = useState(false)
  const [clarifyAnswers, setClarifyAnswers] = useState({
    stackCoupon: '',
    expiredMessage: '',
  })

  const dispatch = useAppDispatch()
  const tokens = useAppSelector((s) => s.spantest.tokens)
  const generateMode = useAppSelector((s) => s.spantest.generateMode)
  const generatorStep = useAppSelector((s) => s.spantest.generatorStep)
  const scenarioSummaries = useAppSelector((s) => s.spantest.scenarioSummaries)
  const selectedScenarioIds = useAppSelector((s) => s.spantest.selectedScenarioIds)
  const scenarios = useAppSelector((s) => s.spantest.scenarios)
  const selectedTCIds = useAppSelector((s) => s.spantest.selectedTCIds)
  const generatedScript = useAppSelector((s) => s.spantest.generatedScript)
  const params = useParams()
  const projectId = params.projectId || 'ecommerce-app'

  useEffect(() => {
    if (!generatorStep) {
      dispatch(setGeneratorStep(1))
    }
  }, [generatorStep, dispatch])

  const [manualTestCases, setManualTestCases] = useState<TestCase[]>([])
  const testCases: TestCase[] = useMemo(
    () => [...scenarios.map((s) => s.testCase), ...manualTestCases],
    [scenarios, manualTestCases],
  )

  const handleAddTestCase = () => {
    const newTC: TestCase = {
      id: `manual-${Date.now()}`,
      name: '',
      priority: 'Low',
      expectedResult: '',
      steps: [{ n: 1, action: '', expected: '' }],
    }
    setManualTestCases((prev) => [...prev, newTC])
    scrollToTestCases()
  }

  const handleDeleteTestCase = (id: string) => {
    if (scenarios.some((s) => s.testCase.id === id)) {
      dispatch(setScenarios(scenarios.filter((s) => s.testCase.id !== id)))
    } else {
      setManualTestCases((prev) => prev.filter((tc) => tc.id !== id))
      if (selectedTCIds.includes(id)) dispatch(toggleTestCaseSelected(id))
    }
  }

  const handleUpdateTestCase = (id: string, updates: Partial<TestCase>) => {
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

  const handleBulkDelete = () => {
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

  const handleStartGenerate = async () => {
    const story = form.getFieldValue('story') as string | undefined
    if (!story || !story.trim()) {
      message.warning('Please enter a user story before generating.')
      return
    }
    if (tokens < TOKEN_COSTS.generateBatch) {
      message.error('Not enough tokens to generate tests.')
      return
    }
    dispatch(setGeneratorStep(2))
    setIsClarifyVisible(true)
    setIsInputCollapsed(true)
    scrollToClarify()
  }

  const runGeneration = async () => {
    setIsClarifyVisible(false)
    setIsGenerating(true)
    dispatch(setGeneratorStep(3))

    try {
      const story = form.getFieldValue('story') as string

      if (generateMode === 'scenarios') {
        const { scenarioSummaries: summaries } = await generateScenarioSummaries(story)
        dispatch(setScenarioSummaries(summaries))
        dispatch(adjustTokens(-TOKEN_COSTS.generateBatch))
        dispatch(setGeneratorStep(4))
        scrollToOutput()
      } else {
        const { scenarios: nextScenarios } = await generateFromStory(story)
        dispatch(setScenarios(nextScenarios))
        dispatch(setGeneratedScript(null))
        dispatch(adjustTokens(-TOKEN_COSTS.generateBatch))
        dispatch(setGeneratorStep(5))
        scrollToTestCases()
      }
    } catch {
      message.error('Something went wrong while generating. Please try again.')
      dispatch(setGeneratorStep(1))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateTestCasesFromScenario = async () => {
    if (!selectedScenarioIds.length) return
    const selected = scenarioSummaries.filter((s) => selectedScenarioIds.includes(s.id))
    if (!selected.length) return

    setIsGenerating(true)
    try {
      const { scenarios: newScenarios } = await generateTestCasesForScenario(selected)
      dispatch(setScenarios(newScenarios))
      dispatch(setGeneratedScript(null))
      dispatch(setGeneratorStep(5))
      scrollToTestCases()
    } catch {
      message.error('Failed to generate test cases. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClarifySubmit = async () => { await runGeneration() }
  const handleClarifySkip = async () => { await runGeneration() }

  const clarifyRef = useRef<HTMLDivElement | null>(null)
  const outputRef = useRef<HTMLDivElement | null>(null)
  const testCasesRef = useRef<HTMLDivElement | null>(null)
  const scriptBlockRef = useRef<HTMLDivElement | null>(null)

  const scrollToClarify = () => {
    setTimeout(() => clarifyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }
  const scrollToOutput = () => {
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
  }
  const scrollToTestCases = () => {
    setTimeout(() => testCasesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
  }

  const handleGenerateScriptFromSelection = () => {
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
    setTimeout(() => {
      scriptBlockRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const stepBarItems: { label: string; step: GeneratorStep }[] =
    generateMode === 'scenarios'
      ? [
          { label: 'Story', step: 1 },
          { label: 'Clarify', step: 2 },
          { label: 'Generate', step: 3 },
          { label: 'Scenarios', step: 4 },
          { label: 'Review', step: 5 },
        ]
      : [
          { label: 'Story', step: 1 },
          { label: 'Clarify', step: 2 },
          { label: 'Generate', step: 3 },
          { label: 'Review', step: 5 },
        ]

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.breadcrumb}>
          Projects / {projectId.replace(/-/g, ' ')} / Generator
        </div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Generator
        </Title>
        <Text type="secondary">Turn user stories into test cases &amp; scripts</Text>
      </div>

      {/* ── Step bar ─────────────────────────────────────── */}
      <div className={styles.stepsBar}>
        {stepBarItems.map((item, idx) => (
          <>
            {idx > 0 && <div key={`line-${item.step}`} className={styles.stepLine} />}
            <span key={item.step} className={stepClass(item.step, generatorStep)}>
              {idx + 1}&nbsp;{item.label}
            </span>
          </>
        ))}
      </div>

      <div className={styles.layout}>
        {/* ── Left column ──────────────────────────────────── */}
        <div>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelHeaderLabel}>Input</span>
              {isInputCollapsed ? (
                <Button
                  type="text"
                  size="small"
                  onClick={() => {
                    setIsInputCollapsed(false)
                    setIsClarifyVisible(false)
                    dispatch(setGeneratorStep(1))
                  }}
                  style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}
                >
                  Edit
                </Button>
              ) : (
                <Button type="text" size="small">
                  Import from Jira
                </Button>
              )}
            </div>

            {/* Collapsed summary */}
            {isInputCollapsed ? (
              <div className={styles.storyCollapsed}>
                <div className={styles.storySnippet}>
                  {(form.getFieldValue('story') as string | undefined)?.slice(0, 100) ?? ''}
                  {((form.getFieldValue('story') as string | undefined)?.length ?? 0) > 100 && '…'}
                </div>
                <div className={styles.storyMeta}>
                  <span className={styles.storyMetaPill}>{form.getFieldValue('framework') as string}</span>
                  <span className={styles.storyMetaPill}>{form.getFieldValue('style') as string}</span>
                </div>
              </div>
            ) : (
              /* Expanded form */
              <div className={styles.panelBody}>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    story: 'As a user, I want to apply a discount coupon at checkout so that I can get a reduced price on my order.',
                    framework: FRAMEWORK_OPTIONS[0],
                    style: STYLE_OPTIONS[0],
                  }}
                >
                  <Form.Item label="User story / prompt" name="story" style={{ marginBottom: 16 }}>
                    <TextArea rows={5} placeholder="As a user, I want to…" />
                  </Form.Item>
                  <div className={styles.formGrid}>
                    <Form.Item label="Framework" name="framework">
                      <Select options={FRAMEWORK_OPTIONS.map((f) => ({ value: f, label: f }))} />
                    </Form.Item>
                    <Form.Item label="Style" name="style">
                      <Select options={STYLE_OPTIONS.map((s) => ({ value: s, label: s }))} />
                    </Form.Item>
                  </div>
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={handleStartGenerate}
                    disabled={isGenerating}
                  >
                    ⚡ Generate Tests
                  </Button>
                  <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                    Better stories yield better tests. Include happy paths, edge cases, and important constraints.
                  </Paragraph>
                </Form>
              </div>
            )}
          </div>

          {/* ── AI Clarification panel ── */}
          {isClarifyVisible && (
            <div className={styles.clarifyPanel} ref={clarifyRef}>
              <div className={styles.clarifyTitle}>AI Clarification</div>

              {/* Generate mode radio */}
              <div className={styles.clarifyModeWrapper}>
                <div className={styles.clarifyModeLabel}>
                  How would you like to generate?
                </div>
                <div className={styles.clarifyModeOptions}>
                  {[
                    { value: 'scenarios' as const, label: 'Scenarios first', sub: 'Review & refine scenarios, then generate test cases' },
                    { value: 'direct' as const, label: 'Test cases directly', sub: 'Skip scenarios and generate test cases right away' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`${styles.clarifyOption} ${generateMode === opt.value ? styles.clarifyOptionSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="generateMode"
                        value={opt.value}
                        checked={generateMode === opt.value}
                        onChange={() => dispatch(setGenerateMode(opt.value))}
                        style={{ marginTop: 2, accentColor: 'var(--accent, #7c3aed)', flexShrink: 0 }}
                      />
                      <div>
                        <div className={styles.clarifyOptLabel}>{opt.label}</div>
                        <div className={styles.clarifyOptSub}>{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.clarifyQuestion}>
                1. Should the coupon stack with sale prices?
              </div>
              <Input
                value={clarifyAnswers.stackCoupon}
                onChange={(e) => setClarifyAnswers((prev) => ({ ...prev, stackCoupon: e.target.value }))}
                placeholder="Yes, coupons apply after sale price"
                style={{ marginBottom: 8 }}
              />
              <div className={styles.clarifyQuestion}>
                2. What error should show for an expired coupon?
              </div>
              <Input
                value={clarifyAnswers.expiredMessage}
                onChange={(e) => setClarifyAnswers((prev) => ({ ...prev, expiredMessage: e.target.value }))}
                placeholder='"Coupon has expired, please try another"'
                style={{ marginBottom: 8 }}
              />
              <div className={styles.clarifyActions}>
                <Button type="primary" size="small" onClick={handleClarifySubmit}>
                  Submit &amp; Generate
                </Button>
                <Button size="small" onClick={handleClarifySkip}>
                  Skip
                </Button>
              </div>
            </div>
          )}

          <button
            type="button"
            className={styles.manualAdd}
            onClick={handleAddTestCase}
          >
            <span className={styles.manualAddIcon}>+</span>
            Add test case manually
            <span className={styles.manualAddSuffix}>
              No AI · No tokens
            </span>
          </button>
        </div>

        {/* ── Right panel ──────────────────────────────────── */}
        <div className={styles.panel}>
          {isGenerating && (
            <div className={styles.generatingState}>
              <div className={styles.generatingIcon}>⋯</div>
              <Text type="secondary">
                {generatorStep === 3
                  ? generateMode === 'scenarios'
                    ? 'Generating scenarios…'
                    : 'Generating test cases…'
                  : 'Generating test cases from scenario…'}
              </Text>
              <div className={styles.generatingTokenCost}>
                Using {TOKEN_COSTS.generateBatch} tokens
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isGenerating && !scenarios.length && !scenarioSummaries.length && (
            <div className={styles.outputEmpty}>
              <div className={styles.emptyIcon}>⚡</div>
              <div className={styles.emptyTitle}>No output yet</div>
              <div className={styles.emptySub}>
                Write a user story and click Generate Tests
              </div>
            </div>
          )}

          {/* ── Step 4: Scenario list (scenarios-first mode) ── */}
          {!isGenerating && generatorStep === 4 && generateMode === 'scenarios' && !!scenarioSummaries.length && (
            <div ref={outputRef}>
              {(clarifyAnswers.stackCoupon || clarifyAnswers.expiredMessage) && (
                <div className={styles.clarifyUsed} style={{ margin: '16px 16px 0' }}>
                  <div className={styles.clarifyUsedHeader}>
                    <span className={styles.clarifyUsedDot} />
                    Clarified
                  </div>
                  <div className={styles.clarifyChips}>
                    {clarifyAnswers.stackCoupon && (
                      <div className={styles.clarifyChip}>
                        <span className={styles.clarifyChipLabel}>Coupon stack</span>
                        <span className={styles.clarifyChipValue}>{clarifyAnswers.stackCoupon}</span>
                      </div>
                    )}
                    {clarifyAnswers.expiredMessage && (
                      <div className={styles.clarifyChip}>
                        <span className={styles.clarifyChipLabel}>Expired msg</span>
                        <span className={styles.clarifyChipValue}>{clarifyAnswers.expiredMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <ScenarioList
                scenarios={scenarioSummaries}
                selectedIds={selectedScenarioIds}
                onToggle={(id) => dispatch(toggleSelectedScenarioId(id))}
                onSelectAll={(ids) => dispatch(setSelectedScenarioIds(ids))}
                onAdd={(s) => dispatch(addScenarioSummary(s))}
                onUpdate={(s) => dispatch(updateScenarioSummary(s))}
                onDelete={(id) => dispatch(deleteScenarioSummary(id))}
                onGenerateTestCases={handleGenerateTestCasesFromScenario}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* ── Step 5 (or 4 in direct mode): Test case table ── */}
          {!isGenerating && generatorStep === 5 && !!testCases.length && (
            <div style={{ padding: 16 }} ref={testCasesRef}>
              {(clarifyAnswers.stackCoupon || clarifyAnswers.expiredMessage) && (
                <div className={styles.clarifyUsed}>
                  <div className={styles.clarifyUsedHeader}>
                    <span className={styles.clarifyUsedDot} />
                    Clarified
                  </div>
                  <div className={styles.clarifyChips}>
                    {clarifyAnswers.stackCoupon && (
                      <div className={styles.clarifyChip}>
                        <span className={styles.clarifyChipLabel}>Coupon stack</span>
                        <span className={styles.clarifyChipValue}>{clarifyAnswers.stackCoupon}</span>
                      </div>
                    )}
                    {clarifyAnswers.expiredMessage && (
                      <div className={styles.clarifyChip}>
                        <span className={styles.clarifyChipLabel}>Expired msg</span>
                        <span className={styles.clarifyChipValue}>{clarifyAnswers.expiredMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className={styles.tcHeader}>
                <div className={styles.tcHeaderLeft}>
                  <span className={styles.tcCountDot} />
                  <Text type="secondary">
                    {testCases.length} test cases · {tokens} tokens remaining
                  </Text>
                </div>
                {generateMode === 'scenarios' && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => dispatch(setGeneratorStep(4))}
                    style={{ padding: 0, fontSize: 12, fontWeight: 600 }}
                  >
                    ← Back to scenarios
                  </Button>
                )}
              </div>

              <TestCaseTable
                testCases={testCases}
                selectedIds={selectedTCIds}
                onToggleSelected={(id) => dispatch(toggleTestCaseSelected(id))}
                onDeleteTestCase={handleDeleteTestCase}
                onDeleteSelected={handleBulkDelete}
                onUpdateTestCase={handleUpdateTestCase}
                onAddTestCase={handleAddTestCase}
                locked={!!generatedScript}
                onUnlock={() => dispatch(setGeneratedScript(null))}
              />

              {generatedScript && (
                <div ref={scriptBlockRef}>
                  <ScriptBlock script={generatedScript} />
                </div>
              )}

              {selectedTCIds.length > 0 && !generatedScript && (
                <div className={styles.bottomBar}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedTCIds.length} test case{selectedTCIds.length > 1 ? 's' : ''} selected
                  </Text>
                  <Button type="primary" size="small" onClick={handleGenerateScriptFromSelection}>
                    Generate Script
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeneratorPage

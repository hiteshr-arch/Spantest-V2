import { useEffect, useMemo, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Form, Input, Select, Typography, message } from 'antd'
import { useSpantestStore } from '../store/useSpantestStore'
import type { GeneratorStep, TestCase, TestStep } from '../types/generator'
import { TOKEN_COSTS } from '../config/pricing'
import { generateFromStory } from '../services/generatorApi'
import styles from './GeneratorPage.module.scss'
import TestCaseTable from '../components/generator/TestCaseTable'
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

  const {
    tokens,
    generatorStep,
    scenarios,
    selectedTCIds,
    generatedScript,
    setGeneratorStep,
    setScenarios,
    adjustTokens,
    toggleTestCaseSelected,
    clearSelectedTestCases,
    setGeneratedScript,
  } = useSpantestStore()
  const params = useParams()
  const projectId = params.projectId || 'ecommerce-app'

  useEffect(() => {
    if (!generatorStep) {
      setGeneratorStep(1)
    }
  }, [generatorStep, setGeneratorStep])

  // Combine AI-generated and manually added test cases
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
      setScenarios(scenarios.filter((s) => s.testCase.id !== id))
    } else {
      setManualTestCases((prev) => prev.filter((tc) => tc.id !== id))
      if (selectedTCIds.includes(id)) toggleTestCaseSelected(id)
    }
  }

  const handleUpdateTestCase = (id: string, updates: Partial<TestCase>) => {
    if (scenarios.some((s) => s.testCase.id === id)) {
      setScenarios(
        scenarios.map((s) =>
          s.testCase.id === id ? { ...s, testCase: { ...s.testCase, ...updates } } : s,
        ),
      )
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
      // setScenarios also clears selectedTCIds in the store
      setScenarios(scenarios.filter((s) => !aiIds.has(s.testCase.id)))
    }
    if (manualIds.size > 0) {
      setManualTestCases((prev) => prev.filter((tc) => !manualIds.has(tc.id)))
    }
    clearSelectedTestCases()
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

    setGeneratorStep(2)
    setIsClarifyVisible(true)
    setIsInputCollapsed(true)
    scrollToClarify()
  }

  const runGeneration = async () => {
    setIsClarifyVisible(false)
    setIsGenerating(true)
    setGeneratorStep(3)

    try {
      const story = form.getFieldValue('story') as string
      const { scenarios: nextScenarios } = await generateFromStory(story)
      setScenarios(nextScenarios)
      setGeneratedScript(null)
      adjustTokens(-TOKEN_COSTS.generateBatch)
      setGeneratorStep(4)
      scrollToTestCases()
    } catch {
      message.error('Something went wrong while generating. Please try again.')
      setGeneratorStep(1)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClarifySubmit = async () => {
    await runGeneration()
  }

  const handleClarifySkip = async () => {
    await runGeneration()
  }

  const clarifyRef = useRef<HTMLDivElement | null>(null)
  const testCasesRef = useRef<HTMLDivElement | null>(null)
  const scriptBlockRef = useRef<HTMLDivElement | null>(null)

  const scrollToClarify = () => {
    setTimeout(() => {
      clarifyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const scrollToTestCases = () => {
    setTimeout(() => {
      testCasesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
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
      .map(
        (step) =>
          `  // Step ${step.n}: ${step.action}\n  // Expected: ${step.expected}`,
      )
      .join('\n\n')

    const script = `import { test, expect } from '@playwright/test';

test('generated flow', async ({ page }) => {
${body}
});`

    setGeneratedScript(script)
    message.success('Script generated from selected test cases.')
    setTimeout(() => {
      if (scriptBlockRef.current) {
        scriptBlockRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 300)
  }

  return (
    <div className={styles.root}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          Projects / {projectId.replace(/-/g, ' ')} / Generator
        </div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Generator
        </Title>
        <Text type="secondary">Turn user stories into test cases & scripts</Text>
      </div>

      <div className={styles.stepsBar}>
        <span className={stepClass(1, generatorStep)}>1&nbsp; Story</span>
        <div className={styles.stepLine} />
        <span className={stepClass(2, generatorStep)}>2&nbsp; Clarify</span>
        <div className={styles.stepLine} />
        <span className={stepClass(3, generatorStep)}>3&nbsp; Generate</span>
        <div className={styles.stepLine} />
        <span className={stepClass(4, generatorStep)}>4&nbsp; Review</span>
      </div>

      <div className={styles.layout}>
        <div>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Input</span>
              {isInputCollapsed ? (
                <Button
                  type="text"
                  size="small"
                  onClick={() => {
                    setIsInputCollapsed(false)
                    setIsClarifyVisible(false)
                    setGeneratorStep(1)
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

            {/* ── Collapsed summary ── */}
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
              /* ── Expanded form ── */
              <div className={styles.panelBody}>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    story:
                      'As a user, I want to apply a discount coupon at checkout so that I can get a reduced price on my order.',
                    framework: FRAMEWORK_OPTIONS[0],
                    style: STYLE_OPTIONS[0],
                  }}
                >
                  <Form.Item
                    label="User story / prompt"
                    name="story"
                    style={{ marginBottom: 16 }}
                  >
                    <TextArea rows={5} placeholder="As a user, I want to…" />
                  </Form.Item>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
                  <Paragraph
                    type="secondary"
                    style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }}
                  >
                    Better stories yield better tests. Include happy paths, edge cases, and
                    important constraints.
                  </Paragraph>
                </Form>
              </div>
            )}
          </div>

          {isClarifyVisible && (
            <div className={styles.clarifyPanel} ref={clarifyRef}>
              <div className={styles.clarifyTitle}>AI Clarification</div>
              <div className={styles.clarifyQuestion}>
                1. Should the coupon stack with sale prices?
              </div>
              <Input
                value={clarifyAnswers.stackCoupon}
                onChange={e => setClarifyAnswers((prev) => ({ ...prev, stackCoupon: e.target.value }))}
                placeholder="Yes, coupons apply after sale price"
                style={{ marginBottom: 8 }}
              />
              <div className={styles.clarifyQuestion}>
                2. What error should show for an expired coupon?
              </div>
              <Input
                value={clarifyAnswers.expiredMessage}
                onChange={e => setClarifyAnswers((prev) => ({ ...prev, expiredMessage: e.target.value }))}
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
            <span style={{ fontSize: 16, color: '#ccc' }}>+</span>
            Add test case manually
            <span
              style={{
                fontSize: 11,
                color: '#bbb',
                marginLeft: 'auto',
              }}
            >
              No AI · No tokens
            </span>
          </button>
        </div>

        <div className={styles.panel}>
          {isGenerating && (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ marginBottom: 12, fontSize: 24 }}>⋯</div>
              <Text type="secondary">Generating scenarios and test cases…</Text>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
                Using {TOKEN_COSTS.generateBatch} tokens
              </div>
            </div>
          )}

          {!isGenerating && !scenarios.length && (
            <div className={styles.outputEmpty}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.2 }}>⚡</div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                }}
              >
                No output yet
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                Write a user story and click Generate Tests
              </div>
            </div>
          )}

          {!isGenerating && !!testCases.length && (
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: 'var(--green)',
                    }}
                  />
                  <Text type="secondary">
                    {testCases.length} test cases · {tokens} tokens remaining
                  </Text>
                </div>
              </div>

              <TestCaseTable
                testCases={testCases}
                selectedIds={selectedTCIds}
                onToggleSelected={toggleTestCaseSelected}
                onDeleteTestCase={handleDeleteTestCase}
                onDeleteSelected={handleBulkDelete}
                onUpdateTestCase={handleUpdateTestCase}
                onAddTestCase={handleAddTestCase}
                locked={!!generatedScript}
                onUnlock={() => setGeneratedScript(null)}
              />

              {generatedScript && (
                <div ref={scriptBlockRef}>
                  <ScriptBlock script={generatedScript} />
                </div>
              )}

              {selectedTCIds.length > 0 && !generatedScript && (
                <div className={styles.bottomBar}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedTCIds.length} test case
                    {selectedTCIds.length > 1 ? 's' : ''} selected
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


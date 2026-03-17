export interface TestStep {
  n: number
  action: string
  expected: string
}

export interface TestCase {
  id: string
  name: string
  priority: 'Low' | 'Medium' | 'High'
  expectedResult: string
  steps: TestStep[]
  description?: string
  tags?: string
}

export interface ScenarioSummary {
  id: string
  name: string
  priority: 'Low' | 'Medium' | 'High'
  description: string
}

export interface Scenario extends ScenarioSummary {
  testCase: TestCase
}

// ─── Chat / Conversation types ───────────────────────────────────────────────

export type ConversationStage =
  | 'idle'
  | 'awaiting_test_type'
  | 'awaiting_generate_type'
  | 'generating'
  | 'results'

export type TestType = 'ui' | 'api'
export type GenerateType = 'scenarios' | 'testcases'
export type ArtifactKind = 'scenarios' | 'testcases' | null
export type MessageRole = 'user' | 'system'

export interface QuickReply {
  label: string
  value: string
}

export interface ChatAttachment {
  name: string
  mimeType: string
  size: number
  dataUrl: string
}

export interface ChatAction {
  label: string
  actionType: 'show_scenarios' | 'show_testcases'
}

export interface ChatMessage {
  id: string
  role: MessageRole
  text: string
  attachments?: ChatAttachment[]
  quickReplies?: QuickReply[]
  actions?: ChatAction[]
  timestamp: number
}

// ─── Repository types ─────────────────────────────────────────────────────────

export interface RepositoryFolder {
  id: string
  name: string
  projectId: string
  createdAt: number
}

export interface RepositoryItem {
  id: string
  name: string
  type: 'Scenario' | 'Test Case' | 'Script'
  framework: string
  status: 'Ready' | 'Draft'
  folderId: string | null
  projectId: string
  createdAt: number
  payload: TestCase | ScenarioSummary | string
}

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  Scenario,
  ScenarioSummary,
  ConversationStage,
  TestType,
  GenerateType,
  ArtifactKind,
  ChatMessage,
  RepositoryFolder,
  RepositoryItem,
} from '../types/generator'

interface ProjectSummary {
  id: string
  name: string
  meta: string
  tags: string[]
  status: 'active' | 'idle' | 'stale'
}

interface SpantestState {
  tokens: number
  activeProjectId: string
  projects: ProjectSummary[]
  scenarioSummaries: ScenarioSummary[]
  selectedScenarioIds: string[]
  scenarios: Scenario[]
  selectedTCIds: string[]
  generatedScript: string | null
  // ─── Chat / Conversation ───────────────────────────────────────────
  conversationStage: ConversationStage
  chatMessages: ChatMessage[]
  testType: TestType | null
  generateType: GenerateType | null
  artifactKind: ArtifactKind
  // ─── Repository ────────────────────────────────────────────────────
  repositoryFolders: RepositoryFolder[]
  repositoryItems: RepositoryItem[]
}

const INITIAL_PROJECTS: ProjectSummary[] = [
  {
    id: 'ecommerce-app',
    name: 'E-Commerce App',
    meta: 'Last active 2h ago · 54 test cases',
    tags: ['Playwright', 'Cypress'],
    status: 'active',
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    meta: 'Last active 1d ago · 38 test cases',
    tags: ['Jest'],
    status: 'idle',
  },
  {
    id: 'mobile-api',
    name: 'Mobile API',
    meta: 'Last active 3d ago · 50 test cases',
    tags: ['Selenium'],
    status: 'stale',
  },
]

const initialState: SpantestState = {
  tokens: 240,
  activeProjectId: 'ecommerce-app',
  projects: INITIAL_PROJECTS,
  scenarioSummaries: [],
  selectedScenarioIds: [],
  scenarios: [],
  selectedTCIds: [],
  generatedScript: null,
  conversationStage: 'idle',
  chatMessages: [],
  testType: null,
  generateType: null,
  artifactKind: null,
  repositoryFolders: [],
  repositoryItems: [],
}

const spantestSlice = createSlice({
  name: 'spantest',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<number>) {
      state.tokens = action.payload
    },
    adjustTokens(state, action: PayloadAction<number>) {
      state.tokens = Math.max(0, state.tokens + action.payload)
    },
    setActiveProject(state, action: PayloadAction<string>) {
      state.activeProjectId = action.payload
    },
    setProjects(state, action: PayloadAction<ProjectSummary[]>) {
      state.projects = action.payload
    },
    addProject(state, action: PayloadAction<ProjectSummary>) {
      state.projects = [action.payload, ...state.projects]
    },
    setScenarioSummaries(state, action: PayloadAction<ScenarioSummary[]>) {
      state.scenarioSummaries = action.payload
      state.selectedScenarioIds = []
    },
    addScenarioSummary(state, action: PayloadAction<ScenarioSummary>) {
      state.scenarioSummaries.push(action.payload)
    },
    updateScenarioSummary(state, action: PayloadAction<ScenarioSummary>) {
      const idx = state.scenarioSummaries.findIndex((s) => s.id === action.payload.id)
      if (idx !== -1) state.scenarioSummaries[idx] = action.payload
    },
    deleteScenarioSummary(state, action: PayloadAction<string>) {
      state.scenarioSummaries = state.scenarioSummaries.filter((s) => s.id !== action.payload)
      state.selectedScenarioIds = state.selectedScenarioIds.filter((id) => id !== action.payload)
    },
    toggleSelectedScenarioId(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.selectedScenarioIds.includes(id)) {
        state.selectedScenarioIds = state.selectedScenarioIds.filter((x) => x !== id)
      } else {
        state.selectedScenarioIds.push(id)
      }
    },
    setSelectedScenarioIds(state, action: PayloadAction<string[]>) {
      state.selectedScenarioIds = action.payload
    },
    setScenarios(state, action: PayloadAction<Scenario[]>) {
      state.scenarios = action.payload
      state.selectedTCIds = []
    },
    toggleTestCaseSelected(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.selectedTCIds.includes(id)) {
        state.selectedTCIds = state.selectedTCIds.filter((x) => x !== id)
      } else {
        state.selectedTCIds.push(id)
      }
    },
    clearSelectedTestCases(state) {
      state.selectedTCIds = []
    },
    setGeneratedScript(state, action: PayloadAction<string | null>) {
      state.generatedScript = action.payload
    },
    // ─── Chat / Conversation ─────────────────────────────────────────
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push(action.payload)
    },
    setConversationStage(state, action: PayloadAction<ConversationStage>) {
      state.conversationStage = action.payload
    },
    setTestType(state, action: PayloadAction<TestType>) {
      state.testType = action.payload
    },
    setGenerateType(state, action: PayloadAction<GenerateType>) {
      state.generateType = action.payload
    },
    setArtifactKind(state, action: PayloadAction<ArtifactKind>) {
      state.artifactKind = action.payload
    },
    resetConversation(state) {
      state.chatMessages = []
      state.conversationStage = 'idle'
      state.testType = null
      state.generateType = null
      state.artifactKind = null
      state.scenarioSummaries = []
      state.selectedScenarioIds = []
      state.scenarios = []
      state.selectedTCIds = []
      state.generatedScript = null
    },
    // ─── Repository ──────────────────────────────────────────────────
    addRepositoryFolder(state, action: PayloadAction<RepositoryFolder>) {
      state.repositoryFolders.push(action.payload)
    },
    deleteRepositoryFolder(state, action: PayloadAction<string>) {
      state.repositoryFolders = state.repositoryFolders.filter((f) => f.id !== action.payload)
      state.repositoryItems = state.repositoryItems.map((item) =>
        item.folderId === action.payload ? { ...item, folderId: null } : item
      )
    },
    renameRepositoryFolder(state, action: PayloadAction<{ id: string; name: string }>) {
      const folder = state.repositoryFolders.find((f) => f.id === action.payload.id)
      if (folder) folder.name = action.payload.name
    },
    addRepositoryItems(state, action: PayloadAction<RepositoryItem[]>) {
      state.repositoryItems.push(...action.payload)
    },
    deleteRepositoryItem(state, action: PayloadAction<string>) {
      state.repositoryItems = state.repositoryItems.filter((item) => item.id !== action.payload)
    },
    moveRepositoryItem(state, action: PayloadAction<{ id: string; folderId: string | null }>) {
      const item = state.repositoryItems.find((i) => i.id === action.payload.id)
      if (item) item.folderId = action.payload.folderId
    },
  },
})

export const {
  setTokens,
  adjustTokens,
  setActiveProject,
  setProjects,
  addProject,
  setScenarioSummaries,
  addScenarioSummary,
  updateScenarioSummary,
  deleteScenarioSummary,
  toggleSelectedScenarioId,
  setSelectedScenarioIds,
  setScenarios,
  toggleTestCaseSelected,
  clearSelectedTestCases,
  setGeneratedScript,
  addChatMessage,
  setConversationStage,
  setTestType,
  setGenerateType,
  setArtifactKind,
  resetConversation,
  addRepositoryFolder,
  deleteRepositoryFolder,
  renameRepositoryFolder,
  addRepositoryItems,
  deleteRepositoryItem,
  moveRepositoryItem,
} = spantestSlice.actions

export default spantestSlice.reducer

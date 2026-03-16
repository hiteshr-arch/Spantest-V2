import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { GeneratorStep, GenerateMode, Scenario, ScenarioSummary } from '../types/generator'

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
  generateMode: GenerateMode
  generatorStep: GeneratorStep
  scenarioSummaries: ScenarioSummary[]
  selectedScenarioIds: string[]
  scenarios: Scenario[]
  selectedTCIds: string[]
  generatedScript: string | null
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
  generateMode: 'scenarios',
  generatorStep: 1,
  scenarioSummaries: [],
  selectedScenarioIds: [],
  scenarios: [],
  selectedTCIds: [],
  generatedScript: null,
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
    setGenerateMode(state, action: PayloadAction<GenerateMode>) {
      state.generateMode = action.payload
    },
    setGeneratorStep(state, action: PayloadAction<GeneratorStep>) {
      state.generatorStep = action.payload
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
  },
})

export const {
  setTokens,
  adjustTokens,
  setActiveProject,
  setProjects,
  addProject,
  setGenerateMode,
  setGeneratorStep,
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
} = spantestSlice.actions

export default spantestSlice.reducer

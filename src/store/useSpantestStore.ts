import { create } from 'zustand'
import type { GeneratorStep, Scenario } from '../types/generator'

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
  generatorStep: GeneratorStep
  scenarios: Scenario[]
  selectedTCIds: string[]
  generatedScript: string | null

  setTokens: (value: number) => void
  adjustTokens: (delta: number) => void
  setActiveProject: (projectId: string) => void
  setProjects: (projects: ProjectSummary[]) => void
  addProject: (project: ProjectSummary) => void
  setGeneratorStep: (step: GeneratorStep) => void
  setScenarios: (scenarios: Scenario[]) => void
  toggleTestCaseSelected: (testCaseId: string) => void
  clearSelectedTestCases: () => void
  setGeneratedScript: (script: string | null) => void
}

const INITIAL_PROJECTS = [
  {
    id: 'ecommerce-app',
    name: 'E-Commerce App',
    meta: 'Last active 2h ago · 54 test cases',
    tags: ['Playwright', 'Cypress'],
    status: 'active' as const,
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    meta: 'Last active 1d ago · 38 test cases',
    tags: ['Jest'],
    status: 'idle' as const,
  },
  {
    id: 'mobile-api',
    name: 'Mobile API',
    meta: 'Last active 3d ago · 50 test cases',
    tags: ['Selenium'],
    status: 'stale' as const,
  },
]

export const useSpantestStore = create<SpantestState>((set) => ({
  tokens: 240,
  activeProjectId: 'ecommerce-app',
  projects: INITIAL_PROJECTS,
  generatorStep: 1,
  scenarios: [],
  selectedTCIds: [],
  generatedScript: null,

  setTokens: (value) => set({ tokens: value }),
  adjustTokens: (delta) =>
    set((state) => ({
      tokens: Math.max(0, state.tokens + delta),
    })),
  setActiveProject: (projectId) => set({ activeProjectId: projectId }),
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),
  setGeneratorStep: (step) => set({ generatorStep: step }),
  setScenarios: (scenarios) =>
    set({
      scenarios,
      selectedTCIds: [],
    }),
  toggleTestCaseSelected: (testCaseId) =>
    set((state) => {
      const exists = state.selectedTCIds.includes(testCaseId)
      return {
        selectedTCIds: exists
          ? state.selectedTCIds.filter((id) => id !== testCaseId)
          : [...state.selectedTCIds, testCaseId],
      }
    }),
  clearSelectedTestCases: () => set({ selectedTCIds: [] }),
  setGeneratedScript: (script) => set({ generatedScript: script }),
}))


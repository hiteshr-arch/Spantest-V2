export type GeneratorStep = 1 | 2 | 3 | 4 | 5
export type GenerateMode = 'scenarios' | 'direct'

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

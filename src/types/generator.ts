export type GeneratorStep = 1 | 2 | 3 | 4

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

export interface Scenario {
  id: string
  name: string
  priority: 'Low' | 'Medium' | 'High'
  description: string
  testCase: TestCase
}


import { Route, Routes, Navigate } from 'react-router-dom'
import ShellLayout from './layouts/ShellLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GeneratorPage from './pages/GeneratorPage'
import LibraryPage from './pages/LibraryPage'
import JiraPage from './pages/JiraPage'
import ConfigPage from './pages/ConfigPage'
import TokensPage from './pages/TokensPage'
import ToolsPage from './pages/ToolsPage'

function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ShellLayout />}> 
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/project/:projectId/generator"
            element={<GeneratorPage />}
          />
          <Route
            path="/project/:projectId/library"
            element={<LibraryPage />}
          />
          <Route path="/project/:projectId/jira" element={<JiraPage />} />
          <Route path="/project/:projectId/config" element={<ConfigPage />} />
          <Route path="/project/:projectId/tools" element={<ToolsPage />} />
          <Route path="/tokens" element={<TokensPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

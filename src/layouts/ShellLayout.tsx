import { Layout } from 'antd'
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSpantestStore } from '../store/useSpantestStore'
import styles from './ShellLayout.module.scss'
import TokenBadge from '../components/ui/TokenBadge'

const { Header, Sider, Content } = Layout

const DEFAULT_PROJECT_ID = 'ecommerce-app'

function ShellLayout() {
  const projects = useSpantestStore((s) => s.projects)
  const params = useParams()

  const activeProjectId = params.projectId ?? DEFAULT_PROJECT_ID
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? {
    id: activeProjectId,
    name: activeProjectId.replace(/-/g, ' '),
  }

  const projectOptions =
    projects.find((p) => p.id === activeProjectId)
      ? projects
      : [{ id: activeProjectId, name: activeProject.name, meta: '', tags: [], status: 'active' as const }, ...projects]

  const navigate = useNavigate()
  const location = useLocation()

  const goToProject = (path: string) => {
    navigate(`/project/${activeProjectId}/${path}`)
  }

  const isProjectRoute = location.pathname.startsWith('/project/')

  return (
    <Layout className={styles.shell}>
      <Header className={styles.topbar}>
        <button
          type="button"
          className={styles.topbarLogo}
          onClick={() => navigate('/')}
        >
          Spantest
        </button>

        {isProjectRoute && (
          <div
            style={{
              marginLeft: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flex: '0 0 auto',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Project
            </span>
            <select
              aria-label={`Active project: ${activeProject.name}`}
              value={activeProjectId}
              onChange={(e) => {
                const nextId = e.target.value
                navigate(`/project/${nextId}/generator`)
              }}
              style={{
                height: 32,
                borderRadius: 8,
                border: '1px solid var(--border-mid)',
                padding: '0 10px',
                fontSize: 12,
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.topbarRight}>
          <TokenBadge tokens={240} onClick={() => navigate('/tokens')} />
          <button
            type="button"
            className={styles.avatar}
            onClick={() => goToProject('config')}
          >
            JD
          </button>
        </div>
      </Header>
      <Layout className={styles.body}>
        {isProjectRoute && (
          <Sider width={220} className={styles.sidebar}>
            <div className={styles.sidebarSectionLabel}>Workspace</div>
            <NavLink
              to={`/project/${activeProjectId}/generator`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              ⚡ Generator
            </NavLink>
            <NavLink
              to={`/project/${activeProjectId}/library`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              □ Test Library
            </NavLink>
            <NavLink
              to={`/project/${activeProjectId}/jira`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              ○ Jira Import
            </NavLink>
            <NavLink
              to={`/project/${activeProjectId}/tools`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              🛠 Tools
            </NavLink>
            <div className={styles.navDivider} />
            <div className={styles.sidebarSectionLabel}>Project</div>
            <NavLink
              to={`/project/${activeProjectId}/config`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              □ Config
            </NavLink>
          </Sider>
        )}
        <Content className={styles.main}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default ShellLayout


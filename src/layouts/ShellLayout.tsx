import { Button, Divider, Drawer, Layout, Select } from 'antd'
import { CloseOutlined, LogoutOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import styles from './ShellLayout.module.scss'
import TokenBadge from '../components/ui/TokenBadge'

const PROFILE = {
  name: 'James Doe',
  email: 'james.doe@company.com',
  role: 'QA Engineer',
  plan: 'Free',
  initials: 'JD',
  joined: 'January 2025',
  timezone: 'UTC+0 · London',
}

const { Header, Sider, Content } = Layout

const DEFAULT_PROJECT_ID = 'ecommerce-app'

function ShellLayout() {
  const [profileOpen, setProfileOpen] = useState(false)
  const projects = useAppSelector((s) => s.spantest.projects)
  const tokens = useAppSelector((s) => s.spantest.tokens)
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
          <div className={styles.projectSelectorWrapper}>
            <span className={styles.projectLabel}>Project</span>
            <Select
              size="small"
              value={activeProjectId}
              onChange={(nextId) => navigate(`/project/${nextId}/generator`)}
              options={projectOptions.map((p) => ({ value: p.id, label: p.name }))}
              style={{ width: 160 }}
              aria-label={`Active project: ${activeProject.name}`}
            />
          </div>
        )}

        <div className={styles.topbarRight}>
          <TokenBadge tokens={tokens} onClick={() => navigate('/tokens')} />
          <button
            type="button"
            className={styles.avatar}
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile"
          >
            {PROFILE.initials}
          </button>
        </div>
      </Header>

      {/* ── Profile Drawer ─────────────────────────────────────────── */}
      <Drawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        placement="right"
        width={320}
        closable={false}
        styles={{
          body: { padding: 0 },
          header: { display: 'none' },
          mask: { backdropFilter: 'blur(2px)' },
        }}
      >
        {/* Header band */}
        <div className={styles.drawerHeader}>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setProfileOpen(false)}
            className={styles.drawerClose}
            aria-label="Close"
          />
          <div className={styles.drawerAvatar}>{PROFILE.initials}</div>
          <div className={styles.drawerName}>{PROFILE.name}</div>
          <div className={styles.drawerEmail}>{PROFILE.email}</div>
          <div className={styles.drawerRole}>{PROFILE.role}</div>
        </div>

        {/* Body */}
        <div className={styles.drawerBody}>

          {/* Stat pills */}
          <div className={styles.drawerStats}>
            <div className={styles.drawerStatPill}>
              <div className={styles.pillLabel}>Plan</div>
              <div className={styles.pillValue}>{PROFILE.plan}</div>
              <div className={styles.pillSub}>Pay-as-you-go</div>
            </div>
            <div className={styles.drawerStatPill}>
              <div className={styles.pillLabel}>Tokens</div>
              <div className={`${styles.pillValue} ${styles.pillValueAccent}`}>{tokens.toLocaleString()}</div>
              <div className={styles.pillSub}>remaining</div>
            </div>
          </div>

          {/* Info rows */}
          {[
            { label: 'Member since', value: PROFILE.joined },
            { label: 'Timezone', value: PROFILE.timezone },
            { label: 'Projects', value: `${projects.length} active` },
          ].map((row) => (
            <div key={row.label} className={styles.drawerInfoRow}>
              <span className={styles.infoLabel}>{row.label}</span>
              <span className={styles.infoValue}>{row.value}</span>
            </div>
          ))}

          {/* Links */}
          <div className={styles.drawerNavLinks}>
            {[
              { label: '⚙ Account settings', onClick: () => { setProfileOpen(false); navigate('/config') } },
              { label: '⚡ Token balance', onClick: () => { setProfileOpen(false); navigate('/tokens') } },
            ].map((item) => (
              <Button
                key={item.label}
                type="text"
                block
                onClick={item.onClick}
                className={styles.drawerNavBtn}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Divider + Logout */}
          <Divider className={styles.drawerDivider} />
          <Button
            danger
            block
            onClick={() => {
              setProfileOpen(false)
              navigate('/login')
            }}
            icon={<LogoutOutlined />}
          >
            Log out
          </Button>

        </div>
      </Drawer>

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

import { Drawer, Layout } from 'antd'
import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSpantestStore } from '../store/useSpantestStore'
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
  const projects = useSpantestStore((s) => s.projects)
  const tokens = useSpantestStore((s) => s.tokens)
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
        <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)', padding: '28px 24px 20px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => setProfileOpen(false)}
            aria-label="Close"
            style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
          >
            ✕
          </button>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            {PROFILE.initials}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>{PROFILE.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>{PROFILE.email}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{PROFILE.role}</div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Stat pills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
            <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Plan</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{PROFILE.plan}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pay-as-you-go</div>
            </div>
            <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Tokens</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>{tokens.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>remaining</div>
            </div>
          </div>

          {/* Info rows */}
          {[
            { label: 'Member since', value: PROFILE.joined },
            { label: 'Timezone', value: PROFILE.timezone },
            { label: 'Projects', value: `${projects.length} active` },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{row.value}</span>
            </div>
          ))}

          {/* Links */}
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: '⚙ Account settings', onClick: () => { setProfileOpen(false); navigate('/config') } },
              { label: '⚡ Token balance', onClick: () => { setProfileOpen(false); navigate('/tokens') } },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 10px', border: 'none', borderRadius: 8, background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', transition: 'background 0.12s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-subtle)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Divider + Logout */}
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
          <button
            type="button"
            onClick={() => {
              setProfileOpen(false)
              navigate('/login')
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 10px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, background: 'rgba(239,68,68,0.04)', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.12s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.04)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2M9.5 9.5L12 7l-2.5-2.5M12 7H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Log out
          </button>

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


import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Input, Modal, Select, Table, Tag, Typography, message } from 'antd'
import { FolderOutlined, FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
  addRepositoryFolder,
  deleteRepositoryFolder,
  renameRepositoryFolder,
  deleteRepositoryItem,
  moveRepositoryItem,
} from '../store/spantestSlice'
import type { RepositoryItem } from '../types/generator'
import ItemViewDrawer from '../components/repository/ItemViewDrawer'
import styles from './LibraryPage.module.scss'

const { Title, Text } = Typography

const TYPE_FILTER_OPTIONS = ['All', 'Scenarios', 'Test Cases', 'Scripts'] as const
type TypeFilter = typeof TYPE_FILTER_OPTIONS[number]

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function RepositoryPage() {
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId ?? 'ecommerce-app'
  const dispatch = useAppDispatch()

  const repositoryFolders = useAppSelector((s) => s.spantest.repositoryFolders)
  const repositoryItems = useAppSelector((s) => s.spantest.repositoryItems)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All')
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null) // null = all items
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [moveModalItem, setMoveModalItem] = useState<RepositoryItem | null>(null)
  const [viewingItem, setViewingItem] = useState<RepositoryItem | null>(null)
  const [moveFolderId, setMoveFolderId] = useState<string | null>(null)

  const projectFolders = repositoryFolders.filter((f) => f.projectId === projectId)

  const filteredItems = useMemo(() => {
    return repositoryItems
      .filter((item) => item.projectId === projectId)
      .filter((item) => selectedFolderId === null || item.folderId === selectedFolderId)
      .filter((item) => {
        if (typeFilter === 'All') return true
        if (typeFilter === 'Scenarios') return item.type === 'Scenario'
        if (typeFilter === 'Test Cases') return item.type === 'Test Case'
        if (typeFilter === 'Scripts') return item.type === 'Script'
        return true
      })
      .filter((item) => frameworkFilter === 'all' || item.framework === frameworkFilter)
      .filter((item) => !search || item.name.toLowerCase().includes(search.toLowerCase()))
  }, [repositoryItems, projectId, selectedFolderId, typeFilter, frameworkFilter, search])

  function handleCreateFolder() {
    const name = newFolderName.trim()
    if (!name) return
    dispatch(addRepositoryFolder({
      id: `folder-${Date.now()}`,
      name,
      projectId,
      createdAt: Date.now(),
    }))
    setNewFolderName('')
    setIsAddingFolder(false)
  }

  function handleDeleteFolder(id: string) {
    dispatch(deleteRepositoryFolder(id))
    if (selectedFolderId === id) setSelectedFolderId(null)
  }

  function handleRenameFolder(id: string) {
    if (renameValue.trim()) {
      dispatch(renameRepositoryFolder({ id, name: renameValue.trim() }))
    }
    setRenamingFolderId(null)
    setRenameValue('')
  }

  function handleMoveItem() {
    if (!moveModalItem) return
    dispatch(moveRepositoryItem({ id: moveModalItem.id, folderId: moveFolderId }))
    message.success('Item moved')
    setMoveModalItem(null)
    setMoveFolderId(null)
  }

  return (
    <div>
      <div className={styles.breadcrumb}>
        Projects / {projectId.replace(/-/g, ' ')} / Repository
      </div>
      <div className={styles.pageHeader}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>Repository</Title>
          <Text type="secondary">Saved scenarios, test cases &amp; scripts</Text>
        </div>
        <div className={styles.pageActions}>
          <Input
            placeholder="Search…"
            style={{ width: 200, height: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="primary" onClick={() => navigate(`/project/${projectId}/generator`)}>
            + New
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        {/* ── Folder sidebar ─────────────────────── */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Folders</div>

          <button
            className={`${styles.folderItem} ${selectedFolderId === null ? styles.folderItemActive : ''}`}
            onClick={() => setSelectedFolderId(null)}
          >
            <FolderOpenOutlined className={styles.folderIcon} />
            <span>All items</span>
            <span className={styles.folderCount}>{repositoryItems.filter((i) => i.projectId === projectId).length}</span>
          </button>

          {projectFolders.map((folder) => {
            const count = repositoryItems.filter((i) => i.folderId === folder.id).length
            return (
              <div key={folder.id} className={styles.folderRow}>
                {renamingFolderId === folder.id ? (
                  <input
                    className={styles.renameInput}
                    value={renameValue}
                    autoFocus
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameFolder(folder.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameFolder(folder.id)
                      if (e.key === 'Escape') { setRenamingFolderId(null); setRenameValue('') }
                    }}
                  />
                ) : (
                  <button
                    className={`${styles.folderItem} ${selectedFolderId === folder.id ? styles.folderItemActive : ''}`}
                    onClick={() => setSelectedFolderId(folder.id)}
                    onDoubleClick={() => { setRenamingFolderId(folder.id); setRenameValue(folder.name) }}
                  >
                    <FolderOutlined className={styles.folderIcon} />
                    <span className={styles.folderName}>{folder.name}</span>
                    <span className={styles.folderCount}>{count}</span>
                  </button>
                )}
                <button
                  className={styles.folderDelete}
                  onClick={() => handleDeleteFolder(folder.id)}
                  title="Delete folder"
                >
                  <DeleteOutlined />
                </button>
              </div>
            )
          })}

          {isAddingFolder ? (
            <div className={styles.newFolderWrap}>
              <input
                className={styles.renameInput}
                value={newFolderName}
                autoFocus
                placeholder="Folder name"
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={handleCreateFolder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder()
                  if (e.key === 'Escape') { setIsAddingFolder(false); setNewFolderName('') }
                }}
              />
            </div>
          ) : (
            <button className={styles.addFolderBtn} onClick={() => setIsAddingFolder(true)}>
              + New folder
            </button>
          )}
        </div>

        {/* ── Content ────────────────────────────── */}
        <div className={styles.content}>
          <div className={styles.filterBar}>
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt}
                size="small"
                type={typeFilter === opt ? 'primary' : 'default'}
                onClick={() => setTypeFilter(opt)}
              >
                {opt}
              </Button>
            ))}
            <div className={styles.frameworkSelect}>
              <Select
                value={frameworkFilter}
                onChange={setFrameworkFilter}
                style={{ width: 160, height: 32 }}
                options={[
                  { value: 'all', label: 'All frameworks' },
                  { value: 'Playwright', label: 'Playwright' },
                  { value: 'Cypress', label: 'Cypress' },
                  { value: 'Jest', label: 'Jest' },
                  { value: 'Selenium', label: 'Selenium' },
                ]}
              />
            </div>
          </div>

          <Card>
            {filteredItems.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>◻</div>
                <div className={styles.emptyTitle}>
                  {repositoryItems.filter((i) => i.projectId === projectId).length === 0
                    ? 'No items saved yet'
                    : 'No items match your filters'}
                </div>
                <div className={styles.emptySub}>
                  {repositoryItems.filter((i) => i.projectId === projectId).length === 0
                    ? 'Generate test cases and save them to the repository from the Generator'
                    : 'Try adjusting your search or filters'}
                </div>
                {repositoryItems.filter((i) => i.projectId === projectId).length === 0 && (
                  <Button
                    type="primary"
                    style={{ marginTop: 12 }}
                    onClick={() => navigate(`/project/${projectId}/generator`)}
                  >
                    Go to Generator
                  </Button>
                )}
              </div>
            ) : (
              <Table<RepositoryItem>
                rowKey="id"
                size="small"
                dataSource={filteredItems}
                pagination={false}
                columns={[
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
                  },
                  {
                    title: 'Type',
                    dataIndex: 'type',
                    render: (value: RepositoryItem['type']) => (
                      <Tag bordered={false} style={{ borderRadius: 999 }}>{value}</Tag>
                    ),
                  },
                  {
                    title: 'Framework',
                    dataIndex: 'framework',
                    render: (value: string) => (
                      <Text type="secondary" style={{ fontSize: 12 }}>{value}</Text>
                    ),
                  },
                  {
                    title: 'Folder',
                    dataIndex: 'folderId',
                    render: (folderId: string | null) => {
                      const folder = repositoryFolders.find((f) => f.id === folderId)
                      return folder
                        ? <Tag color="blue" style={{ borderRadius: 999 }}>{folder.name}</Tag>
                        : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
                    },
                  },
                  {
                    title: 'Saved',
                    dataIndex: 'createdAt',
                    render: (ts: number) => (
                      <Text type="secondary" style={{ fontSize: 12 }}>{relativeTime(ts)}</Text>
                    ),
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    render: (value: RepositoryItem['status']) => (
                      <Tag color={value === 'Ready' ? 'success' : 'default'} style={{ borderRadius: 999 }}>
                        {value}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_: unknown, record: RepositoryItem) => (
                      <div className={styles.tableActions}>
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          onClick={(e) => { e.stopPropagation(); setViewingItem(record) }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setMoveModalItem(record); setMoveFolderId(record.folderId) }}
                        >
                          Move
                        </Button>
                        <Button
                          size="small"
                          danger
                          onClick={(e) => { e.stopPropagation(); dispatch(deleteRepositoryItem(record.id)) }}
                        >
                          Delete
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </Card>
        </div>
      </div>

      <ItemViewDrawer
        item={viewingItem}
        folders={repositoryFolders}
        onClose={() => setViewingItem(null)}
      />

      {/* Move to folder modal */}
      <Modal
        open={!!moveModalItem}
        title="Move to folder"
        onCancel={() => { setMoveModalItem(null); setMoveFolderId(null) }}
        onOk={handleMoveItem}
        okText="Move"
      >
        <Select
          style={{ width: '100%' }}
          value={moveFolderId ?? '__root__'}
          onChange={(v) => setMoveFolderId(v === '__root__' ? null : v)}
          options={[
            { value: '__root__', label: 'Unfiled (root)' },
            ...projectFolders.map((f) => ({ value: f.id, label: f.name })),
          ]}
        />
      </Modal>
    </div>
  )
}

export default RepositoryPage

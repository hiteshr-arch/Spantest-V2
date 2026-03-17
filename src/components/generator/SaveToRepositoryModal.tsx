import { useState } from 'react'
import { Modal, Input, Radio, Tag, message as antMessage } from 'antd'
import { FolderOutlined, PlusOutlined } from '@ant-design/icons'
import type { RepositoryFolder, RepositoryItem, TestCase } from '../../types/generator'
import styles from './SaveToRepositoryModal.module.scss'

interface SaveToRepositoryModalProps {
  open: boolean
  onClose: () => void
  onSave: (folderId: string | null, items: Omit<RepositoryItem, 'id' | 'createdAt' | 'folderId'>[]) => void
  folders: RepositoryFolder[]
  testCases: TestCase[]
  generatedScript: string | null
  projectId: string
}

export default function SaveToRepositoryModal({
  open,
  onClose,
  onSave,
  folders,
  testCases,
  generatedScript,
  projectId,
}: SaveToRepositoryModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | '__new__' | '__root__'>('__root__')
  const [newFolderName, setNewFolderName] = useState('')

  const totalItems = testCases.length + (generatedScript ? 1 : 0)

  function handleSave() {
    if (selectedFolderId === '__new__' && !newFolderName.trim()) {
      antMessage.warning('Enter a folder name')
      return
    }

    const items: Omit<RepositoryItem, 'id' | 'createdAt' | 'folderId'>[] = [
      ...testCases.map((tc) => ({
        name: tc.name || 'Untitled test case',
        type: 'Test Case' as const,
        framework: 'Playwright',
        status: 'Ready' as const,
        projectId,
        payload: tc,
      })),
      ...(generatedScript
        ? [{
            name: 'Generated Script',
            type: 'Script' as const,
            framework: 'Playwright',
            status: 'Ready' as const,
            projectId,
            payload: generatedScript,
          }]
        : []),
    ]

    const resolvedFolderId =
      selectedFolderId === '__root__' || selectedFolderId === '__new__'
        ? null
        : selectedFolderId

    onSave(
      selectedFolderId === '__new__' ? '__new__:' + newFolderName.trim() : resolvedFolderId,
      items,
    )
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      title="Save to Repository"
      okText={`Save ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
      width={420}
    >
      <div className={styles.summary}>
        <span>Saving</span>
        {testCases.length > 0 && (
          <Tag style={{ borderRadius: 999, marginLeft: 6 }}>
            {testCases.length} test case{testCases.length !== 1 ? 's' : ''}
          </Tag>
        )}
        {generatedScript && (
          <Tag color="purple" style={{ borderRadius: 999, marginLeft: 4 }}>
            1 script
          </Tag>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.label}>Choose folder</div>
        <Radio.Group
          value={selectedFolderId}
          onChange={(e) => setSelectedFolderId(e.target.value)}
          className={styles.folderList}
        >
          <Radio value="__root__">
            <span className={styles.folderRow}>
              <FolderOutlined /> Unfiled (root)
            </span>
          </Radio>
          {folders.map((f) => (
            <Radio key={f.id} value={f.id}>
              <span className={styles.folderRow}>
                <FolderOutlined /> {f.name}
              </span>
            </Radio>
          ))}
          <Radio value="__new__">
            <span className={styles.folderRow}>
              <PlusOutlined /> New folder
            </span>
          </Radio>
        </Radio.Group>
        {selectedFolderId === '__new__' && (
          <Input
            className={styles.newFolderInput}
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
          />
        )}
      </div>
    </Modal>
  )
}

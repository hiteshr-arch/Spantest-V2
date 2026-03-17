import { Drawer, Tag, Table, Typography } from 'antd'
import type { RepositoryFolder, RepositoryItem, TestCase, ScenarioSummary, TestStep } from '../../types/generator'
import ScriptBlock from '../generator/ScriptBlock'
import styles from './ItemViewDrawer.module.scss'

const { Text } = Typography

const PRIORITY_COLOR: Record<string, string> = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
}

interface ItemViewDrawerProps {
  item: RepositoryItem | null
  folders: RepositoryFolder[]
  onClose: () => void
}

export default function ItemViewDrawer({ item, folders, onClose }: ItemViewDrawerProps) {
  const folder = item?.folderId ? folders.find((f) => f.id === item.folderId) : null

  return (
    <Drawer
      open={!!item}
      onClose={onClose}
      width={560}
      title={
        item ? (
          <div className={styles.drawerTitle}>
            <span>{item.name || 'Untitled'}</span>
            <div className={styles.drawerTitleMeta}>
              <Tag bordered={false} style={{ borderRadius: 999 }}>{item.type}</Tag>
              {folder && (
                <Tag color="blue" style={{ borderRadius: 999 }}>📁 {folder.name}</Tag>
              )}
            </div>
          </div>
        ) : null
      }
      destroyOnClose
    >
      {item && (
        <>
          {item.type === 'Script' && (
            <ScriptBlock script={item.payload as string} />
          )}

          {item.type === 'Test Case' && (
            <TestCaseView testCase={item.payload as TestCase} />
          )}

          {item.type === 'Scenario' && (
            <ScenarioView scenario={item.payload as ScenarioSummary} />
          )}
        </>
      )}
    </Drawer>
  )
}

function TestCaseView({ testCase }: { testCase: TestCase }) {
  const columns = [
    {
      title: '#',
      dataIndex: 'n',
      width: 40,
      render: (n: number) => <Text type="secondary" style={{ fontSize: 12 }}>{n}</Text>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (v: string) => <span style={{ fontSize: 13 }}>{v}</span>,
    },
    {
      title: 'Expected',
      dataIndex: 'expected',
      render: (v: string) => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text>,
    },
  ]

  return (
    <div className={styles.tcView}>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Priority</span>
        <Tag color={PRIORITY_COLOR[testCase.priority] ?? 'default'} style={{ borderRadius: 999 }}>
          {testCase.priority}
        </Tag>
      </div>

      {testCase.description && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Description</span>
          <Text type="secondary" style={{ fontSize: 13 }}>{testCase.description}</Text>
        </div>
      )}

      {testCase.expectedResult && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Expected result</span>
          <Text type="secondary" style={{ fontSize: 13 }}>{testCase.expectedResult}</Text>
        </div>
      )}

      <div className={styles.stepsSection}>
        <div className={styles.stepsLabel}>Steps ({testCase.steps.length})</div>
        <Table<TestStep>
          rowKey="n"
          size="small"
          dataSource={testCase.steps}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  )
}

function ScenarioView({ scenario }: { scenario: ScenarioSummary }) {
  return (
    <div className={styles.tcView}>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Priority</span>
        <Tag color={PRIORITY_COLOR[scenario.priority] ?? 'default'} style={{ borderRadius: 999 }}>
          {scenario.priority}
        </Tag>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Description</span>
        <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>{scenario.description}</Text>
      </div>
    </div>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './App.tsx'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
            colorPrimary: '#7c3aed',
            colorBgBase: '#ffffff',
            colorBgContainer: '#ffffff',
            colorBgElevated: '#ffffff',
            colorBorder: 'rgba(124, 58, 237, 0.15)',
            colorBorderSecondary: 'rgba(124, 58, 237, 0.1)',
            colorText: '#0f0a1e',
            colorTextSecondary: '#4c4568',
            colorTextTertiary: '#8b87a0',
            colorTextQuaternary: '#c0bcd1',
            borderRadius: 10,
            borderRadiusLG: 14,
            colorSuccess: '#16a34a',
            colorWarning: '#ea580c',
            colorError: '#dc2626',
            colorInfo: '#2563eb',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.08), 0 2px 6px rgba(0,0,0,0.04)',
            boxShadowSecondary: '0 1px 4px rgba(124, 58, 237, 0.06), 0 1px 2px rgba(0,0,0,0.04)',
          },
          components: {
            Table: {
              headerBg: '#faf9ff',
              rowHoverBg: '#f5f3ff',
              borderColor: 'rgba(124, 58, 237, 0.1)',
            },
            Modal: {
              contentBg: '#ffffff',
              headerBg: '#ffffff',
            },
            Select: {
              optionActiveBg: '#f5f3ff',
              optionSelectedBg: 'rgba(124, 58, 237, 0.08)',
            },
            Input: {
              activeBorderColor: '#7c3aed',
              hoverBorderColor: 'rgba(124, 58, 237, 0.3)',
            },
            Button: {
              defaultBg: '#ffffff',
              defaultBorderColor: 'rgba(124, 58, 237, 0.2)',
              defaultColor: '#4c4568',
              defaultHoverBg: '#f5f3ff',
              defaultHoverBorderColor: 'rgba(124, 58, 237, 0.35)',
              defaultHoverColor: '#7c3aed',
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)

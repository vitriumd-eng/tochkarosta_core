/**
 * Module Selection Platform Page
 * Platform page for subscribers to select active module
 * Located in dashboard (port 7001)
 */
'use client'

import { useEffect, useState } from 'react'
import { getSubscriptionStatus, getTenantInfo, switchActiveModule } from '@/lib/modules'

interface Module {
  id: string
  name: string
  description: string
  version: string
  themes?: string[]
}

interface ExtendedTenantInfo {
  id: string
  domain?: string
  owner?: string
  active_module?: string
}

export default function SelectModulePage() {
  const [subscription, setSubscription] = useState<any>(null)
  const [tenantInfo, setTenantInfo] = useState<ExtendedTenantInfo | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [sub, tenant] = await Promise.all([
          getSubscriptionStatus(),
          getTenantInfo()
        ])
        setSubscription(sub)
        setTenantInfo(tenant)
        setActiveModule(tenant?.active_module || null)

        // Load available modules from API
        const modulesRes = await fetch('/api/modules/list', {
          credentials: 'include'
        })
        if (modulesRes.ok) {
          const modulesData = await modulesRes.json()
          setModules(modulesData)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSwitchModule = async (moduleId: string) => {
    if (switching) return
    
    setSwitching(true)
    try {
      const success = await switchActiveModule(moduleId)
      if (success) {
        setActiveModule(moduleId)
        // Reload tenant info
        const tenant = await getTenantInfo()
        setTenantInfo(tenant)
      } else {
        alert('Failed to switch module. Please try again.')
      }
    } catch (error) {
      console.error('Failed to switch module:', error)
      alert('Error switching module. Please try again.')
    } finally {
      setSwitching(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!subscription?.active) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Module Selection</h1>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <h2>Subscription Inactive</h2>
          <p>Please activate your subscription to select and use modules.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Select Active Module</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Choose which module you want to use. Only one module can be active at a time.
        </p>
        {tenantInfo && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <p><strong>Current Active Module:</strong> {activeModule || 'None'}</p>
            <p><strong>Plan:</strong> {subscription?.plan || 'N/A'}</p>
          </div>
        )}
      </div>

      {modules.length === 0 ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <p>No modules available. Please contact support to activate modules.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {modules.map((module) => (
            <div
              key={module.id}
              style={{
                padding: '1.5rem',
                border: activeModule === module.id ? '2px solid #0070f3' : '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: activeModule === module.id ? '#f0f8ff' : '#fff',
                cursor: switching ? 'wait' : 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => !switching && activeModule !== module.id && handleSwitchModule(module.id)}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{module.name}</h2>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#666',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  v{module.version}
                </p>
                {activeModule === module.id && (
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#0070f3',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    ACTIVE
                  </span>
                )}
              </div>
              
              <p style={{ 
                color: '#333',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {module.description}
              </p>

              {module.themes && module.themes.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                    Available themes:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {module.themes.map((theme) => (
                      <span
                        key={theme}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeModule !== module.id && !switching && (
                <button
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    width: '100%'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSwitchModule(module.id)
                  }}
                >
                  Activate Module
                </button>
              )}

              {switching && activeModule !== module.id && (
                <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
                  Switching...
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          <strong>Note:</strong> When switching modules, the previous module will be deactivated but its data will be preserved. 
          You can reactivate it later without losing any content.
        </p>
      </div>
    </div>
  )
}


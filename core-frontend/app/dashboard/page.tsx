/**
 * Tenant Dashboard (Port 7001)
 */
'use client'

import { useEffect, useState } from 'react'
import { getSubscriptionStatus, getTenantInfo } from '@/lib/modules'

interface SubscriptionStatus {
  active: boolean
  plan?: string
  limits?: Record<string, number>
  features?: Record<string, boolean>
  expires?: string
}

interface TenantInfo {
  id: string
  domain?: string
  owner?: string
}

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)

  useEffect(() => {
    async function loadData() {
      const [sub, tenant] = await Promise.all([
        getSubscriptionStatus(),
        getTenantInfo()
      ])
      setSubscription(sub)
      setTenantInfo(tenant)
    }
    loadData()
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      {subscription && (
        <div>
          <p>Subscription: {subscription.active ? 'Active' : 'Inactive'}</p>
          <p>Plan: {subscription.plan || 'N/A'}</p>
        </div>
      )}
      {tenantInfo && (
        <div>
          <p>Tenant ID: {tenantInfo.id}</p>
        </div>
      )}
    </div>
  )
}

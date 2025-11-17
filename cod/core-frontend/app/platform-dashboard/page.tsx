/**
 * Platform Dashboard - Main Page
 * Dashboard for managing platform landing page content
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ContentSection {
  key: string
  content: any
  updated_at?: string
  updated_by?: string
}

export default function PlatformDashboard() {
  const router = useRouter()
  const [sections, setSections] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication - token is now in HttpOnly cookie
    // We'll check on server side or via API route
    loadContent()
  }, [router])

  const loadContent = async () => {
    try {
      // Token is now in HttpOnly cookie, automatically sent by browser
      const response = await fetch('/api/platform/content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in request
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/platform-dashboard/login')
          return
        }
        throw new Error('Failed to load content')
      }

      const data = await response.json()
      const sectionsList = Object.entries(data).map(([key, value]: [string, any]) => ({
        key,
        ...value,
      }))
      setSections(sectionsList)
    } catch (err: any) {
      setError(err.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/platform/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout error:', err)
    }
    
    // Redirect to login
    router.push('/platform-dashboard/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
              <p className="text-sm text-gray-600">Manage landing page content</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Content Sections</h2>
          </div>

          {sections.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No content sections found.</p>
              <p className="text-sm mt-2">Content sections will appear here after creation.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sections.map((section) => (
                <div key={section.key} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.key}</h3>
                      {section.updated_at && (
                        <p className="text-sm text-gray-500">
                          Updated: {new Date(section.updated_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/platform-dashboard/sections/${section.key}`}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/platform-dashboard/sections/hero_banner"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-gray-900">Hero Banner</h4>
                <p className="text-sm text-gray-600 mt-1">Main banner section</p>
              </Link>
              <Link
                href="/platform-dashboard/sections/features"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-gray-900">Features</h4>
                <p className="text-sm text-gray-600 mt-1">Features section</p>
              </Link>
              <Link
                href="/platform-dashboard/sections/pricing"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-gray-900">Pricing</h4>
                <p className="text-sm text-gray-600 mt-1">Pricing section</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



/**
 * Platform Dashboard - Content Section Editor
 * Edit specific content section
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ContentSectionEditor() {
  const router = useRouter()
  const params = useParams()
  const key = params.key as string

  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check authentication - token is now in HttpOnly cookie
    // We'll check on server side or via API route
    loadContent()
  }, [key, router])

  const loadContent = async () => {
    try {
      // Token is now in HttpOnly cookie, automatically sent by browser
      const response = await fetch('/api/platform/content', {
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
      if (data[key]) {
        setContent(data[key].content || {})
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      // Token is now in HttpOnly cookie, automatically sent by browser
      const response = await fetch(`/api/platform/content/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/platform-dashboard/login')
          return
        }
        const data = await response.json()
        throw new Error(data.detail || 'Failed to save content')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
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
              <button
                onClick={() => router.push('/platform-dashboard')}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit: {key}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {success && (
                <span className="text-sm text-green-600">Saved successfully!</span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Simple JSON Editor */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (JSON)
              </label>
              <textarea
                className="w-full h-96 font-mono text-sm border border-gray-300 rounded-md p-4 focus:ring-indigo-500 focus:border-indigo-500"
                value={JSON.stringify(content, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setContent(parsed)
                  } catch {
                    // Invalid JSON, but allow editing
                  }
                }}
                onBlur={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setContent(parsed)
                    setError('')
                  } catch (err) {
                    setError('Invalid JSON format')
                  }
                }}
              />
            </div>

            {/* Preview of current structure */}
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Content Structure:</h3>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



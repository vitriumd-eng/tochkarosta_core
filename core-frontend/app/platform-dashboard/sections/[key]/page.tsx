/**
 * Platform Dashboard - Content Section Editor
 * Edit specific content section
 * Adapted to super-admin style
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import PlatformDashboardSidebar from '@/components/PlatformDashboardSidebar'

export default function ContentSectionEditor() {
  const router = useRouter()
  const params = useParams()
  const key = params.key as string

  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    loadContent()
  }, [key, router])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/platform/content', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
        const loadedContent = data[key].content || {}
        setContent(loadedContent)
        // Set image preview if image exists
        if (loadedContent.imageUrl) {
          setImagePreview(loadedContent.imageUrl)
        }
      } else {
        // Initialize empty content if section doesn't exist
        setContent({})
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      const response = await fetch(`/api/platform/content/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/platform/content/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to upload image')
      }

      const data = await response.json()
      const imageUrl = data.url

      // Update content with image URL
      setContent((prev: any) => ({
        ...prev,
        imageUrl,
      }))

      // Set preview
      setImagePreview(imageUrl)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    setContent((prev: any) => {
      const newContent = { ...prev }
      delete newContent.imageUrl
      return newContent
    })
    setImagePreview(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">Загрузка редактора...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <PlatformDashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/platform-dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Назад к дашборду</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Редактирование: {key}</h1>
            <p className="text-gray-600">
              Измените содержимое секции платформенной страницы
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold text-red-900">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-900">Изменения успешно сохранены!</p>
                </div>
              </div>
            </div>
          )}

          {/* Text Content Section for hero_banner */}
          {key === 'hero_banner' && (
            <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Текст заголовка</h2>
              
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Подзаголовок (бейдж)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={content.subtitle || 'Современная платформа'}
                    onChange={(e) => {
                      setContent((prev: any) => ({
                        ...prev,
                        subtitle: e.target.value
                      }))
                    }}
                    placeholder="Современная платформа"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Строки заголовка
                  </label>
                  <div className="space-y-3">
                    {(() => {
                      const currentLines = content.titleLines || ['Создайте свой', 'интернет-магазин', 'за считанные минуты']
                      const displayLines = currentLines.length > 0 ? currentLines : ['', '', '']
                      
                      return displayLines.map((line: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <label className="text-sm text-gray-600 font-medium w-20 flex-shrink-0">
                            Строка {index + 1}:
                          </label>
                          <input
                            type="text"
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={line}
                            onChange={(e) => {
                              const newLines = [...displayLines]
                              newLines[index] = e.target.value
                              setContent((prev: any) => ({
                                ...prev,
                                titleLines: newLines.filter(l => l.trim())
                              }))
                            }}
                            placeholder={`Строка заголовка ${index + 1}`}
                          />
                        </div>
                      ))
                    })()}
                    <button
                      type="button"
                      onClick={() => {
                        const currentLines = content.titleLines || []
                        setContent((prev: any) => ({
                          ...prev,
                          titleLines: [...currentLines, '']
                        }))
                      }}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition font-medium"
                    >
                      + Добавить строку
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Каждая строка будет отображаться отдельно на новой строке на странице.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="text-xl">⏳</span>
                      <span>Сохранение...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">💾</span>
                      <span>Сохранить текст</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Image Upload Section for hero_banner */}
          {key === 'hero_banner' && (
            <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Медиа баннера</h2>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-6">
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="w-full h-auto max-h-96 object-contain"
                      onError={() => setImagePreview(null)}
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-lg flex items-center gap-2"
                    >
                      <span>🗑️</span>
                      <span>Удалить</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    URL: <code className="bg-gray-100 px-2 py-1 rounded">{content.imageUrl}</code>
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl cursor-pointer hover:from-blue-600 hover:to-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading ? (
                    <>
                      <span className="text-xl mr-2">⏳</span>
                      <span>Загрузка...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl mr-2">📷</span>
                      <span>Загрузить изображение</span>
                    </>
                  )}
                </label>
                {imagePreview && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <span className="text-xl">⏳</span>
                        <span>Сохранение...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">💾</span>
                        <span>Сохранить изменения</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6 mb-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">JSON Редактор</h2>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="text-xl">⏳</span>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">💾</span>
                    <span>Сохранить</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Содержимое (JSON)
                </label>
                <textarea
                  className="w-full h-96 font-mono text-sm border-2 border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  value={JSON.stringify(content, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setContent(parsed)
                      // Update preview if imageUrl changed
                      if (parsed.imageUrl) {
                        setImagePreview(parsed.imageUrl)
                      } else {
                        setImagePreview(null)
                      }
                      setError(null)
                    } catch {
                      // Invalid JSON, but allow editing
                    }
                  }}
                  onBlur={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setContent(parsed)
                      // Update preview if imageUrl changed
                      if (parsed.imageUrl) {
                        setImagePreview(parsed.imageUrl)
                      } else {
                        setImagePreview(null)
                      }
                      setError(null)
                    } catch (err) {
                      setError('Неверный формат JSON')
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Предпросмотр структуры:</h3>
            <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



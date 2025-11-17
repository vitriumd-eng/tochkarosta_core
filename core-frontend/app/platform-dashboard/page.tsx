/**
 * Platform Dashboard - Main Page
 * Dashboard for managing platform landing page content
 * Adapted from super-admin dashboard design
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlatformDashboardSidebar from '@/components/PlatformDashboardSidebar'

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
  const [error, setError] = useState<string | null>(null)
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [heroVideo, setHeroVideo] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [previewMode, setPreviewMode] = useState<'image' | 'video' | null>(null)
  const [applying, setApplying] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadContent()
  }, [router])

  const loadContent = async () => {
    try {
      console.log('Platform Dashboard: Loading content from API...')
      const response = await fetch('/api/platform/content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/platform-dashboard/login')
          return
        }
        throw new Error('Failed to load content')
      }

      const data = await response.json()
      console.log('Platform Dashboard: Loaded content:', JSON.stringify(data, null, 2))
      
      const sectionsList = Object.entries(data).map(([key, value]: [string, any]) => ({
        key,
        ...value,
      }))
      setSections(sectionsList)
      
      // Load hero banner media if exists
      const heroBannerContent = data.hero_banner?.content
      console.log('Platform Dashboard: Hero banner content:', heroBannerContent)
      
      if (heroBannerContent) {
        if (heroBannerContent.videoUrl) {
          console.log('Platform Dashboard: Setting heroVideo from loaded data:', heroBannerContent.videoUrl)
          setHeroVideo(heroBannerContent.videoUrl)
          setHeroImage(null)
        } else if (heroBannerContent.imageUrl) {
          console.log('Platform Dashboard: Setting heroImage from loaded data:', heroBannerContent.imageUrl)
          setHeroImage(heroBannerContent.imageUrl)
          setHeroVideo(null)
        } else {
          console.log('Platform Dashboard: No videoUrl or imageUrl in hero_banner content')
        }
      } else {
        console.log('Platform Dashboard: No hero_banner found in response')
      }
    } catch (err: any) {
      console.error('Platform Dashboard: Load content error:', err)
      setError(err.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Update hero_banner content
      const existingContent = sections.find(s => s.key === 'hero_banner')?.content || {}
      const updateResponse = await fetch('/api/platform/content/hero_banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          content: { 
            ...existingContent,
            imageUrl 
          } 
        }),
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to save image URL')
      }

      setHeroImage(imageUrl)
      
      // Reload sections to update list
      await loadContent()
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleHeroMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingMedia(true)
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
        throw new Error(data.detail || 'Failed to upload media')
      }

      const data = await response.json()
      const mediaUrl = data.url
      const isVideo = file.type.startsWith('video/')

      console.log('Platform Dashboard: Media uploaded, URL:', mediaUrl, 'isVideo:', isVideo)
      
      // Update hero_banner content in database
      const existingContent = sections.find(s => s.key === 'hero_banner')?.content || {}
      const contentToSave = {
        ...existingContent,
        ...(isVideo ? { videoUrl: mediaUrl, imageUrl: null } : { imageUrl: mediaUrl, videoUrl: null })
      }
      
      console.log('Platform Dashboard: Saving to hero_banner:', contentToSave)

      const updateResponse = await fetch('/api/platform/content/hero_banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          content: contentToSave
        }),
      })

      console.log('Platform Dashboard: Save response status:', updateResponse.status)

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        console.error('Platform Dashboard: Save failed:', errorText)
        throw new Error('Failed to save media URL')
      }

      const saveResult = await updateResponse.json()
      console.log('Platform Dashboard: Save successful:', saveResult)

      // Update local state
      if (isVideo) {
        setHeroVideo(mediaUrl)
        setHeroImage(null)
      } else {
        setHeroImage(mediaUrl)
        setHeroVideo(null)
      }
      
      // Reload sections to update list and verify save
      await loadContent()
      
      // Verify the save worked by checking public API
      try {
        const verifyResponse = await fetch('/api/platform/content', { cache: 'no-store' })
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json()
          console.log('Platform Dashboard: Verification after upload:', JSON.stringify(verifyData, null, 2))
        }
      } catch (verifyErr) {
        console.error('Platform Dashboard: Verification failed:', verifyErr)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload media')
    } finally {
      setUploadingMedia(false)
      e.target.value = ''
    }
  }

  const handleApply = async () => {
    setApplying(true)
    setError(null)
    setSuccess(false)

    try {
      // Check if we have media to save
      if (!heroVideo && !heroImage) {
        throw new Error('Нет медиа для сохранения. Пожалуйста, сначала загрузите видео или изображение.')
      }

      console.log('Platform Dashboard: Current state:', { 
        heroVideo, 
        heroImage, 
        sections: sections.map(s => s.key),
        hero_banner_section: sections.find(s => s.key === 'hero_banner')
      })
      
      // Ensure hero_banner content is saved with current media
      const existingContent = sections.find(s => s.key === 'hero_banner')?.content || {}
      const contentToSave = {
        ...existingContent,
        ...(heroVideo ? { videoUrl: heroVideo, imageUrl: null } : {}),
        ...(heroImage ? { imageUrl: heroImage, videoUrl: null } : {}),
      }

      console.log('Platform Dashboard: Applying changes with content:', JSON.stringify(contentToSave, null, 2))

      const updateResponse = await fetch('/api/platform/content/hero_banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          content: contentToSave
        }),
      })

      console.log('Platform Dashboard: Update response status:', updateResponse.status)

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        console.error('Platform Dashboard: Update failed, response text:', errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { detail: errorText || 'Unknown error' }
        }
        throw new Error(errorData.detail || 'Failed to apply changes')
      }

      const responseData = await updateResponse.json()
      console.log('Platform Dashboard: Update successful:', JSON.stringify(responseData, null, 2))

      // Verify the data was saved by checking the public API
      try {
        const verifyResponse = await fetch('/api/platform/content', {
          cache: 'no-store',
        })
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json()
          console.log('Platform Dashboard: Verification - API response:', JSON.stringify(verifyData, null, 2))
        }
      } catch (verifyErr) {
        console.error('Platform Dashboard: Verification failed:', verifyErr)
      }

      // Reload to ensure everything is synced
      await loadContent()
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Platform Dashboard: Apply error:', err)
      setError(err.message || 'Не удалось применить изменения')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">Загрузка...</div>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Управление платформеной страницей</h1>
            <p className="text-gray-600">
              Управляйте всем контентом платформенной страницы (кроме тарифов)
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-red-900">{error}</p>
                  <button
                    onClick={loadContent}
                    className="text-sm text-red-700 underline mt-1"
                  >
                    Попробовать снова
                  </button>
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
                  <p className="font-semibold text-green-900">Изменения применены! Медиа появится на платформенной странице.</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Hero Banner Image Upload */}
            <div 
              className={`rounded-2xl p-6 text-white shadow-xl cursor-pointer hover:shadow-2xl transition ${
                previewMode === 'image' 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 ring-4 ring-blue-300' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}
              onClick={() => {
                if (heroImage) {
                  setPreviewMode(previewMode === 'image' ? null : 'image')
                }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">📷</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Изображение</div>
              </div>
              <label 
                className="block cursor-pointer"
                onClick={(e) => {
                  // If image exists and clicked on card, toggle preview
                  if (heroImage) {
                    e.preventDefault()
                    setPreviewMode(previewMode === 'image' ? null : 'image')
                    return
                  }
                  // If no image, allow file input
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="text-2xl font-bold mb-2">
                  {uploading ? (
                    'Загрузка...'
                  ) : heroImage ? (
                    'Изображение загружено'
                  ) : (
                    'Загрузить изображение'
                  )}
                </div>
                <div className="text-blue-100 text-sm">
                  {heroImage ? 'Нажмите для предпросмотра' : 'Для hero баннера'}
                </div>
              </label>
            </div>

            {/* Hero Media Upload (Image/Video) */}
            <div 
              className={`rounded-2xl p-6 text-white shadow-xl cursor-pointer hover:shadow-2xl transition ${
                previewMode === 'video' 
                  ? 'bg-gradient-to-br from-green-600 to-emerald-700 ring-4 ring-green-300' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-600'
              }`}
              onClick={() => {
                if (heroVideo) {
                  setPreviewMode(previewMode === 'video' ? null : 'video')
                }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">🎬</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Медиа</div>
              </div>
              <label 
                className="block cursor-pointer"
                onClick={(e) => {
                  // If video exists and clicked on card, toggle preview
                  if (heroVideo) {
                    e.preventDefault()
                    setPreviewMode(previewMode === 'video' ? null : 'video')
                    return
                  }
                  // If no video, allow file input
                }}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleHeroMediaUpload}
                  disabled={uploadingMedia}
                  className="hidden"
                />
                <div className="text-2xl font-bold mb-2">
                  {uploadingMedia ? (
                    'Загрузка...'
                  ) : heroVideo ? (
                    'Видео загружено'
                  ) : heroImage ? (
                    'Изображение загружено'
                  ) : (
                    'Загрузить медиа'
                  )}
                </div>
                <div className="text-green-100 text-sm">
                  {heroVideo ? 'Нажмите для предпросмотра' : 'Изображение или видео'}
                </div>
              </label>
            </div>

            {/* Last Updated */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">🕐</div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Обновлено</div>
              </div>
              <div className="text-3xl font-bold mb-2">
                {sections.length > 0 && sections[0]?.updated_at 
                  ? new Date(sections[0].updated_at).toLocaleDateString('ru-RU')
                  : '—'}
              </div>
              <div className="text-purple-100">Последнее обновление</div>
            </div>
          </div>

          {/* Hero Banner Preview - Always visible */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {previewMode === 'video' ? 'Предпросмотр Видео Hero Баннера' : previewMode === 'image' ? 'Предпросмотр Изображения Hero Баннера' : 'Предпросмотр Hero Баннера'}
              </h3>
              <div className="flex items-center gap-4">
                {(heroVideo || heroImage) && (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center gap-2"
                  >
                    {applying ? (
                      <>
                        <span className="text-xl">⏳</span>
                        <span>Применение...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">✓</span>
                        <span>Применить</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div 
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ 
                height: 'clamp(300px, 60vw, 600px)',
                minHeight: '300px'
              }}
            >
              {previewMode === 'video' && heroVideo ? (
                // Show uploaded video
                <video
                  src={heroVideo}
                  className="w-full h-full object-cover rounded-2xl"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : previewMode === 'image' && heroImage ? (
                // Show uploaded image
                <img
                  src={heroImage}
                  alt="Hero banner preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : heroVideo ? (
                // Default to video if available
                <video
                  src={heroVideo}
                  className="w-full h-full object-cover rounded-2xl"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : heroImage ? (
                // Default to image if available
                <img
                  src={heroImage}
                  alt="Hero banner preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                // Show animated gradient background if no media
                <div
                  className="w-full h-full rounded-2xl"
                  style={{
                    background: 'linear-gradient(-45deg, #00C742, #00B36C, #0082D6, #007DE3, #00C742)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient 15s ease infinite',
                  }}
                />
              )}
            </div>
          </div>

          {/* Content Sections */}
          {sections.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Нет секций контента</h3>
                <p className="text-gray-600 mb-6">Секции контента появятся здесь после создания.</p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/platform-dashboard/sections/hero_banner"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg"
                  >
                    Создать первую секцию →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Секции контента</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {sections.filter(section => section.key !== 'hero_banner' && section.key !== 'pricing').map((section) => (
                  <div key={section.key} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            {section.key[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{section.key}</h3>
                            {section.updated_at && (
                              <p className="text-sm text-gray-500">
                                Обновлено: {new Date(section.updated_at).toLocaleString('ru-RU')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/platform-dashboard/sections/${section.key}`}
                        className="px-6 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"
                      >
                        Редактировать →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/platform-dashboard/sections/hero_banner"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition group"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hero Banner</h3>
              <p className="text-gray-600 text-sm">Главный баннер секция</p>
            </Link>

            <Link
              href="/platform-dashboard/sections/features"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition group"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                ✨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Features</h3>
              <p className="text-gray-600 text-sm">Секция возможностей</p>
            </Link>

            <Link
              href="/platform-dashboard/sections/pricing"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition group"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                💰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pricing</h3>
              <p className="text-gray-600 text-sm">Секция тарифов</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


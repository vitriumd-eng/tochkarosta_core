'use client'

import { useEffect, useState } from 'react'

export const HeroMedia = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load hero_banner content from API
    const loadContent = async () => {
      try {
        console.log('HeroMedia: Fetching content from /api/platform/content')
        const response = await fetch('/api/platform/content', {
          cache: 'no-store', // Always fetch fresh data
        })
        
        console.log('HeroMedia: Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('HeroMedia: API response:', data)
          console.log('HeroMedia: hero_banner:', data.hero_banner)
          
          if (data.hero_banner?.content?.videoUrl) {
            const videoUrl = data.hero_banner.content.videoUrl
            console.log('HeroMedia: Setting videoUrl:', videoUrl)
            setVideoUrl(videoUrl)
            setImageUrl(null)
          } else if (data.hero_banner?.content?.imageUrl) {
            const imageUrl = data.hero_banner.content.imageUrl
            console.log('HeroMedia: Setting imageUrl:', imageUrl)
            setImageUrl(imageUrl)
            setVideoUrl(null)
          } else {
            console.log('HeroMedia: No videoUrl or imageUrl found in hero_banner')
            console.log('HeroMedia: hero_banner content:', data.hero_banner?.content)
            console.log('HeroMedia: Full data structure:', JSON.stringify(data, null, 2))
          }
        } else {
          console.error('HeroMedia: API response not OK:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('HeroMedia: Error response:', errorText)
        }
      } catch (error) {
        console.error('HeroMedia: Failed to load hero banner content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
    
    // Reload content every 5 seconds to check for updates
    const interval = setInterval(loadContent, 5000)
    return () => clearInterval(interval)
  }, [])

  const sectionStyle = {
    height: 'clamp(300px, 60vw, 870px)', 
    maxWidth: '1440px',
    marginBottom: '0',
    zIndex: 50,
    borderRadius: '16px',
    position: 'relative' as const
  }

  return (
    <section 
      className="relative w-full mx-auto overflow-hidden px-4 md:px-8 -mt-[217.5px] md:-mt-[217.5px]"
      style={sectionStyle}
    >
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
        {videoUrl ? (
          // Show uploaded video if available
          <video
            src={videoUrl}
            className="w-full h-full rounded-2xl object-cover"
            style={{
              height: 'clamp(300px, 60vw, 870px)',
            }}
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => {
              // Fallback to gradient if video fails to load
              console.error('HeroMedia: Video failed to load:', videoUrl, e)
              setVideoUrl(null)
            }}
            onLoadStart={() => {
              console.log('HeroMedia: Video loading started:', videoUrl)
            }}
            onCanPlay={() => {
              console.log('HeroMedia: Video can play:', videoUrl)
            }}
          />
        ) : imageUrl ? (
          // Show uploaded image if available
          <img
            src={imageUrl}
            alt="Hero banner"
            className="w-full h-full rounded-2xl object-cover"
            style={{
              height: 'clamp(300px, 60vw, 870px)',
            }}
            onError={(e) => {
              // Fallback to gradient if image fails to load
              console.error('HeroMedia: Image failed to load:', imageUrl, e)
              setImageUrl(null)
            }}
            onLoad={() => {
              console.log('HeroMedia: Image loaded successfully:', imageUrl)
            }}
          />
        ) : (
          // Fallback to gradient background
          <div
            className="w-full h-full rounded-2xl"
            style={{
              height: 'clamp(300px, 60vw, 870px)',
              background: 'linear-gradient(135deg, #00C742 0%, #00B36C 29%, #0082D6 93%, #007DE3 100%)'
            }}
          />
        )}
      </div>
      {/* Overlay: only show when no video/image is loaded */}
      {!(videoUrl || imageUrl) && (
        <div
          className="absolute inset-0 bg-black rounded-2xl"
          style={{ 
            opacity: 0.15,
            height: '100%'
          }}
        />
      )}
    </section>
  )
}




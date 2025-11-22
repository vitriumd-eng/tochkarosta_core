'use client'

import { useEffect } from 'react'

export const BarChart3D = () => {
  const bars = [
    { height: 180, width: 50 },
    { height: 140, width: 50 },
    { height: 100, width: 50 },
    { height: 60, width: 50 },
  ]

  useEffect(() => {
    // Добавляем CSS анимацию
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideInBar {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .bar-animate {
        animation: slideInBar 0.8s ease-out both;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="w-full h-full max-w-[750px] flex items-center justify-center relative" style={{ minHeight: '400px' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '400px', height: '300px' }}>
        {/* Фон */}
        <div 
          className="absolute inset-0 rounded-2xl" 
          style={{ 
            background: 'linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        ></div>
        
        {/* Барчарт */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-6" style={{ padding: '50px 40px 40px' }}>
          {bars.map((bar, index) => (
            <div
              key={index}
              className="relative bar-animate"
              style={{
                width: `${bar.width}px`,
                height: `${bar.height}px`,
                animationDelay: `${index * 0.15}s`
              }}
            >
              {/* 3D Бар */}
              <div
                className="relative w-full h-full rounded-t-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                  boxShadow: `
                    0 8px 16px rgba(0, 0, 0, 0.1),
                    0 4px 8px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.9),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                  `,
                  transform: 'perspective(600px) rotateX(-8deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Верхняя грань (3D эффект) */}
                <div
                  className="absolute top-0 left-0 right-0 rounded-t-lg"
                  style={{
                    height: '25px',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
                    transform: 'translateZ(20px) rotateX(8deg)',
                    boxShadow: '0 -3px 6px rgba(0, 0, 0, 0.1)',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                  }}
                ></div>
                
                {/* Тень справа */}
                <div
                  className="absolute"
                  style={{
                    bottom: '0',
                    left: '100%',
                    width: '12px',
                    height: `${bar.height * 0.3}px`,
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '0 4px 4px 0',
                    transform: 'skewY(-45deg)',
                    transformOrigin: 'bottom left',
                    filter: 'blur(3px)'
                  }}
                ></div>
                
                {/* Тень снизу */}
                <div
                  className="absolute"
                  style={{
                    bottom: '-10px',
                    left: '10px',
                    right: '-10px',
                    height: '10px',
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(6px)'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


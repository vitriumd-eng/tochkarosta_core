'use client'

export const HeroMedia = () => {
  return (
    <section 
      className="relative w-full mx-auto overflow-hidden px-4 md:px-8 -mt-[220px] md:-mt-[220px]"
      style={{
        height: 'clamp(300px, 60vw, 870px)', 
        maxWidth: '1440px',
        marginBottom: '0',
        zIndex: 50,
        borderRadius: '16px',
        position: 'relative'
      }}
    >
      {/* Window frame with header */}
      <div className="bg-[#FFFEF7] rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col noise-texture">
        {/* Window controls - шапка с тремя точками */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0e1a] border-b border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full rounded-b-2xl overflow-hidden">
            <div
              className="w-full rounded-b-2xl"
              style={{
                height: '60%',
                background: 'linear-gradient(135deg, #00C742 0%, #00B36C 29%, #0082D6 93%, #007DE3 100%)'
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 top-0 bg-black rounded-b-2xl border-gray-700"
            style={{ 
              opacity: 0.15,
              height: '60%',
              top: '-10px',
              borderWidth: '2px',
              borderStyle: 'solid'
            }}
          />
        </div>
      </div>
    </section>
  )
}


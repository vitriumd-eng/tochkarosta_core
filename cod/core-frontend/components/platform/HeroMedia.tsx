export const HeroMedia = () => (
  <section 
    className="relative w-full mx-auto overflow-hidden px-4 md:px-8 -mt-[217.5px] md:-mt-[217.5px]"
    style={{ 
      height: 'clamp(300px, 60vw, 870px)', 
      maxWidth: '1440px',
      marginBottom: '0',
      zIndex: 50,
      borderRadius: '16px',
      position: 'relative'
    }}
  >
    <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
      <div
        className="w-full h-full rounded-2xl"
        style={{
          height: 'clamp(300px, 60vw, 870px)',
          background: 'linear-gradient(135deg, #00C742 0%, #00B36C 29%, #0082D6 93%, #007DE3 100%)'
        }}
      />
    </div>
    <div
      className="absolute inset-0 bg-black rounded-2xl"
      style={{ 
        opacity: 0.15,
        height: '100%'
      }}
    />
  </section>
)




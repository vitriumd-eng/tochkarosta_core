'use client'

interface Module {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'inactive' | 'coming_soon'
  color: string
}

interface ModulesGridProps {
  modules: Module[]
  onActivate?: (moduleId: string) => void
}

export const ModulesGrid = ({ modules, onActivate }: ModulesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <div
          key={module.id}
          className="rounded-xl p-6 hover:scale-[1.02] transition-all backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
            border: '1px solid rgba(0, 255, 153, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 153, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 153, 0.1)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="p-3 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #00ff99 0%, #00b3ff 100%)'
              }}
            >
              {module.icon}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                module.status === 'active'
                  ? 'bg-[#00ff99]/20 text-[#00ff99]'
                  : module.status === 'coming_soon'
                  ? 'bg-gray-700/50 text-gray-400'
                  : 'bg-gray-700/30 text-gray-500'
              }`}
            >
              {module.status === 'active'
                ? 'Активен'
                : module.status === 'coming_soon'
                ? 'Скоро'
                : 'Неактивен'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {module.name}
          </h3>
          <p className="text-gray-300 text-sm mb-4">{module.description}</p>
          {module.status === 'active' ? (
            <button 
              className="w-full py-2 font-semibold rounded-lg transition-colors text-[#0a0e1a]"
              style={{
                background: 'linear-gradient(135deg, #00ff99 0%, #00b3ff 100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #00ffaa 0%, #00c4ff 100%)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #00ff99 0%, #00b3ff 100%)'
              }}
            >
              Открыть модуль
            </button>
          ) : module.status === 'coming_soon' ? (
            <button
              className="w-full py-2 bg-gray-700/50 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
              disabled
            >
              Скоро
            </button>
          ) : (
            <button
              onClick={() => onActivate?.(module.id)}
              className="w-full py-2 bg-gray-700/30 text-gray-300 font-semibold rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              Активировать
            </button>
          )}
        </div>
      ))}
    </div>
  )
}


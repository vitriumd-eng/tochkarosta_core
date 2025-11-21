'use client'

interface StatCard {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}

interface StatsCardsProps {
  stats: StatCard[]
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl p-6 hover:scale-[1.02] transition-all backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
            border: '1px solid rgba(0, 255, 153, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="p-3 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #00ff99 0%, #00b3ff 100%)'
              }}
            >
              {stat.icon}
            </div>
            {stat.change && (
              <span
                className={`text-sm font-semibold ${
                  stat.change.startsWith('+')
                    ? 'text-[#00ff99]'
                    : 'text-red-400'
                }`}
              >
                {stat.change}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {stat.value}
          </h3>
          <p className="text-sm text-gray-300">{stat.title}</p>
        </div>
      ))}
    </div>
  )
}


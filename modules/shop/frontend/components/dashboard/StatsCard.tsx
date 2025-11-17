/**
 * Stats Card Component
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

interface StatsCardProps {
  icon: string
  label: string
  value: string | number
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const colorClasses = {
  blue: 'bg-blue-200',
  green: 'bg-green-200',
  purple: 'bg-purple-200',
  orange: 'bg-orange-200',
}

export default function StatsCard({ icon, label, value, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`${colorClasses[color]} w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}


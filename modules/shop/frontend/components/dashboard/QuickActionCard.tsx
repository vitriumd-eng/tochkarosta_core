/**
 * Quick Action Card Component
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import Link from 'next/link'

interface QuickActionCardProps {
  icon: string
  label: string
  href: string
  color: 'blue' | 'green' | 'pink' | 'purple'
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
}

export default function QuickActionCard({ icon, label, href, color }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
    >
      <div className={`${colorClasses[color]} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mb-4`}>
        {icon}
      </div>
      <p className="font-semibold text-gray-900">{label}</p>
    </Link>
  )
}




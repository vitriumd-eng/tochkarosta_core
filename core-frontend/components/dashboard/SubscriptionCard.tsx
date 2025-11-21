'use client'

interface Subscription {
  tariff_name?: string
  status?: string
  expires_at?: string
  is_active?: boolean
}

interface SubscriptionCardProps {
  subscription: Subscription | null
  loading?: boolean
}

export const SubscriptionCard = ({ subscription, loading }: SubscriptionCardProps) => {
  if (loading) {
    return (
      <div 
        className="rounded-xl p-6 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
          border: '1px solid rgba(0, 255, 153, 0.1)'
        }}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div 
        className="rounded-xl shadow-lg p-6 text-white backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #00ff99 0%, #00b3ff 50%, #0066cc 100%)',
          border: '1px solid rgba(0, 255, 153, 0.3)'
        }}
      >
        <h3 className="text-xl font-bold mb-2">Подписка не активна</h3>
        <p className="text-white/90 mb-4">
          Выберите тариф и начните использовать все возможности платформы
        </p>
        <button 
          className="px-6 py-2 bg-white text-[#0a0e1a] font-semibold rounded-full hover:bg-gray-100 transition-colors"
        >
          Выбрать тариф
        </button>
      </div>
    )
  }

  const isActive = subscription.is_active && subscription.status === 'active'
  const expiresDate = subscription.expires_at
    ? new Date(subscription.expires_at).toLocaleDateString('ru-RU')
    : null

  return (
    <div
      className="rounded-xl shadow-sm p-6 backdrop-blur-sm"
      style={
        isActive
          ? {
              background: 'linear-gradient(135deg, #00ff99 0%, #00b3ff 50%, #0066cc 100%)',
              border: '1px solid rgba(0, 255, 153, 0.3)'
            }
          : {
              background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
              border: '1px solid rgba(0, 255, 153, 0.1)'
            }
      }
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${isActive ? 'text-white' : 'text-white'}`}>
          {subscription.tariff_name || 'Без подписки'}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-gray-700/50 text-gray-300'
          }`}
        >
          {isActive ? 'Активна' : 'Неактивна'}
        </span>
      </div>
      {expiresDate && (
        <p className={isActive ? 'text-white/90' : 'text-gray-300'}>
          Действует до: {expiresDate}
        </p>
      )}
      {!isActive && (
        <button 
          className="mt-4 px-6 py-2 font-semibold rounded-full transition-colors"
          style={{
            background: 'linear-gradient(135deg, #00ff99 0%, #00b3ff 100%)',
            color: '#0a0e1a'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #00ffaa 0%, #00c4ff 100%)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #00ff99 0%, #00b3ff 100%)'
          }}
        >
          Активировать подписку
        </button>
      )}
    </div>
  )
}


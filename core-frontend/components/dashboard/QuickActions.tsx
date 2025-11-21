'use client'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  color: string
}

interface QuickActionsProps {
  actions: QuickAction[]
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const content = (
          <div 
            className="rounded-lg p-4 transition-all cursor-pointer h-full backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
              border: '1px solid rgba(0, 255, 153, 0.1)',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 153, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 255, 153, 0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div 
              className="inline-flex p-2 rounded-lg mb-3"
              style={{
                background: 'linear-gradient(135deg, #00ff99 0%, #00b3ff 100%)'
              }}
            >
              {action.icon}
            </div>
            <h4 className="font-semibold text-white mb-1">{action.title}</h4>
            <p className="text-sm text-gray-300">{action.description}</p>
          </div>
        )

        if (action.href) {
          return (
            <a key={action.id} href={action.href}>
              {content}
            </a>
          )
        }

        return (
          <div key={action.id} onClick={action.onClick}>
            {content}
          </div>
        )
      })}
    </div>
  )
}


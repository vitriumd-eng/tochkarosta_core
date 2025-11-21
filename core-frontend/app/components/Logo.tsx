/**
 * Логотип "точка роста" со стилизованными элементами
 * Буква "о" с растением, буква "т" с шестеренкой
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-3xl font-bold text-black">
        точка{' '}
        <span className="relative inline-block">
          р
          <span className="relative inline-block text-green-600">
            о
            <span className="absolute -top-1 -right-1 text-xs leading-none">🌱</span>
          </span>
          с
          <span className="relative inline-block">
            т
            <span className="absolute -top-0.5 -right-1 text-xs leading-none">⚙️</span>
          </span>
          а
        </span>
      </h1>
    </div>
  )
}


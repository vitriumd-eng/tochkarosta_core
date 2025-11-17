/**
 * Global Error Boundary for App Router
 * Replaces _error.js from Pages Router
 */
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Что-то пошло не так</h1>
        <p className="text-gray-600 mb-6">
          Произошла ошибка при загрузке страницы. Попробуйте обновить страницу.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Попробовать снова
        </button>
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-semibold text-red-900 mb-2">Детали ошибки (dev):</p>
            <p className="text-xs text-red-700 font-mono">{error.message}</p>
            {error.stack && (
              <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap overflow-auto max-h-60">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}




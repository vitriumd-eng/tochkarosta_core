'use client'

import { useState, useCallback } from 'react'
import { api, ApiError } from '../lib/api'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

export function useApi<T = any>(endpoint: string, options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await api.get<T>(endpoint)
      setData(result)
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      options.onError?.(apiError)
      throw apiError
    } finally {
      setLoading(false)
    }
  }, [endpoint, options])

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  }
}

export function useMutation<T = any, D = any>(endpoint: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST') {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const mutate = useCallback(async (data?: D) => {
    setLoading(true)
    setError(null)
    
    try {
      let result: T
      if (method === 'POST') {
        result = await api.post<T>(endpoint, data)
      } else if (method === 'PUT') {
        result = await api.put<T>(endpoint, data)
      } else {
        result = await api.delete<T>(endpoint)
      }
      return result
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      throw apiError
    } finally {
      setLoading(false)
    }
  }, [endpoint, method])

  return {
    mutate,
    loading,
    error
  }
}




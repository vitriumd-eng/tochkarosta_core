'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, removeToken, isAuthenticated } from '../lib/auth'
import { api } from '../lib/api'

interface User {
  id: string
  phone: string
  first_name?: string
  last_name?: string
  role: string
  tenant_id?: string
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    if (!isAuthenticated()) {
      setLoading(false)
      return
    }

    try {
      // TODO: Создать endpoint /api/auth/me для получения текущего пользователя
      // const userData = await api.get<User>('/api/auth/me')
      // setUser(userData)
    } catch (error) {
      console.error('Auth check failed:', error)
      removeToken()
    } finally {
      setLoading(false)
    }
  }

  const login = (token: string) => {
    // setToken(token) - уже делается в форме регистрации
    checkAuth()
  }

  const logout = () => {
    removeToken()
    setUser(null)
    router.push('/')
  }

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    checkAuth
  }
}








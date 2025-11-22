import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch('http://localhost:8000/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30 секунд таймаут
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || 'Failed to get chat response' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    if (error.message?.includes('fetch') || error.code === 'ECONNREFUSED' || error.name === 'AbortError') {
      return NextResponse.json(
        { 
          error: 'Backend service unavailable', 
          detail: 'Не удалось подключиться к серверу. Убедитесь, что backend запущен на порту 8000.',
          message: 'Извините, сервис временно недоступен. Попробуйте позже.',
          template: 'text'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        message: 'Произошла ошибка при обработке запроса. Попробуйте еще раз.',
        template: 'text'
      },
      { status: 500 }
    )
  }
}



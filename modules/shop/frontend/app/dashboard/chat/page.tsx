/**
 * Dashboard - Internal Chat Page
 * Правила копирования: только дизайн (UI), без логики и взаимосвязей
 */
'use client'

import { useState } from 'react'
import Sidebar from '../../../components/dashboard/Sidebar'

interface Message {
  id: string
  sender: string
  text: string
  time: string
  isOwn: boolean
}

export default function ChatPage() {
  const [messages] = useState<Message[]>([
    { id: '1', sender: 'Иван Иванов', text: 'Привет! Как дела?', time: '10:30', isOwn: true },
    { id: '2', sender: 'Мария Петрова', text: 'Всё отлично, спасибо!', time: '10:32', isOwn: false },
  ])
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Иван Иванов" />
      
      <main className="lg:ml-64 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Внутренний Чат</h1>

        <div className="bg-white rounded-xl shadow-md h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md rounded-xl p-4 ${
                  message.isOwn
                    ? 'gradient-button text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-xs opacity-75 mb-1">{message.sender}</p>
                  <p>{message.text}</p>
                  <p className="text-xs opacity-75 mt-1 text-right">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // Send message
                    setNewMessage('')
                  }
                }}
              />
              <button className="px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition font-semibold shadow-button">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


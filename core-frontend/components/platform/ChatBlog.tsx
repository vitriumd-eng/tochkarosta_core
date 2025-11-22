'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Zap, Send, Check } from 'lucide-react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  template?: string
  data?: any
}

export const ChatBlog = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привет! Я AI-консультант платформы Точка.Роста. Задайте вопрос о платформе, и я помогу!',
      template: 'buttons',
      data: {
        buttons: [
          'Какие модули доступны?',
          'Сколько стоит платформа?',
          'Какие AI-инструменты есть?',
          'Как начать работу?'
        ]
      }
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSecondFloating, setShowSecondFloating] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Проверяем, есть ли сообщения от пользователя
  const hasUserMessages = messages.some(m => m.role === 'user')

  // Список транзакций для анимированного слайдера
  const transactions = [
    { icon: '🧥', title: 'Куртка детская', amount: '+4 500 ₽', time: '2 мин назад' },
    { icon: '📸', title: 'Фотосессия', amount: '+6 500 ₽', time: '5 мин назад' },
    { icon: '🍯', title: 'Мед цветочный 1л', amount: '+500 ₽', time: '8 мин назад' },
    { icon: '🏠', title: 'Модульный дом Domania', amount: '+350 000 ₽', time: '12 мин назад' },
    { icon: '🎓', title: 'Курс таргетолога UperOne', amount: '+55 000 ₽', time: '15 мин назад' },
    { icon: '🎟️', title: 'Билеты на мероприятие', amount: '+800 ₽', time: '18 мин назад' },
    { icon: '🧶', title: 'Вязаный свитер', amount: '+3 200 ₽', time: '22 мин назад' },
    { icon: '💆', title: 'Консультация психолога', amount: '+2 500 ₽', time: '25 мин назад' },
    { icon: '💻', title: 'Онлайн-курс по программированию', amount: '+12 000 ₽', time: '30 мин назад' },
    { icon: '📷', title: 'Портретная съемка', amount: '+5 500 ₽', time: '35 мин назад' },
    { icon: '🍯', title: 'Мед липовый 0.5л', amount: '+400 ₽', time: '40 мин назад' },
    { icon: '🏺', title: 'Мастер-класс по керамике', amount: '+1 800 ₽', time: '45 мин назад' },
    { icon: '🎨', title: 'Дизайн логотипа', amount: '+8 500 ₽', time: '50 мин назад' },
    { icon: '💒', title: 'Видеосъемка свадьбы', amount: '+45 000 ₽', time: '1 ч назад' },
    { icon: '📚', title: 'Онлайн-курс английского', amount: '+6 000 ₽', time: '1 ч 10 мин назад' },
    { icon: '📖', title: 'Фотокнига', amount: '+3 500 ₽', time: '1 ч 20 мин назад' },
    { icon: '⚖️', title: 'Консультация юриста', amount: '+5 000 ₽', time: '1 ч 30 мин назад' },
    { icon: '📹', title: 'Курс по фотографии', amount: '+15 000 ₽', time: '1 ч 40 мин назад' },
    { icon: '🎁', title: 'Подарочный сертификат', amount: '+2 000 ₽', time: '1 ч 50 мин назад' },
    { icon: '🎬', title: 'Видеомонтаж', amount: '+7 500 ₽', time: '2 ч назад' },
  ]

  useEffect(() => {
    if (!hasUserMessages) {
      // Первый элемент появляется сразу, второй через 0.5 секунды
      const timer = setTimeout(() => {
        setShowSecondFloating(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShowSecondFloating(false)
    }
  }, [hasUserMessages])

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend || isLoading) return

    setInputValue('')
    setIsLoading(true)

    // Добавляем сообщение пользователя
    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }]
    setMessages(newMessages)

    try {
      // Отправляем запрос на API через Next.js API route
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages.slice(0, -1)
        }),
      })

      const data = await response.json()
      
      // Если ответ не успешен, показываем стандартный ответ
      if (!response.ok) {
        setMessages([...newMessages, {
          role: 'assistant',
          content: 'На этом мои полномочия как бы все! Извините'
        }])
        return
      }
      
      // Добавляем ответ ассистента с шаблоном
      setMessages([...newMessages, {
        role: 'assistant',
        content: data.message,
        template: data.template,
        data: data.data
      }])
    } catch (error) {
      // При ошибке показываем стандартный ответ
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка:', error)
      }
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'На этом мои полномочия как бы все! Извините'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Рендеринг шаблонов
  const renderTemplate = (message: Message) => {
    if (!message.template || !message.data) {
      return <p className="text-sm whitespace-pre-wrap">{message.content}</p>
    }

    switch (message.template) {
      case 'cards':
        return (
          <div>
            <p className="text-sm mb-3">{message.content}</p>
            <div className="grid grid-cols-2 gap-2">
              {message.data.cards?.map((card: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-lg mb-1">{card.icon}</div>
                  <p className="text-xs font-semibold text-[#1D1D1F] mb-1">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'list':
        return (
          <div>
            <p className="text-sm mb-3">{message.content}</p>
            <div className="space-y-2">
              {message.data.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-2 bg-white rounded-lg p-2">
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-[#1D1D1F]">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'steps':
        return (
          <div>
            <p className="text-sm mb-3">{message.content}</p>
            <div className="space-y-3">
              {message.data.steps?.map((step: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1D1D1F]">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'comparison':
        const comp = message.data.comparison
        if (comp.before && comp.after) {
          // Сравнение времени
          return (
            <div>
              <p className="text-sm mb-3">{message.content}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-gray-500 mb-1">{comp.before.title}</p>
                  <p className="text-lg font-bold text-red-600 line-through">{comp.before.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{comp.before.description}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs text-emerald-600 font-semibold mb-1">{comp.after.title}</p>
                  <p className="text-lg font-bold text-emerald-600">{comp.after.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{comp.after.description}</p>
                </div>
              </div>
            </div>
          )
        } else if (comp.traditional && comp.platform) {
          // Сравнение стоимости
          return (
            <div>
              <p className="text-sm mb-3">{message.content}</p>
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-[#1D1D1F]">{comp.traditional.title}</p>
                    <p className="text-xs text-gray-600">{comp.traditional.price}</p>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {comp.traditional.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-1">
                        <span>•</span> <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-emerald-700">{comp.platform.title}</p>
                    <p className="text-xs font-bold text-emerald-600">{comp.platform.price}</p>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {comp.platform.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-1">
                        <Check size={12} className="text-emerald-600" /> <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {comp.note && (
                  <p className="text-xs text-gray-500 italic">{comp.note}</p>
                )}
              </div>
            </div>
          )
        }
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>

      case 'buttons':
        return (
          <div>
            <p className="text-sm mb-3">{message.content}</p>
            <div className="flex flex-wrap gap-2">
              {message.data.buttons?.map((button: string, index: number) => (
                <button
                  key={index}
                  onClick={() => sendMessage(button)}
                  className="bg-white border border-gray-300 rounded-full px-3 py-1.5 text-xs hover:bg-gray-50 transition text-[#1D1D1F]"
                >
                  {button}
                </button>
              ))}
            </div>
          </div>
        )

      case 'text':
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>
    }
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="px-[25px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
          
          {/* Левая часть: Текст */}
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-[650px]">
              <p className="text-xl md:text-2xl font-medium text-[#1D1D1F] text-center lg:text-left">
                Вы можете задать вопросы нашему консультанту
              </p>
            </div>
          </div>

          {/* Правая часть: Карточка с чатом */}
          <div className="w-full flex items-center justify-start relative">
            <div className="bg-[#F5F5F7] rounded-[2rem] p-6 shadow-xl border border-gray-100 w-full max-w-[650px] relative">
              {/* Floating Elements - наполовину выходят за серую карточку */}
              {!hasUserMessages && (
                <>
                  <div className="absolute top-[180px] left-0 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-20 message-enter wiggle-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">🛍️</div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Новый заказ</div>
                        <div className="text-sm font-bold text-[#1D1D1F]">Оплачено 4,500₽</div>
                      </div>
                    </div>
                  </div>

                  {showSecondFloating && (
                    <div className="absolute top-16 right-0 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-20 message-enter wiggle-right">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl">⚡</div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">AI Генератор</div>
                          <div className="text-sm font-bold text-[#1D1D1F]">Пост написан</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            {/* Заголовок чата */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1D1D1F]">AI Консультант</h3>
                <p className="text-xs text-gray-500">Готов ответить на ваши вопросы</p>
              </div>
            </div>

            {/* Окно чата */}
            <div className="bg-white rounded-xl p-4 mb-4 min-h-[360px] max-h-[480px] overflow-y-auto flex flex-col gap-3 relative">
              {/* Dashboard Content */}
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-[10px] text-gray-400 font-medium mb-0.5">Баланс (Рубли)</div>
                  <div className="text-xl md:text-2xl font-extrabold text-[#1D1D1F]">142,500 ₽</div>
                </div>
                <div className="flex gap-1.5">
                  <div className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 text-[10px] font-bold text-gray-600 shadow-sm">+ Добавить</div>
                  <div className="px-2.5 py-1 bg-[#1D1D1F] text-white rounded-lg text-[10px] font-bold shadow-sm">Вывести</div>
                </div>
              </div>
              
              {/* Chart Mockup */}
              <div className="h-[400px] w-full bg-white rounded-lg border border-gray-100 p-2 flex items-end justify-between gap-1 mb-3 sticky top-0 chart-enter">
                <div className="w-full bg-purple-50 rounded-t-md h-[40%] relative group"></div>
                <div className="w-full bg-purple-100 rounded-t-md h-[60%] relative group"></div>
                <div className="w-full bg-purple-200 rounded-t-md h-[50%] relative group"></div>
                <div className="w-full bg-purple-300 rounded-t-md h-[75%] relative group"></div>
                <div className="w-full bg-purple-400 rounded-t-md h-[65%] relative group"></div>
                <div className="w-full bg-[#7C3AED] rounded-t-md h-[90%] relative group"></div>
              </div>

              {/* Recent Orders List - Анимированный слайдер */}
              <div className="flex-1 overflow-hidden relative">
                <div className="space-y-1.5 animate-scroll-up">
                  {[...transactions, ...transactions].map((transaction, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                          {transaction.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-[#1D1D1F] truncate">{transaction.title}</div>
                          <div className="text-[9px] text-gray-400">{transaction.time} • Telegram</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-green-600 flex-shrink-0 ml-2">{transaction.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Поле ввода */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="bg-[#1F1D2B] text-white rounded-full p-2 hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

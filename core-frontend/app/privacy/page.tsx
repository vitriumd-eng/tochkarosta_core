import { Header } from '@/components/platform/Header'
import { Footer } from '@/components/platform/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-[25px]">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mb-8">
            Политика конфиденциальности
          </h1>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-6 text-gray-700">
            <p className="text-sm text-gray-500 mb-6">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">1. Общие положения</h2>
              <p className="mb-4">
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
                пользователей платформы «Точка.Роста» (далее — «Платформа»).
              </p>
              <p>
                Используя Платформу, вы даете согласие на обработку ваших персональных данных в соответствии с 
                настоящей Политикой конфиденциальности и требованиями законодательства Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">2. Собираемые данные</h2>
              <h3 className="text-xl font-semibold mb-3">2.1. Персональные данные, которые мы собираем:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Фамилия, имя, отчество</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Реквизиты для оплаты услуг (при необходимости)</li>
                <li>IP-адрес и данные о браузере</li>
                <li>Информация об использовании Платформы</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3">2.2. Данные, собираемые автоматически:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Информация об устройстве и браузере</li>
                <li>Логи доступа и действия на Платформе</li>
                <li>Cookies и аналогичные технологии</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">3. Цели обработки данных</h2>
              <p className="mb-4">Мы обрабатываем персональные данные для следующих целей:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Предоставление доступа к Платформе и ее услугам</li>
                <li>Обработка заказов и платежей</li>
                <li>Коммуникация с пользователями по вопросам использования Платформы</li>
                <li>Улучшение качества услуг и функционала Платформы</li>
                <li>Обеспечение безопасности и предотвращение мошенничества</li>
                <li>Соблюдение требований законодательства</li>
                <li>Отправка информационных и рекламных материалов (с согласия пользователя)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">4. Способы обработки данных</h2>
              <p className="mb-4">
                Обработка персональных данных осуществляется с использованием средств автоматизации и без использования 
                таких средств, включая:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Сбор и систематизацию</li>
                <li>Хранение и накопление</li>
                <li>Уточнение и обновление</li>
                <li>Использование и передачу</li>
                <li>Блокирование и удаление</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">5. Защита данных</h2>
              <p className="mb-4">
                Мы применяем технические и организационные меры для защиты персональных данных от неправомерного 
                доступа, уничтожения, изменения, блокирования, копирования, предоставления, распространения, а также 
                от иных неправомерных действий.
              </p>
              <p>
                К таким мерам относятся: использование защищенных каналов связи, шифрование данных, ограничение 
                доступа к персональным данным, регулярное обновление систем безопасности.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">6. Передача данных третьим лицам</h2>
              <p className="mb-4">
                Мы не передаем персональные данные третьим лицам, за исключением следующих случаев:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Пользователь дал согласие на такие действия</li>
                <li>Передача необходима для предоставления услуг Платформы</li>
                <li>Передача предусмотрена законодательством Российской Федерации</li>
                <li>Передача происходит в рамках слияния, поглощения или продажи активов</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">7. Сроки хранения данных</h2>
              <p>
                Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, или в 
                течение срока, установленного законодательством. После истечения срока хранения данные удаляются 
                или обезличиваются.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">8. Права пользователей</h2>
              <p className="mb-4">Пользователь имеет право:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Получать информацию о своих персональных данных</li>
                <li>Требовать уточнения, блокирования или удаления данных</li>
                <li>Отозвать согласие на обработку персональных данных</li>
                <li>Обжаловать действия администрации в уполномоченном органе по защите прав субъектов персональных данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">9. Cookies</h2>
              <p className="mb-4">
                Платформа использует файлы cookies для улучшения работы сайта и персонализации пользовательского опыта. 
                Вы можете отключить cookies в настройках браузера, однако это может повлиять на функциональность Платформы.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">10. Контактная информация</h2>
              <p>
                По вопросам обработки персональных данных вы можете обращаться по адресу: 
                <a href="mailto:info@tochkarosta.ru" className="text-[#1F1D2B] hover:underline ml-1">
                  info@tochkarosta.ru
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}



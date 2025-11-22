import { Header } from '@/components/platform/Header'
import { Footer } from '@/components/platform/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-[25px]">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mb-8">
            Пользовательское соглашение
          </h1>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg space-y-6 text-gray-700">
            <p className="text-sm text-gray-500 mb-6">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">1. Общие положения</h2>
              <p className="mb-4">
                Настоящее Пользовательское соглашение (далее — «Соглашение») определяет условия использования платформы 
                «Точка.Роста» (далее — «Платформа») и устанавливает права и обязанности между администрацией Платформы 
                и пользователями.
              </p>
              <p>
                Используя Платформу, вы соглашаетесь с условиями настоящего Соглашения. Если вы не согласны с какими-либо 
                условиями, пожалуйста, не используйте Платформу.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">2. Определения</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Платформа</strong> — веб-сайт и сервисы, предоставляемые под брендом «Точка.Роста»</li>
                <li><strong>Пользователь</strong> — физическое или юридическое лицо, использующее Платформу</li>
                <li><strong>Модули</strong> — готовые цифровые бизнес-решения, доступные на Платформе</li>
                <li><strong>Услуги</strong> — все функции и возможности, предоставляемые Платформой</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">3. Права и обязанности пользователя</h2>
              <h3 className="text-xl font-semibold mb-3">3.1. Пользователь имеет право:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Использовать Платформу в соответствии с ее назначением</li>
                <li>Создавать и управлять своими цифровыми бизнесами через доступные модули</li>
                <li>Получать техническую поддержку в рамках предоставляемых услуг</li>
                <li>Отозвать согласие на обработку персональных данных</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3">3.2. Пользователь обязуется:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Предоставлять достоверную информацию при регистрации</li>
                <li>Не использовать Платформу в незаконных целях</li>
                <li>Не нарушать права других пользователей и третьих лиц</li>
                <li>Соблюдать конфиденциальность данных доступа к аккаунту</li>
                <li>Не передавать доступ к аккаунту третьим лицам</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">4. Права и обязанности администрации</h2>
              <h3 className="text-xl font-semibold mb-3">4.1. Администрация обязуется:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Обеспечивать работоспособность Платформы</li>
                <li>Защищать персональные данные пользователей</li>
                <li>Предоставлять техническую поддержку</li>
                <li>Информировать пользователей об изменениях в работе Платформы</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3">4.2. Администрация имеет право:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Вносить изменения в функционал Платформы</li>
                <li>Приостанавливать доступ к аккаунту при нарушении условий Соглашения</li>
                <li>Удалять контент, нарушающий законодательство или права третьих лиц</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">5. Интеллектуальная собственность</h2>
              <p className="mb-4">
                Все материалы Платформы, включая дизайн, тексты, графику, логотипы, являются объектами интеллектуальной 
                собственности и защищены законодательством об авторском праве.
              </p>
              <p>
                Пользователь не имеет права копировать, распространять или использовать материалы Платформы без письменного 
                разрешения администрации.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">6. Ответственность</h2>
              <p className="mb-4">
                Администрация не несет ответственности за действия пользователей, совершенные с использованием Платформы, 
                а также за возможный ущерб, возникший в результате использования или невозможности использования Платформы.
              </p>
              <p>
                Пользователь несет полную ответственность за контент, размещаемый им на Платформе, и за соблюдение 
                законодательства при использовании услуг.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">7. Изменение условий</h2>
              <p>
                Администрация оставляет за собой право вносить изменения в настоящее Соглашение. Пользователи будут 
                уведомлены об изменениях через Платформу или по электронной почте. Продолжение использования Платформы 
                после внесения изменений означает согласие с новыми условиями.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-4">8. Контактная информация</h2>
              <p>
                По всем вопросам, связанным с настоящим Соглашением, вы можете обращаться по адресу: 
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


